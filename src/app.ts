import 'reflect-metadata';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { NextFunction, Response } from "express";
import helmet from 'helmet';
import hpp from "hpp";
import morgan from 'morgan';
import { NODE_ENV, PORT, LOG_FORMAT, CREDENTIALS } from '@config';
import dbConnection from './database';  // Sequelize DB connection
import { ErrorMiddleware } from './middlewares/ErrorMiddleware';
import { logger, stream } from './utils/logger';
// import { RateLimiterRedis } from "rate-limiter-flexible";
// import Redis from "ioredis";
// import { rateLimit } from "express-rate-limit";
// import RedisStore, { RedisReply } from 'rate-limit-redis';
import Container from 'typedi';
import { AUTH_SERVICE_TOKEN } from './interfaces/auth/IAuthService.interface';
import { AuthService } from './services/auth/auth.service';
import { AuthRepository } from './repositories/auth/auth.repository';
import { Routes } from './types/routes.interface';

import { RequestWithUserAndRedis } from './types/redis.interface';
import { PROJECT_SERVICE_TOKEN } from './interfaces/project/IProjectService';
import { ProjectRepository } from './repositories/project/project.repository';
import { ProjectService } from './services/project/project.service';
import { PROFILE_SERVICE_TOKEN } from './interfaces/profile/IProfileService';
import { ProfileRepository } from './repositories/profile/profile.repository';
import { ProfileService } from './services/profile/profile.service';
import { TIMESHEET_SERVICE_TOKEN } from './interfaces/timesheet/ITimeSheetService.interface';
import { TimesheetService } from './services/project/timesheet.service';
import { TimesheetRepository } from './repositories/project/timesheet.repository';

export class App {
    public app: express.Application;
    public env: string;
    public port: string | number;
    
    // private redisClient: Redis;

    constructor(routes: Routes[]) {
        this.app = express();
        this.env = NODE_ENV || "development";
        this.port = PORT || 3001;
        // this.redisClient = new Redis({
        //     port: 6379, // Default port for Redis
        //     host: 'timepay-tracker-ga8wlc.serverless.eun1.cache.amazonaws.com', // Your ElastiCache Redis endpoint
        //     tls: {}  // Enabling TLS for the connection
        // });
        this.initializeInterfaces();
        // Initialize the database connection
        this.connectToDatabase();

        this.initializeMiddlewares();
        // this.initializeRedis();
        // this.initializeRateLimiter();
        this.initializeRoutes(routes);
        this.initializeErrorHandling();
    }

    public listen() {
        this.app.listen(this.port, () => {
            logger.info(`=================================`);
            logger.info(`======= ENV: ${this.env} =======`);
            logger.info(`🚀 Identity Service listening on port ${this.port}`);
            logger.info(`=================================`);
        });
    }

    public getServer() {
        return this.app;
    }

    public async connectToDatabase() {
        try {
            // Attempt to authenticate the connection to the database
            await dbConnection.authenticate();
            logger.info('Database connection established successfully.');
            console.log('Database connection established successfully.');
    
            // Sync models with the database
            await dbConnection.sync({ force: false }); // Set `force: true` to drop and recreate tables
            logger.info('Database tables synced successfully.');
            
    
        } catch (error) {
            logger.error('Unable to connect to the database:', error);
            process.exit(1);  // Exit the process if the DB connection fails
        }
    }
    

    private initializeMiddlewares() {
        this.app.use(morgan(LOG_FORMAT, { stream }));
        this.app.use(cors({ origin: "*", credentials: CREDENTIALS }));
        this.app.use(hpp());
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
    }

    // private rateLimiter = new RateLimiterRedis({
    //     storeClient: this.redisClient,
    //     keyPrefix: "middleware",
    //     points: 10, // Max 10 requests
    //     duration: 1, // Per second
    // });

    // private initializeRateLimiter() {
    //     this.app.use((req, res, next) => {
    //         this.rateLimiter.consume(req.ip)
    //             .then(() => next())
    //             .catch(() => {
    //                 logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    //                 res.status(429).json({
    //                     success: false,
    //                     message: "Too many requests",
    //                 });
    //             });
    //     });

    //     const sensitiveEndpointLimiter = rateLimit({
    //         windowMs: 15 * 60 * 1000,
    //         max: 50,
    //         standardHeaders: true,
    //         legacyHeaders: false,
    //         handler: (req, res) => {
    //             logger.warn(`Sensitive endpoint rate limit exceeded for IP: ${req.ip}`);
    //             res.status(429).json({
    //                 success: false,
    //                 message: "Too many requests"
    //             });
    //         },
        
    //         store: new RedisStore({
    //             sendCommand: async (...args: [string, ...unknown[] | any]): Promise<RedisReply> => {
    //                 return await this.redisClient.call(...args) as RedisReply;
    //             },
    //         }),
    //     });
        

    //     this.app.use("/api/auth", sensitiveEndpointLimiter); 
    // }

    private initializeInterfaces() {
         Container.set(AUTH_SERVICE_TOKEN, new AuthService(Container.get(AuthRepository)));
         Container.set(PROJECT_SERVICE_TOKEN, new ProjectService(Container.get(ProjectRepository)));
         Container.set(PROFILE_SERVICE_TOKEN, new ProfileService(Container.get(ProfileRepository)));
         Container.set(TIMESHEET_SERVICE_TOKEN,new TimesheetService(Container.get(TimesheetRepository)));

        }

    private initializeRoutes(routes: Routes[]) {
        routes.forEach(route => {
            this.app.use("/api", route.router);
        });
    }

    // private initializeRedis() {
    //     this.app.use("/api/profile", (req: RequestWithUserAndRedis, res: Response, next: NextFunction) => {
    //         req.redisClient = this.redisClient;
    //         next();
    //     });
    // }
    

    private initializeErrorHandling() {
        this.app.use(ErrorMiddleware);
    }
}
