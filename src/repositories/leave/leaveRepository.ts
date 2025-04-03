import { Service } from "typedi";
import { HttpException } from "@/exceptions/HttpException";
import { ILeaveRepository } from "@/interfaces/leave/ILeaveRepository.interface";
import { IDocument, ILeave, LeaveStatus } from "@/types/leave.types";
import Leave from "@/models/leave/leave.model";
import Employee from "@/models/employee/employee.model";
import { deleteFileFromS3 } from "@/utils/s3";

@Service()
export class LeaveRepository implements ILeaveRepository {
    public async createLeave(leaveData: Partial<ILeave>): Promise<ILeave> {
        try {
            const leave = await Leave.create(leaveData);
            return leave.get({ plain: true });
        } catch (error) {
            throw new HttpException(500, `Error creating leave: ${error.message}`);
        }
    }

    public async updateLeave(leaveData: Partial<ILeave>): Promise<ILeave> {
        try {
            const leave = await Leave.findByPk(leaveData.id, { raw: true });
            if (!leave) throw new HttpException(404, "Leave not found");
            
            const [affectedCount] = await Leave.update(leaveData, {
                where: { id: leaveData.id },
                returning: true
            });
            
            if (affectedCount === 0) throw new HttpException(404, "Leave not found");
            return this.getLeave(leaveData.id);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(500, `Error updating leave: ${error.message}`);
        }
    }
    public async approveLeave(leaveId: number): Promise<void> {
        try {
            const leave = await Leave.findByPk(leaveId);
            if (!leave) throw new HttpException(404, "Leave not found");
    
            if (leave.status !== LeaveStatus.PENDING) {
                throw new HttpException(400, "Leave request has already been processed");
            }
    
            await leave.update({ status: LeaveStatus.APPROVED });
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(500, `Error approving leave: ${error.message}`);
        }
    }
    
    public async rejectLeave(leaveId: number): Promise<void> {
        try {
            const leave = await Leave.findByPk(leaveId);
            if (!leave) throw new HttpException(404, "Leave not found");
    
            if (leave.status !== LeaveStatus.PENDING) {
                throw new HttpException(400, "Leave request has already been processed");
            }
    
            await leave.update({ status: LeaveStatus.REJECTED });
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(500, `Error rejecting leave: ${error.message}`);
        }
    }
    public async deleteDocument(leaveId: number, documentId: string): Promise<void> {
        const leaveRecord = await Leave.findByPk(leaveId);
        if (!leaveRecord) throw new Error('Leave record not found');
    
        const updatedDocuments = leaveRecord.documents.filter(doc => doc.publicId !== documentId);
        const deletedDoc = leaveRecord.documents.find(doc => doc.publicId === documentId);
    
        if (deletedDoc) await deleteFileFromS3(deletedDoc.publicId);
    
        leaveRecord.documents = updatedDocuments;
        await leaveRecord.save();
      }
    

    public async getAllLeaves(): Promise<ILeave[]> {
        try {
            const leaves = await Leave.findAll({
                include: [{
                    model: Employee,
                    as: 'employee',
                    attributes: ['id', 'fullName', 'email', 'department']
                }],
                order: [['createdAt', 'DESC']],
                raw: true,
                nest: true
            });
            
            return leaves;
        } catch (error) {
            throw new HttpException(500, `Error fetching leaves: ${error.message}`);
        }
    }

    public async getLeave(leaveId: number): Promise<ILeave> {
        try {
            const leave = await Leave.findByPk(leaveId, {
                include: [{
                    model: Employee,
                    as: 'employee',
                    attributes: ['id', 'fullName', 'email']
                }],
                raw: true,
                nest: true
            });
            
            if (!leave) throw new HttpException(404, "Leave not found");
            return leave;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(500, `Error fetching leave: ${error.message}`);
        }
    }

    public async getLeaveByEmployeeId(userId: number, leaveId: number): Promise<ILeave> {
        try {
            const leave = await Leave.findOne({
                where: { id: leaveId, employeeId: userId },
                include: [{
                    model: Employee,
                    as: 'employee',
                    attributes: ['id', 'fullName', 'email']
                }],
                raw: true,
                nest: true
            });
            
            if (!leave) throw new HttpException(404, "Leave not found for this user");
            return leave;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(500, `Error fetching user leave: ${error.message}`);
        }
    }

    public async deleteLeave(leaveId: number): Promise<void> {
        try {
            const affectedCount = await Leave.destroy({ where: { id: leaveId } });
            if (affectedCount === 0) throw new HttpException(404, "Leave not found");
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(500, `Error deleting leave: ${error.message}`);
        }
    }

    public async getAllLeavesByEmployeeId(employeeId: number): Promise<ILeave[]> {
        try {
            const leaves = await Leave.findAll({
                where: { employeeId: employeeId }, 
                include: [{
                    model: Employee,
                    as: 'employee',
                    attributes: ['id', 'fullName', 'email']
                }],
                order: [['createdAt', 'DESC']], 
                raw: true,
                nest: true
            });
    
            if (leaves.length === 0) throw new HttpException(404, "No leaves found for this employee");
    
            return leaves;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(500, `Error fetching leaves: ${error.message}`);
        }
    }
    
}