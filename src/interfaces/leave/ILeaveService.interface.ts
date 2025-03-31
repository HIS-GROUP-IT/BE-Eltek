import { ILeave } from "@/types/leave.types";
import { Token } from "typedi";


export interface ILeaveService {
    createLeave(leaveData : ILeave) : Promise<ILeave>;
    updateLeave(leaveData : ILeave) : Promise<ILeave>;
    approveLeave(leaveId : number) : Promise<void>;
    rejectLeave(leaveId : number) : Promise<void>;
    getAllLeaves() : Promise<ILeave[]>;
    getLeave(leaveId : number) : Promise<ILeave>;
    getLeaveByEmployeeId(userId :number, leaveId:number) : Promise<ILeave>;
    deleteLeave(leaveId : number) : Promise<void>;
    
}

export const LEAVE_SERVICE_TOKEN = new Token<ILeaveService>("ILeaveService")