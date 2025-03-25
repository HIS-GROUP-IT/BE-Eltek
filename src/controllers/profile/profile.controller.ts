import { NextFunction, Request, Response } from "express";
import { Container } from "typedi";
import { PROFILE_SERVICE_TOKEN } from "@/interfaces/profile/IProfileService";
import { CustomResponse } from "@/types/response.interface";
import { IProfile } from "@/types/profile.types";
import { RequestWithUser } from "@/types/auth.types";

export class ProfileController {
    private profileService;

    constructor() {
        this.profileService = Container.get(PROFILE_SERVICE_TOKEN);
    }

    public CreateProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const profileData: Partial<IProfile> = req.body;
            const createdProfile = await this.profileService.createProfile(profileData);
            const response: CustomResponse<IProfile> = {
                data: createdProfile,
                message: "Profile created successfully",
                error: false
            };
            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    };

    public UpdateProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const profileData: Partial<IProfile> = req.body;
            const updatedProfile = await this.profileService.updateProfile(profileData);
            const response: CustomResponse<IProfile> = {
                data: updatedProfile,
                message: "Profile updated successfully",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public AssignEmployee = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
          const projectId = req.params.projectId;
            const user = req.user

            const updatedProfile = await this.profileService.assignEmployee(+projectId, +user);
            const response: CustomResponse<IProfile> = {
                data: updatedProfile,
                message: "Employee assigned successfully",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public RemoveEmployee = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const projectId = req.params.projectId;
            const user = req.user
            const updatedProfile = await this.profileService.removeEmployee(+projectId, +user);
            const response: CustomResponse<IProfile> = {
                data: updatedProfile,
                message: "Employee removed successfully",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public GetProfileByUserId = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
          const userId = req.user
            const profile = await this.profileService.getProfileByUserId(+userId);
            const response: CustomResponse<IProfile | null> = {
                data: profile,
                message: profile ? "Profile retrieved successfully" : "Profile not found",
                error: !profile
            };
            res.status(profile ? 200 : 404).json(response);
        } catch (error) {
            next(error);
        }
    };

    public GetAllProfiles = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const profiles = await this.profileService.getAllProfiles();
            const response: CustomResponse<IProfile[]> = {
                data: profiles,
                message: "Profiles retrieved successfully",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };
}
