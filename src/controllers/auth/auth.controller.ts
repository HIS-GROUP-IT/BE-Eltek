import { NextFunction, Request, Response } from "express";
import { Container } from "typedi";
import { AUTH_SERVICE_TOKEN } from "@/interfaces/auth/IAuthService.interface";
import { DataStoreInToken, IUser, IUserLogin, TokenData } from "@/types/auth.types";
import { CustomResponse } from "@/types/response.interface";
import jwt from 'jsonwebtoken';
import crypto from "crypto";
import { otpEmailTemplate, sendMail, welcomeEmployeeTemplate } from "@/utils/email";
import { HttpException } from "@/exceptions/HttpException";
import { FRONT_END_URL } from "@/config";

export class AuthController {
    private auth;

    constructor() {
        this.auth = Container.get(AUTH_SERVICE_TOKEN);
    }

    private setAuthCookies(res: Response, tokenData: TokenData, userData: IUser) {
        const isProduction = true;
        const domain = isProduction ? FRONT_END_URL : 'localhost';
    
        res.cookie('access_token', tokenData.accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 259200000,
            path: '/',
            signed: true  
        });
    
        res.cookie('user_data', JSON.stringify({
            id: userData.id,
            email: userData.email,
            role: userData.role,
            fullName: userData.fullName,
            phoneNumber: userData.phoneNumber,
            employeeId: userData.employeeId,
            position : userData.position
        }), {
            httpOnly: false,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 259200000,
            path: '/',
            signed: true  
        });
    }
    
    private clearAuthCookies(res: Response) {
        const isProduction =true;
        const domain = isProduction ? FRONT_END_URL : 'localhost';

        res.clearCookie('access_token', {

            path: '/',
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax'
        });

        res.clearCookie('user_data', {
 
            path: '/',
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax'
        });
    }

    private createToken(userData: DataStoreInToken): TokenData {
        const payload: DataStoreInToken = {
            id: userData.id,
            email: userData.email,
            role: userData.role,
            fullName: userData.fullName,
            phoneNumber: userData.phoneNumber,
            employeeId: userData.employeeId,
            position:userData.position
        };

        return {
            expiresAt: new Date(Date.now() + 259200000),
            accessToken: jwt.sign(payload, "X2nL0%@1kF9gB8yV7!pA&j5zZ0HgRpR4H", { expiresIn: "3d" }),
            refreshToken: crypto.randomBytes(40).toString("hex")
        };
    }

    public signup = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData = req.body;
            const signUpUserData = await this.auth.signup(userData);
            // this.setAuthCookies(res, signUpUserData, userData);
            const response: CustomResponse<TokenData> = { data: signUpUserData, message: "User registered successfully", error: false };
            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    }

    public signupAdmin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: IUser = req.body;
            const adminData = { ...userData, role: "admin" };
            const signUpUserData = await this.auth.signup(adminData);   
            await sendMail(userData.email,
                "Your Eltek account has been successfully created",
                `Good Day ${userData.fullName}`,
                welcomeEmployeeTemplate(userData.fullName,
                    "Eltek",
                   FRONT_END_URL,
                    
                )
            )                     
            const response: CustomResponse<TokenData> = { data: signUpUserData, message: "Admin registered successfully", error: false };
            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    }

    public login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: IUserLogin = req.body;
            const loggedInUser = await this.auth.login(userData);            
            const tokenData = this.createToken({
                id: loggedInUser.id,
                email: loggedInUser.email,
                role: loggedInUser.role,
                fullName: loggedInUser.fullName,
                phoneNumber: loggedInUser.phoneNumber,
                employeeId: loggedInUser.employeeId,
                position:loggedInUser.position
            });
            
            this.setAuthCookies(res, tokenData, loggedInUser);
            
            const response: CustomResponse<TokenData> = { 
                data: tokenData, 
                message: "User logged in successfully", 
                error: false 
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    public refreshToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token: string = req.body.token;
            const newToken = await this.auth.refreshToken(token);
            this.setAuthCookies(res, newToken, newToken);
            const response: CustomResponse<TokenData> = { data: newToken, message: "Token refreshed successfully", error: false };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    

    public logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.params.token;
            await this.auth.logout(token.toString());
            this.clearAuthCookies(res);
            const response: CustomResponse<null> = { data: null, message: "User logged out successfully", error: false };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    public sendOtp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;
            console.log("Email", email)
            const message = await this.auth.sendOtp(email);
            await sendMail(
                email,
                "One Time OTP",
                "One time OTP",
                otpEmailTemplate(message.fullName,message.otp,"Eltek","Reset Password")
            )           
            const response: CustomResponse<null> = { data: null, message:"OTP sent successfully", error: false };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    public verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, otp } = req.body;
            const message = await this.auth.verifyOtp(email, otp);
            const response: CustomResponse<null> = { data: null, message, error: false };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    public updatePasswordWithOtp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, otp, newPassword } = req.body;
            
            // Basic validation in controller
            if (!email || !otp || !newPassword) {
                throw new HttpException(400, "Email, OTP and new password are required");
            }
    
            const updatedUser = await this.auth.resetPassword(
                email,
                otp,
                newPassword
            );
    
            const response: CustomResponse<IUser> = { 
                data: updatedUser, 
                message: "Password updated successfully", 
                error: false 
            };
            
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
    public updateUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: Partial<IUser> = req.body;
            const updatedUser = await this.auth.updateUser(userData);
            const response: CustomResponse<IUser> = { data: updatedUser, message: "User updated successfully", error: false };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    public findAllAdmins = async (req: Request, res: Response, next: NextFunction) => {
        try {          
            const admins = await this.auth.findAllAdmins();
            const response: CustomResponse<IUser> = { data: admins, message: "admins fetched successfully", error: false };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    public deleteUserById = async (req: Request, res: Response, next: NextFunction) => {
        try {          
            const userId = req.params.id
            const admins = await this.auth.deleteUserById(userId);
            const response: CustomResponse<any> = { data: admins, message: "user deleted successfully", error: false };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
}