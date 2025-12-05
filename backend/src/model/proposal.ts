import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database'; 
import RFP from './rfc';  // Importing RFP model for relationships
import Vendor from './vendor';  // Importing Vendor model for relationships


export class Proposal extends Model {
  public id!: number;
  public rfpId!: string;
  public vendorId!: number;
  public rawResponse!: string;
  public parsedData!: any; 
  public messageId!:any;
  vendorEmail: any;
  
}

Proposal.init(
  {
    id: {
      type: DataTypes.UUID,
     defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    rfpId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: RFP,
        key: 'id',
      },
    },
    vendorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Vendor,
        key: 'id',
      },
    },
      messageId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // prevent duplicates
    },
    rawResponse: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    parsedData: {
      type: DataTypes.JSON,
      allowNull: true,
    }
  },
  {
    sequelize,
    tableName: 'proposals',
    modelName: 'Proposal',
    timestamps: true,
  }
);
//  Proposal.sync({ force: true });
// Associations
Proposal.belongsTo(RFP, { foreignKey: 'rfpId', as: 'rfp' });
Proposal.belongsTo(Vendor, { foreignKey: 'vendorId', as: 'vendor' });



export default Proposal;
