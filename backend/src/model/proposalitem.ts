import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database'; 
import Proposal from './proposal';  // Importing Proposal for relationship

// Proposal Item Model Definition
export class ProposalItem extends Model {
  public id!: number;
  public proposalId!: number;
  public itemName!: string;
  public proposedQuantity!: number;
  public proposedPrice!: number;
}

ProposalItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    proposalId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Proposal,
        key: 'id',
      },
    },
    itemName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    proposedQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    proposedPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'proposal_items',
    modelName: 'ProposalItem',
    timestamps: true,
  }
);

// Associations
ProposalItem.belongsTo(Proposal, { foreignKey: 'proposalId', as: 'proposal' });

export default ProposalItem;
