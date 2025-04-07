import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { Service } from "typedi";
import { SECRET_KEY } from "../../config";
import { HttpException } from "../../exceptions/HttpException";
import crypto from "crypto";
import { AuthRepository } from "@/repositories/auth/auth.repository";
import { AUTH_SERVICE_TOKEN, IAuthService } from "@/interfaces/auth/IAuthService.interface";
import { DataStoreInToken, IUser, IUserLogin, TokenData } from "@/types/auth.types";
import nodemailer from "nodemailer";
import { Response } from 'express';

@Service({ id: AUTH_SERVICE_TOKEN })
export class AuthService implements IAuthService {
    constructor(private readonly authRepository: AuthRepository) {}

    private async createToken(userData: IUser, res?: Response): Promise<TokenData> {
        const dataStoredInToken: DataStoreInToken = {
            id: userData.id,
            email: userData.email,
            role: userData.role,
            fullName: userData.fullName,
            phoneNumber: userData.phoneNumber,
            employeeId: userData.employeeId,
            position:userData.position
        };

        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 72);
        const accessToken = sign(
            dataStoredInToken,
            "X2nL0%@1kF9gB8yV7!pA&j5zZ0HgRpR4H",
            { expiresIn: "3d" }
        );
        
        const refreshToken = crypto.randomBytes(40).toString("hex");

        if (res) {
            res.cookie('user_data', JSON.stringify({
                email: userData.email,
                role: userData.role,
                fullName: userData.fullName,
                phoneNumber: userData.phoneNumber,
                employeeId: userData.employeeId,
                position : userData.position
            }), {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 72 * 60 * 60 * 1000,
                path: '/',
                signed: true 
            });
        }

        return { expiresAt, accessToken, refreshToken };
    }

    public async signup(userData: IUser): Promise<TokenData> {
        const findUser = await this.authRepository.findUserByEmail(userData.email);
        if (findUser) {
            throw new HttpException(409, `This email ${userData.email} already exists`);
        }
        const hashedPassword = await hash(userData.password, 10);
        const createdUser = await this.authRepository.createUser({
            ...userData,
            password: hashedPassword
        });
        return await this.createToken(createdUser);
    }

    public async login(userData: IUserLogin): Promise<IUser> {
        if (!userData.password) {
            throw new HttpException(400, "Password is required");
        }
    
        const findUser = await this.authRepository.findUserByEmail(userData.email);
        if (!findUser) {
            throw new HttpException(404, `Email ${userData.email} not found`);
        }
    
        if (!findUser.password) {
            throw new HttpException(404, "User password not found in database");
        }
    
        const comparePassword = await compare(userData.password, findUser.password);
        if (!comparePassword) {
            throw new HttpException(400, "Invalid password");
        }
    
        return findUser
    }

    public async refreshToken(token: string): Promise<TokenData> {
        if (!token) {
            throw new HttpException(404, "Token not provided");
        }

        const storedToken = await this.authRepository.findRefreshToken(token);
        if (!storedToken || new Date(storedToken.expiresAt) < new Date()) {
            throw new HttpException(401, "Invalid or expired token");
        }

        const user = await this.authRepository.findUserById(storedToken.userId);
        if (!user) {
            throw new HttpException(404, `User associated with this token not found`);
        }

        const newToken = await this.createToken(user);
        await this.authRepository.deleteRefreshToken(token);
        await this.authRepository.saveRefreshToken(user.id, newToken.refreshToken, newToken.expiresAt);
        return newToken;
    }

    public async logout(token: string): Promise<void> {
        await this.authRepository.deleteRefreshToken(token);
    }

    public async sendOtp(email: string): Promise<string> {
        const user = await this.authRepository.findUserByEmail(email);
        if (!user) {
            throw new HttpException(404, "User Not Found");
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await this.authRepository.saveOtp(email, otp);
        
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });    
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset OTP",
            html: `<p>Your OTP to reset your password is <strong>${otp}</strong></p>`,
        };    
        
        await transporter.sendMail(mailOptions);    
        return "OTP sent to your email";
    }

    public async verifyOtp(email: string, otp: string): Promise<string> {
        const isValid = await this.authRepository.validateOtp(email, otp);
        if (!isValid) {
            throw new HttpException(400, "Invalid or expired OTP");
        }
        return "OTP verified successfully";
    }

    public async updateUser(userData: Partial<IUser>): Promise<TokenData> {
        if (!userData.id) {
            throw new HttpException(400, 'User ID is required for update');
        }
    
        const existingUser = await this.authRepository.findById(userData.id);
        if (!existingUser) {
            throw new HttpException(404, 'User not found');
        }
    
        if (userData.password) {
            userData.password = await hash(userData.password, 10);
        }
    
        const updateResult = await this.authRepository.updateUser(userData);
    
        if (!updateResult) {
            throw new HttpException(500, 'Failed to update user');
        }
    
        // 🔥 Fetch the updated user with all necessary fields
        const updatedUser = await this.authRepository.findById(userData.id);
    
        if (!updatedUser) {
            throw new HttpException(500, 'Failed to retrieve updated user');
        }
    
        return await this.createToken(updatedUser);
    }
    
      

}