import { Service } from "typedi";
import { ILeaveService, LEAVE_SERVICE_TOKEN } from "@/interfaces/leave/ILeaveService.interface";
import { ILeave, LeaveStatus } from "@/types/leave.types";
import { HttpException } from "@/exceptions/HttpException"; 
import { LeaveRepository } from "@/repositories/leave/leaveRepository";


@Service({ id: LEAVE_SERVICE_TOKEN, type: LeaveService })
export class LeaveService implements ILeaveService {
    constructor(private leaveRepository: LeaveRepository) {}

    public async createLeave(leaveData: ILeave): Promise<ILeave> {
        try {
            return await this.leaveRepository.createLeave(leaveData);
        } catch (error) {
            throw new HttpException(500, `Error creating leave: ${error.message}`);
        }
    }

    public async updateLeave(leaveData: Partial<ILeave>): Promise<ILeave> {
        try {
            const leave = await this.leaveRepository.getLeave(leaveData.id);
            if (!leave) throw new HttpException(404, "Leave not found");

            return await this.leaveRepository.updateLeave(leaveData);
        } catch (error) {
            throw new HttpException(500, `Error updating leave: ${error.message}`);
        }
    }

    public async deleteLeave(leaveId: number): Promise<void> {
        try {
            const leave = await this.leaveRepository.getLeave(leaveId);
            if (!leave) throw new HttpException(404, "Leave not found");

            await this.leaveRepository.deleteLeave(leaveId);
        } catch (error) {
            throw new HttpException(500, `Error deleting leave: ${error.message}`);
        }
    }

    public async getLeaveById(leaveId: number): Promise<ILeave | null> {
        try {
            const leave = await this.leaveRepository.getLeave(leaveId);
            if (!leave) throw new HttpException(404, "Leave not found");

            return leave;
        } catch (error) {
            throw new HttpException(500, `Error retrieving leave: ${error.message}`);
        }
    }

    public async getAllLeaves(): Promise<ILeave[]> {
        try {
            return await this.leaveRepository.getAllLeaves();
        } catch (error) {
            throw new HttpException(500, `Error retrieving leaves: ${error.message}`);
        }
    }

    public async approveLeave(leaveId: number): Promise<void> {
        try {
            const leave = await this.leaveRepository.getLeave(leaveId);
            if (!leave) throw new HttpException(404, "Leave not found");

            if (leave.status !== LeaveStatus.PENDING) {
                throw new HttpException(400, "Leave request has already been processed");
            }

            await this.leaveRepository.approveLeave(leaveId);
        } catch (error) {
            throw new HttpException(500, `Error approving leave: ${error.message}`);
        }
    }

    public async rejectLeave(leaveId: number): Promise<void> {
        try {
            const leave = await this.leaveRepository.getLeave(leaveId);
            if (!leave) throw new HttpException(404, "Leave not found");

            if (leave.status !== LeaveStatus.PENDING) {
                throw new HttpException(400, "Leave request has already been processed");
            }

            await this.leaveRepository.rejectLeave(leaveId);
        } catch (error) {
            throw new HttpException(500, `Error rejecting leave: ${error.message}`);
        }
    }

    public async getLeave(leaveId: number): Promise<ILeave> {
        try {
            const leave = await this.leaveRepository.getLeave(leaveId);
            if (!leave) throw new HttpException(404, "Leave not found");

            return leave
        } catch (error) {
            throw new HttpException(500, `Error getting leave: ${error.message}`);
        }
    }

    public async getLeaveByEmployeeId(employeeId: number): Promise<ILeave> {
        try {
            const leave = await this.leaveRepository.getLeave(employeeId);
            if (!leave) throw new HttpException(404, "Leave not found");

            return leave
        } catch (error) {
            throw new HttpException(500, `Error getting leave: ${error.message}`);
        }
    }
}
