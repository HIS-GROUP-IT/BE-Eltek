import { IProfile } from "@/types/profile.types";
import { Token } from "typedi";


export interface IProfileService {
        createProfile(profileData: Partial<IProfile>): Promise<IProfile>;
        updateProfile(profileData: Partial<IProfile>): Promise<IProfile>;
        assignEmployee(projectId: number, employeeId: number): Promise<IProfile>;
        removeEmployee(projectId: number, employeeId: number): Promise<IProfile>;
        getAllProfiles(): Promise<IProfile[]> 
        getProfileByUserId(userId: number): Promise<IProfile | null> 
}

export const PROFILE_SERVICE_TOKEN = new Token<IProfileService>("IProfileService");