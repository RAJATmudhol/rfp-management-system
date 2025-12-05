import { sequelize } from '../config/database';  
import rfcmodel from './rfc'
import proposalmodel from './proposal'
import vendormodel from './vendor'




sequelize.authenticate();
export const db = {
  sequelize, 
  Sequelize: sequelize,
  Rfc:rfcmodel,
  Vendor:vendormodel,
  Proposal:proposalmodel,
};

export default db;