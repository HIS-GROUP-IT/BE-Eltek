import { IProfile } from "@/types/profile.types";
import Profile from "@/models/profile/profile.model";
import { Service } from "typedi";
import { IProfileRepository } from "@/interfaces/profile/IProfileRepository.interface";

@Service()
export class ProfileRepository implements IProfileRepository {
  
  public async createProfile(profileData: Partial<IProfile>): Promise<IProfile> {
    return await Profile.create(profileData);
  }

  public async updateProfile(profileData: Partial<IProfile>): Promise<IProfile> {
    const profile = await Profile.findByPk(profileData.id);
    if (!profile) throw new Error("Profile not found");
    return await profile.update(profileData);
  }

  public async assignEmployee(projectId: number, employeeId: number): Promise<IProfile> {
    const profile = await Profile.findByPk(employeeId);
    if (!profile) throw new Error("Profile not found");

    profile.projectId = projectId;
    return await profile.save();
  }

  public async removeEmployee(projectId: number, employeeId: number): Promise<IProfile> {
    const profile = await Profile.findByPk(employeeId);
    if (!profile) throw new Error("Profile not found");

    if (profile.projectId === projectId) {
      profile.projectId = null;
      return await profile.save();
    } else {
      throw new Error("Employee is not assigned to this project");
    }
  }

  // Get all profiles
  public async getAllProfiles(): Promise<IProfile[]> {
    return await Profile.findAll();
  }

  // Get profile by user ID
  public async getProfileByUserId(userId: number): Promise<IProfile | null> {
    return await Profile.findOne({ where: { userId } });
  }
}
