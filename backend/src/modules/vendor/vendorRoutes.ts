import express from 'express';
import {
    createVendor,
    getVendors

} from './vendorController'
const vendorRouter = express.Router();


vendorRouter.post('/create',createVendor);
vendorRouter.post('/getall',getVendors)




export default vendorRouter;