import { IUser, TokenData } from "@/types/auth.types";
import { Token } from "typedi";

export interface IAuthService {
  signup(userData: IUser): Promise<TokenData>;
  login(userData: IUser): Promise<TokenData>;
  refreshToken(token: string): Promise<TokenData>;
  logout(token: string): Promise<void>;
  sendOtp(email: string): Promise<string>;
  verifyOtp(email: string, otp: string): Promise<string>;
  updatePassword(
    email: string,
    otp: string,
    newPassword: string
  ): Promise<IUser>;
}

export const AUTH_SERVICE_TOKEN = new Token<IAuthService>("IAuthService");
