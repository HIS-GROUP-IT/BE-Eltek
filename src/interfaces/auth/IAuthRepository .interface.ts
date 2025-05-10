import RefreshToken from "@/models/user/refreshToken.model";
import { IUser, TokenData } from "@/types/auth.types";

export interface IAuthRepository {
    findUserByEmail(email: string): Promise<IUser | null>;
    createUser(userData: Partial<IUser>): Promise<IUser>;
    saveRefreshToken(userId: number, token: string, expiresAt: Date): Promise<void>;
    findRefreshToken(token: string): Promise<RefreshToken | null> 
    findUserById(userId: number): Promise<IUser | null>;
    deleteRefreshToken(tokenId: string): Promise<void>;
    saveOtp(email: string, otp: string): Promise<void>
    validateOtp(email: string, otp: string): Promise<IUser>
    forgotPassword(email: string, otp: string, newPassword: string) : Promise<IUser>;
    updateUser(userData: Partial<IUser>): Promise<IUser>;
    findById(userId: number): Promise<IUser>;
    findAllAdmins(): Promise<IUser[]>;
    deleteUserById(userId: number): Promise<any>
  
   
}
