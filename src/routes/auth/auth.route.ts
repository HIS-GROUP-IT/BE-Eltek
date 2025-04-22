import { Router } from "express";
import { AuthController } from "../../controllers/auth/auth.controller";
import { ValidationMiddleware } from "@/middlewares/ValidationMiddleware";
import { Routes } from "@/types/routes.interface";
import { CreateUserDto } from "@/dots/auth/user.dot";
import { SuperAdminAuthorizationMiddleware } from "@/middlewares/authorizationMiddleware";

export class AuthRoute implements Routes {
    public path = "/auth";
    public router = Router();
    public auth = new AuthController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/signup`, ValidationMiddleware(CreateUserDto), this.auth.signup);
        this.router.post(`${this.path}/login`, this.auth.login);
        this.router.post(`${this.path}/refreshtoken`, this.auth.refreshToken);
        this.router.post(`${this.path}/send-otp`, this.auth.sendOtp); 
        this.router.post(`${this.path}/verify-otp`, this.auth.verifyOtp); 
        this.router.post(`${this.path}/update-password`, this.auth.updatePasswordWithOtp); 
        this.router.post(`${this.path}/signUpAdmin`,SuperAdminAuthorizationMiddleware, ValidationMiddleware(CreateUserDto), this.auth.signupAdmin); 
        this.router.put(`${this.path}/updateUser`, this.auth.updateUser);
    }
}
