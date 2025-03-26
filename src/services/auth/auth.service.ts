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
import { Model } from "sequelize";


const createToken = async (userData: IUser): Promise<TokenData> => {
    const dataStoredIntoken: DataStoreInToken = {
        id: userData.id,
        email: userData.email,
        role : userData.role
    };
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const accessToken = sign(dataStoredIntoken, SECRET_KEY, { expiresIn: "1h" });
    const refreshToken = crypto.randomBytes(40).toString("hex");
    return { expiresAt, accessToken, refreshToken };
}

@Service({ id: AUTH_SERVICE_TOKEN, type: AuthService })
export class AuthService implements IAuthService {
    constructor(public authRepository: AuthRepository) {}

    public async signup(userData: IUser): Promise<TokenData> {
        const findUser = await this.authRepository.findUserByEmail(userData.email);
        if (findUser) {
            throw new HttpException(409, `This email ${userData.email} already exists`);
        }
        const hashedPassword = await hash(userData.password, 10);
        const createdUser = await this.authRepository.createUser({
            email: userData.email,
            password: hashedPassword,
            role: userData.role
        });
        const tokenData = await createToken(createdUser);
        await this.authRepository.saveRefreshToken(createdUser.id, tokenData.refreshToken, tokenData.expiresAt);
        return tokenData;
    }

    public async login(userData: IUserLogin): Promise<TokenData> {
      // Check if userData.password is provided
      if (!userData.password) {
          throw new HttpException(400, "Password is required");
      }
  
      const findUser = await this.authRepository.findUserByEmail(userData.email);
      console.log('User Data:', findUser); // Check if user data is correct and not undefined
      if (!findUser) {
          throw new HttpException(404, `Email ${userData.email} not found`);
      }
  
      console.log('Raw user data:', JSON.stringify(findUser));
      console.log('Is Sequelize instance:', findUser instanceof Model);
  
      // Ensure that the password is a valid string
      if (!findUser.password) {
          throw new HttpException(404, "User password not found in database");
      }
  
      const comparePassword = await compare(userData.password, findUser.password);
      if (!comparePassword) {
          throw new HttpException(400, "Invalid password");
      }
  
      const tokenData = await createToken(findUser);
      console.log('Token Data:', tokenData); // Check if tokenData is correct and not undefined
  
      // Save refresh token
      await this.authRepository.saveRefreshToken(findUser.id, tokenData.refreshToken, tokenData.expiresAt);
      return tokenData;
  }

    public async refreshToken(token: string): Promise<TokenData> {
        if (!token) {
            throw new HttpException(404, "Token not provided");
        }

        const storedToken = await this.authRepository.findRefreshToken(token);
        if (!storedToken || storedToken.expiresAt < new Date()) {
            throw new HttpException(401, "Invalid or expired token");
        }

        const user = await this.authRepository.findUserById(storedToken.userId);
        if (!user) {
            throw new HttpException(404, `User associated with this token not found`);
        }

        const newToken = await createToken(user);
        await this.authRepository.deleteRefreshToken(storedToken.token);
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
          port: process.env.EMAIL_PORT,
          secure: false,
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

  public async updatePassword(email: string, otp: string, newPassword: string): Promise<IUser> {
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) {
      throw new HttpException(404, "User Not Found");
    }
    if (user.otp !== otp) {
      throw new HttpException(400, "Invalid OTP");
    }
    const updatedUser = await this.authRepository.forgotPassword(email, otp, newPassword);
    return updatedUser;
  }
    
}
