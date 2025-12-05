import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database'; 

// Vendor Model Definition
export class Vendor extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public contactInfo!: string;
}

Vendor.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4,
     
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
       unique: true, 
      validate: {
        isEmail: true,
      },
    },
    contactInfo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'vendors',
    modelName: 'Vendor',
    timestamps: true,
  }
);

export default Vendor;
