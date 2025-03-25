import { Request } from "express";
import Redis from "ioredis";
import { IUser } from "./auth.types";


export interface RequestWithUserAndRedis extends Request {
    user: IUser;
    redisClient: Redis;
    file: Express.Multer.File;
}