import { IProfile } from "@/types/profile.types";


export interface IProfileRepository {
        createProfile(profileData: Partial<IProfile>): Promise<IProfile>;
        updateProfile(profileData: Partial<IProfile>): Promise<IProfile>;
        assignEmployee(projectId: number, employeeId: number): Promise<IProfile>;
        removeEmployee(projectId: number, employeeId: number): Promise<IProfile>;
        getAllProfiles(): Promise<IProfile[]> 
        getProfileByUserId(userId: number): Promise<IProfile | null> 
}