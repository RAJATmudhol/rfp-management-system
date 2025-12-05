import express from 'express';
import {
  compareProposals,
} from './proposalController'

const proposalrouter = express.Router();

proposalrouter.post('/getall', compareProposals);



export default proposalrouter;
