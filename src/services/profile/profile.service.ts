import { Service } from "typedi";
import { IProfileRepository } from "@/interfaces/profile/IProfileRepository.interface";
import { IProfileService, PROFILE_SERVICE_TOKEN } from "@/interfaces/profile/IProfileService";
import { IProfile } from "@/types/profile.types";
import { HttpException } from "@/exceptions/HttpException"; // Custom Exception handling class
import { ProfileRepository } from "@/repositories/profile/profile.repository";

@Service({ id: PROFILE_SERVICE_TOKEN, type: ProfileService })
export class ProfileService implements IProfileService {
    constructor(private profileRepository: ProfileRepository) {}

    public async createProfile(profileData: Partial<IProfile>): Promise<IProfile> {
        try {
            return await this.profileRepository.createProfile(profileData);
        } catch (error) {
            throw new HttpException(500, `Error creating profile: ${error.message}`);
        }
    }

    public async updateProfile(profileData: Partial<IProfile>): Promise<IProfile> {
        try {
            return await this.profileRepository.updateProfile(profileData);
        } catch (error) {
            throw new HttpException(500, `Error updating profile: ${error.message}`);
        }
    }

    public async assignEmployee(projectId: number, employeeId: number): Promise<IProfile> {
        try {
            return await this.profileRepository.assignEmployee(projectId, employeeId);
        } catch (error) {
            throw new HttpException(500, `Error assigning employee: ${error.message}`);
        }
    }

    public async removeEmployee(projectId: number, employeeId: number): Promise<IProfile> {
        try {
            return await this.profileRepository.removeEmployee(projectId, employeeId);
        } catch (error) {
            throw new HttpException(500, `Error removing employee: ${error.message}`);
        }
    }

    // Get all profiles
    public async getAllProfiles(): Promise<IProfile[]> {
        try {
            return await this.profileRepository.getAllProfiles();
        } catch (error) {
            throw new HttpException(500, `Error retrieving profiles: ${error.message}`);
        }
    }

    // Get profile by user ID
    public async getProfileByUserId(userId: number): Promise<IProfile | null> {
        try {
            return await this.profileRepository.getProfileByUserId(userId);
        } catch (error) {
            throw new HttpException(500, `Error retrieving profile: ${error.message}`);
        }
    }
}
