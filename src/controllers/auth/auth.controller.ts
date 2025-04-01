import { NextFunction, Request, Response } from "express";
import { Container } from "typedi";
import { AUTH_SERVICE_TOKEN } from "@/interfaces/auth/IAuthService.interface";
import { DataStoreInToken, IUser, IUserLogin, TokenData } from "@/types/auth.types";
import { CustomResponse } from "@/types/response.interface";
import jwt from 'jsonwebtoken';
import crypto from "crypto";



export class AuthController {
    
    private auth ;

    constructor () {
        this.auth = Container.get(AUTH_SERVICE_TOKEN); 
    }

    public signup = async (req: Request, res: Response, next: NextFunction) => {
      try {
          const userData = req.body;
          const signUpUserData = await this.auth.signup(userData);
          
          res.cookie('access_token', signUpUserData.accessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'none', 
              maxAge: 72 * 60 * 60 * 1000,
              signed: true
          });
          
          res.cookie('user_data', JSON.stringify({
              id: userData.id, 
              email: userData.email,
              role: userData.role,
              fullName: userData.fullName,
              phoneNumber: userData.phoneNumber,
              employeeId: userData.employeeId
          }), {
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'none', 
              maxAge: 72 * 60 * 60 * 1000,
              signed: true
          });

          const response: CustomResponse<TokenData> = {
              data: signUpUserData,  
              message: "User registered successfully",
              error: false
          };
          res.status(201).json(response);
      } catch (error) {
          next(error);
      }
  }
  
  public login = async (req: Request, res: Response, next: NextFunction) => {
      try {
          const userData: IUserLogin = req.body;
          const loggedInUser = await this.auth.login(userData);
          
          res.cookie('access_token', loggedInUser.accessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'none', 
              maxAge: 72 * 60 * 60 * 1000,
              signed: true
          });
          
          res.cookie('user_data', JSON.stringify({
              id: loggedInUser.id, 
              email: userData.email,
              role: loggedInUser.role,
              fullName: loggedInUser.fullName,
              phoneNumber: loggedInUser.phoneNumber,
              employeeId: loggedInUser.employeeId
          }), {
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'none',
              maxAge: 72 * 60 * 60 * 1000,
              signed: true
          });

          const response: CustomResponse<TokenData> = {
              data: loggedInUser,
              message: "User logged in successfully",
              error: false
          };
          return res.status(201).json(response);
      } catch (error) {
          next(error);
      }
  }
  public signupAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData: IUser = req.body;
        const adminData : IUser = {
            ...userData,
            role:"admin"
        }
        const signUpUserData = await this.auth.signup(adminData);
        const response: CustomResponse<TokenData> = {
            data: signUpUserData,  
            message: "User registered successfully",
            error: false
        };
        res.status(201).json(response)
    } catch (error) {
        next(error);
    }
}

    public refreshToken = async (req:Request, res:Response,next:NextFunction)=>{
        try {
            const token : string = req.body.token;
            const newToken = await this.auth.refreshToken(token);
            const response : CustomResponse<TokenData> = {
                data : newToken,
                message : "Token refreshed sucessfully",
                error : false
            }            
            return res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    }

    public Logout = async (req:Request,res:Response , next:NextFunction) => {
        try {
            const token = req.params.token;
            console.log("Token",token)
            const deletedToken = await this.auth.logout(token.toString());
            const response : CustomResponse<null> = {
                data : null,
                message : "User logged out successfully",
                error : false
            }            
            return res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    }
    public sendOtp = async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { email } = req.body;
          const message = await this.auth.sendOtp(email);
          const response : CustomResponse<null> = {
            data : null,
            message :message,
            error : false
        }            
        return res.status(201).json(response);
        } catch (error) {
          next(error);
        }
      };

 
  public verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, otp } = req.body;
      const message = await this.auth.verifyOtp(email, otp);
      const response : CustomResponse<null> = {
        data : null,
        message :message,
        error : false
    }            
    return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  public updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, otp, newPassword } = req.body;
      const updatedUser = await this.auth.updatePassword(email, otp, newPassword);
      const response : CustomResponse<null> = {
        data : updatedUser,
        message : "User logged out successfully",
        error : false
    }            
    return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };
}


