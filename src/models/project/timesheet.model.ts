import { Model, DataTypes } from 'sequelize';
import { ITimeSheet } from '@/types/timesheet.type';
import sequelize from '@/database/index';


export class Timesheet extends Model<ITimeSheet> implements ITimeSheet {
    public id!: number;
    public userId!: number;
    public projectId!: number;
    public description!: string;
    public hours!: number;
    public status!: string;
    public date!: Date;
    
    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Timesheet.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    hours: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending', // Can be 'approved', 'pending', 'rejected'
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    sequelize, 
    tableName: 'timesheets',
});
