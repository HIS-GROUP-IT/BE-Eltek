import { IUser, TokenData } from "@/types/auth.types";
import { Token } from "typedi";

export interface IAuthService {
  signup(userData: IUser): Promise<TokenData>;
  login(userData: IUser): Promise<IUser>;
  refreshToken(token: string): Promise<TokenData>;
  logout(token: string): Promise<void>;
  sendOtp(email: string): Promise<string>;
  verifyOtp(email: string, otp: string): Promise<string>;
  updateUser(userData: Partial<IUser>): Promise<TokenData>;
}

export const AUTH_SERVICE_TOKEN = new Token<IAuthService>("IAuthService");
