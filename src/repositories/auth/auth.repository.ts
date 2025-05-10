import { Service } from "typedi";
import RefreshToken from "@/models/user/refreshToken.model";
import User from "@/models/user/user.model";
import { IUser } from "@/types/auth.types";
import { hash } from "bcryptjs";
import { IAuthRepository } from "@/interfaces/auth/IAuthRepository .interface";
import Employee from "@/models/employee/employee.model";

@Service()
export class AuthRepository implements IAuthRepository {
  public async findUserByEmail(email: string): Promise<IUser | null> {
    return User.findOne({
      where: { email },
      attributes: [
        "id",
        "email",
        "password",
        "role",
        "otp",
        "phoneNumber",
        "fullName",
        "employeeId",
        "position",
      ],
      raw: true,
    });
  }
  public async findById(userId: number): Promise<IUser> {
    return User.findOne({
      where: { id: userId },
      attributes: [
        "id",
        "email",
        "role",
        "fullName",
        "phoneNumber",
        "employeeId",
        "position",
      ],
      raw: true,
    });
  }

  public async findAllAdmins(): Promise<IUser[]> {
    return User.findAll({
      where: { role: "admin" },
      attributes: [
        "id",
        "email",
        "role",
        "fullName",
        "phoneNumber",
        "employeeId",
        "position",
        "createdAt",
        "updatedAt"
      ],
      raw: true,
    });
  }
  public async deleteUserById(userId: number): Promise<void> {
    const user = await User.findOne({ where: { id: userId } });  
    if (!user) {
      throw new Error("User not found");
    }
    await User.destroy({
      where: { id: userId },
    });
      await Employee.destroy({
      where: { email: user.email },
    });
  }
  
    
  public async saveOtp(email: string, otp: string): Promise<void> {
    const user = await User.findOne({
      where: { email },
      raw: false,
    });

    if (user) {
      await user.update({ otp });
    }
  }

  public async validateOtp(email: string, otp: string): Promise<IUser> {
    return User.findOne({
      where: { email, otp },
      raw: true,
    });
  }

  public async forgotPassword(
    email: string,
    otp: string,
    newPassword: string
  ): Promise<IUser> {
    const user = await User.findOne({
      where: { email },
      raw: false,
    });

    if (user) {
      const hashedPassword = await hash(newPassword, 10);
      await user.update({
        password: hashedPassword,
        otp: "",
      });
      return user.get({ plain: true });
    }
    throw new Error("User not found");
  }

  public async findUserById(userId: number): Promise<IUser | null> {
    return User.findByPk(userId, { raw: true });
  }

  public async createUser(userData: IUser): Promise<IUser> {
    if (userData.employeeId) {
      User.create(userData, { raw: true });
      return;
    }

    const transaction = await User.sequelize.transaction();
    function generateRandomNineDigits(): number {
      return Math.floor(100000000 + Math.random() * 900000000);
    }
    try {
        const employee = await Employee.create({
            fullName: userData.fullName,
            email: userData.email,
            phoneNumber: userData.phoneNumber || '',
            position: userData.position || '',
            role: userData.role ?? "",
            status: 'active',
            idNumber: generateRandomNineDigits().toString(), 
            gender: 'other', 
            location: '', 
          }, { transaction });
    

      const user = await User.create(
        {
          ...userData,
          employeeId: employee.id,
        },
        { transaction }
      );

      await transaction.commit();
      return user;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async saveRefreshToken(
    userId: number,
    token: string,
    expiresAt: Date
  ): Promise<void> {
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
      attributes: [
        "id",
        "email",
        "role",
        "fullName",
        "phoneNumber",
        "employeeId",
        "position",
      ],
      raw: true,
    });

    return updatedUser;
  }
  public async resetPasswordWithOtp(
    email: string,
    otp: string,
    newPassword: string
  ): Promise<IUser> {
    if (!email || !otp || !newPassword) {
      throw new Error("Email, OTP and new password are required");
    }
    const user = await User.findOne({
      where: { email, otp },
      raw: false,
    });

    if (!user) {
      throw new Error("Invalid OTP or email");
    }
    if (typeof newPassword !== "string" || newPassword.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    try {
      const hashedPassword = await hash(newPassword, 10);

      await user.update({
        password: hashedPassword,
        otp: "", 
      });

      return user.get({ plain: true });
    } catch (error) {
      throw new Error(`Password hashing failed: ${error.message}`);
    }
  }
}
