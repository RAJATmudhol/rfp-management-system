import { sequelize } from '../config/database';  
import rfcmodel from './rfc'
import proposalmodel from './proposal'
import vendormodel from './vendor'

// import rfpitemmodel from './rfpitem'




sequelize.authenticate();
export const db = {
  sequelize, 
  Sequelize: sequelize,
  Rfc:rfcmodel,
  Vendor:vendormodel,
  Proposal:proposalmodel,
 // ProposalItem:proposalitemmodel,
  //rfpitem:rfpitemmodel
};

export default db;