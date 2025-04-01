import { NextFunction, Request, Response } from "express";
import { Container } from "typedi";
import { AUTH_SERVICE_TOKEN } from "@/interfaces/auth/IAuthService.interface";
import { DataStoreInToken, IUser, IUserLogin, TokenData } from "@/types/auth.types";
import { CustomResponse } from "@/types/response.interface";

export class AuthController {
    private auth;

    constructor() {
        this.auth = Container.get(AUTH_SERVICE_TOKEN);
    }

    private setAuthCookies(res: Response, tokenData: TokenData, userData: IUser) {
        const frontendDomain = 'eltek-frontend.vercel.app';

        res.cookie('access_token', tokenData.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            domain: frontendDomain,
            maxAge: 72 * 60 * 60 * 1000,
            path: '/'
        });

        res.cookie('user_data', JSON.stringify({
            id: userData.id,
            email: userData.email,
            role: userData.role,
            fullName: userData.fullName,
            phoneNumber: userData.phoneNumber,
            employeeId: userData.employeeId
        }), {
            httpOnly: false,
            secure: true,
            sameSite: 'none',
            domain: frontendDomain,
            maxAge: 72 * 60 * 60 * 1000,
            path: '/'
        });
    }

    private clearAuthCookies(res: Response) {
        const frontendDomain = 'eltek-frontend.vercel.app';

        ['access_token', 'user_data'].forEach(cookieName => {
            res.clearCookie(cookieName, {
                domain: frontendDomain,
                path: '/',
                secure: true,
                sameSite: 'none'
            });
        });
    }

    public signup = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData = req.body;
            const signUpUserData = await this.auth.signup(userData);
            
            this.setAuthCookies(res, signUpUserData, {
                ...userData,
                id: signUpUserData.id
            });

            const response: CustomResponse<TokenData> = {
                data: signUpUserData,
                message: "User registered successfully",
                error: false
            };
            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    }

    public signupAdmin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: IUser = req.body;
            const adminData: IUser = {
                ...userData,
                role: "admin"
            };
            const signUpUserData = await this.auth.signup(adminData);
            
            this.setAuthCookies(res, signUpUserData, adminData);

            const response: CustomResponse<TokenData> = {
                data: signUpUserData,
                message: "Admin registered successfully",
                error: false
            };
            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    }

    public login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: IUserLogin = req.body;
            const loggedInUser = await this.auth.login(userData);
            const userDetails = await this.auth.getUserById(loggedInUser.id);
            
            this.setAuthCookies(res, loggedInUser, userDetails);

            const response: CustomResponse<TokenData> = {
                data: loggedInUser,
                message: "User logged in successfully",
                error: false
            };
            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    public refreshToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token: string = req.body.token;
            const newToken = await this.auth.refreshToken(token);
            const user = await this.auth.getUserById(newToken.id);
            
            this.setAuthCookies(res, newToken, user);

            const response: CustomResponse<TokenData> = {
                data: newToken,
                message: "Token refreshed successfully",
                error: false
            };
            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    public logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.params.token;
            await this.auth.logout(token.toString());
            this.clearAuthCookies(res);
            
            const response: CustomResponse<null> = {
                data: null,
                message: "User logged out successfully",
                error: false
            };
            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    public sendOtp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;
            const message = await this.auth.sendOtp(email);
            
            const response: CustomResponse<null> = {
                data: null,
                message: message,
                error: false
            };
            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    public verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, otp } = req.body;
            const message = await this.auth.verifyOtp(email, otp);
            
            const response: CustomResponse<null> = {
                data: null,
                message: message,
                error: false
            };
            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    public updatePassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, otp, newPassword } = req.body;
            const updatedUser = await this.auth.updatePassword(email, otp, newPassword);
            
            const response: CustomResponse<IUser> = {
                data: updatedUser,
                message: "Password updated successfully",
                error: false
            };
            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
}