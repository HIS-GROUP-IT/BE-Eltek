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
        // const isProduction = process.env.NODE_ENV === 'production';
        const frontendDomain = 'eltek-frontend.vercel.app'; // Directly use your Vercel domain

        // Access token cookie
        res.cookie('access_token', tokenData.accessToken, {
            httpOnly: true,
            secure: true, // Must be true for Vercel
            sameSite: 'none', // Required for cross-domain cookies
            domain: frontendDomain ?? 'localhost',
            maxAge: 72 * 60 * 60 * 1000, // 3 days
            path: '/'
        });

        // User data cookie (accessible to client-side)
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
            domain: frontendDomain ?? 'localhost',
            maxAge: 72 * 60 * 60 * 1000,
            path: '/'
        });
    }

    private clearAuthCookies(res: Response) {
        // const isProduction = process.env.NODE_ENV === 'production';
        const frontendDomain = 'eltek-frontend.vercel.app';

        ['access_token', 'user_data'].forEach(cookieName => {
            res.clearCookie(cookieName, {
                domain: frontendDomain ?? 'localhost',
                path: '/',
                secure: true,
                sameSite: 'none'
            });
        });
    }

    public login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: IUserLogin = req.body;
            const loggedInUser = await this.auth.login(userData);
            
            // Get full user details
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

    // ... keep other methods with similar cookie handling
}