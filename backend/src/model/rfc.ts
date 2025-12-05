import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database'; 

// RFP Model Definition
export class RFP extends Model {
  public id!: string; 
  public description!: string;
  public budget!: number;  
  public deliveryDays!: number; 
  public items!: any;  
  public paymentTerms!: string;  
  public warranty!: string;  
}

RFP.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    description: {
      type: DataTypes.TEXT,
      
    },
    budget: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    deliveryDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    items: {
      type: DataTypes.JSON,  
      allowNull: false,
    },
    paymentTerms: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    warranty: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'rfps',
    modelName: 'RFP',
    timestamps: true,
  }
);

export default RFP;  // Default export for index.ts.