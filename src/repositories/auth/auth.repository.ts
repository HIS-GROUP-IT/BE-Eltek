import { Service } from "typedi";
import RefreshToken from "@/models/user/refreshToken.model";
import User from "@/models/user/user.model";
import { IUser, TokenData } from "@/types/auth.types";
import { hash } from "bcryptjs";
import { IAuthRepository } from "@/interfaces/auth/IAuthRepository .interface";

@Service()
export class AuthRepository implements IAuthRepository {
    public async findUserByEmail(email: string): Promise<IUser | null> {
        return User.findOne({
            where: { email },
            attributes: ['id', 'email', 'password', 'role', 'otp', 'phoneNumber', 'fullName', 'employeeId', 'position'],
            raw: true
        });
    }
    public async findById(userId: number): Promise<IUser> {
        return User.findOne({
          where: { id: userId },
          attributes: ['id', 'email', 'role', 'fullName', 'phoneNumber', 'employeeId', 'position'],
          raw: true
        });
      }
      
    public async saveOtp(email: string, otp: string): Promise<void> {
        const user = await User.findOne({
            where: { email },
            raw: false
        });

        if (user) {
            await user.update({ otp });
        }
    }

    public async validateOtp(email: string, otp: string): Promise<IUser> {
        return User.findOne({
            where: { email, otp },
            raw: true
        });
    }

    public async forgotPassword(email: string, otp: string, newPassword: string): Promise<IUser> {
        const user = await User.findOne({
            where: { email },
            raw: false
        });

        if (user) {
            const hashedPassword = await hash(newPassword, 10);
            await user.update({
                password: hashedPassword,
                otp: ''
            });
            return user.get({ plain: true });
        }
        throw new Error("User not found");
    }

    public async findUserById(userId: number): Promise<IUser | null> {
        return User.findByPk(userId, { raw: true });
    }

    public async createUser(userData: IUser): Promise<IUser> {
        console.log("Employee data", userData)
        return User.create(userData, { raw: true });
    }

    public async saveRefreshToken(userId: number, token: string, expiresAt: Date): Promise<void> {
        await RefreshToken.create({ token, userId, expiresAt });
    }

    public async findRefreshToken(token: string): Promise<RefreshToken | null> {
        return RefreshToken.findOne({ where: { token }, raw: true });
    }

    public async deleteRefreshToken(token: string): Promise<void> {
        await RefreshToken.destroy({ where: { token } });
    }

    public async updateUser(userData: Partial<IUser>): Promise<IUser> {
        const user = await User.findOne({
          where: { id: userData.id },
          raw: false, 
        });
      
        if (!user) {
          return null;
        }
      
        await user.update(userData);
      
        const updatedUser = await User.findOne({
          where: { id: userData.id },
          attributes: ['id', 'email', 'role', 'fullName', 'phoneNumber', 'employeeId', 'position'],
          raw: true,
        });
      
        return updatedUser;
      }
      
}

