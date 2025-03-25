import { Router } from "express";
import { Routes } from "@/types/routes.interface";
import { ValidationMiddleware } from "@/middlewares/ValidationMiddleware";
import { AssignRemoveEmployee, CreateProfileDto, UpdateProfileDto } from "@/dots/profile/profile.dto";
import { ProfileController } from "@/controllers/profile/profile.controller";
import { authorizationMiddleware } from "@/middlewares/authorizationMiddleware";

export class ProfileRoute implements Routes {
    public path = "/profiles";
    public router = Router();
    public profileController = new ProfileController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Create a new profile
        this.router.post(`${this.path}/createProfile`,authorizationMiddleware, ValidationMiddleware(CreateProfileDto), this.profileController.CreateProfile);

        // Update an existing profile
        this.router.put(`${this.path}/updateProfile`,authorizationMiddleware, ValidationMiddleware(UpdateProfileDto), this.profileController.UpdateProfile);

        // Assign an employee to a project
        this.router.put(`${this.path}/assignEmployee/:projectId`, authorizationMiddleware, this.profileController.AssignEmployee);

        // Remove an employee from a project
        this.router.put(`${this.path}/removeEmployee/:projectId`,authorizationMiddleware, this.profileController.RemoveEmployee);

        // Get profile by user ID
        this.router.get(`${this.path}/getProfile`,authorizationMiddleware, this.profileController.GetProfileByUserId);

        // Get all profiles
        this.router.get(`${this.path}/getAllProfiles`, authorizationMiddleware,this.profileController.GetAllProfiles);
    }
}
