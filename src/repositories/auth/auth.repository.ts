import { Service } from "typedi";
import RefreshToken from "@/models/user/refreshToken.model";
import User from "@/models/user/user.model";
import { IUser } from "@/types/auth.types";
import { hash } from "bcrypt";
import { IAuthRepository } from "@/interfaces/auth/IAuthRepository .interface";


@Service()
export class AuthRepository implements IAuthRepository {
    public async findUserByEmail(email: string): Promise<IUser | null> {
        return await User.findOne({ where: { email } });
    }
    public async saveOtp(email: string, otp: string): Promise<void> {
        const user = await User.findOne({ where: { email } });
        if (user) {
          user.otp = otp;
          await user.save();
        }
      }

      public async validateOtp(email: string, otp: string): Promise<IUser> {
        const user = await User.findOne({ where: { email, otp } });
        return user;
      }

      public async forgotPassword(email: string, otp: string, newPassword: string) : Promise<IUser>{
        const isUserExist = await User.findOne({ where: { email} });
        const hashedPassword = await hash(newPassword, 10);
        isUserExist.password = hashedPassword;
        isUserExist.otp = ''; 
         await isUserExist.save();
         return isUserExist;
      }

    public async findUserById(userId: number): Promise<IUser | null> {
        return await User.findByPk(userId);
    } 

    public async createUser(userData: IUser): Promise<IUser> {
        return await User.create(userData);
    }

    public async saveRefreshToken(userId: number, token: string, expiresAt: Date): Promise<void> {
        await RefreshToken.create({ token, userId, expiresAt });
    }

    public async findRefreshToken(token: string): Promise<RefreshToken | null> {
        return await RefreshToken.findOne({ where: { token } });
    }

    public async deleteRefreshToken(token: string): Promise<void> {
        await RefreshToken.destroy({ where: { token } });
    }
}