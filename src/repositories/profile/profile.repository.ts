import { IProfile } from "@/types/profile.types";
import Profile from "@/models/profile/profile.model";
import { Service } from "typedi";
import { IProfileRepository } from "@/interfaces/profile/IProfileRepository.interface";

@Service()
export class ProfileRepository implements IProfileRepository {
  
  public async createProfile(profileData: Partial<IProfile>): Promise<IProfile> {
    return await Profile.create(profileData, { raw: true });
  }

  public async updateProfile(profileData: Partial<IProfile>): Promise<IProfile> {
    const profile = await Profile.findByPk(profileData.id, { raw: false }); // Need instance for update
    if (!profile) throw new Error("Profile not found");
    await profile.update(profileData);
    return profile.get({ plain: true }); // Return as plain object
  }

  public async assignEmployee(projectId: number, employeeId: number): Promise<IProfile> {
    const profile = await Profile.findByPk(employeeId, { raw: false });
    if (!profile) throw new Error("Profile not found");

    await profile.update({ projectId });
    return profile.get({ plain: true });
  }

  public async removeEmployee(projectId: number, employeeId: number): Promise<IProfile> {
    const profile = await Profile.findByPk(employeeId, { raw: false });
    if (!profile) throw new Error("Profile not found");

    if (profile.projectId === projectId) {
      await profile.update({ projectId: null });
      return profile.get({ plain: true });
    }
    throw new Error("Employee is not assigned to this project");
  }

  public async getAllProfiles(): Promise<IProfile[]> {
    return await Profile.findAll({ raw: true });
  }

  public async getProfileByUserId(userId: number): Promise<IProfile | null> {
    return await Profile.findOne({ 
      where: { userId },
      raw: true 
    });
  }
}