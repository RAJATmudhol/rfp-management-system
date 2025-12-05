import express from 'express';
import {
    createsrfc,
    sendRFPToVendors,
    getRFP

} from './rfcController'
const rfcRouter = express.Router();


rfcRouter.post('/create',createsrfc);
rfcRouter.post('/getall',getRFP)
rfcRouter.post('/sendProposalTovendor',sendRFPToVendors)





export default rfcRouter;