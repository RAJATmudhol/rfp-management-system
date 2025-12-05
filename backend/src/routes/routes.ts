import  express  from "express";

import vendorRouter from "../modules/vendor/vendorRoutes";
import rfcRouter from "../modules/rfp/refRoutes";
import proposalrouter from "../modules/proposal/proposalRoutes";


const routers = express.Router();


routers.use('/rfps', rfcRouter);
routers.use('/vendors', vendorRouter);
routers.use('/proposals', proposalrouter);


export default routers;
