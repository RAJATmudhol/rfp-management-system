import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/database';
import { checkEmails } from './services/emailServices';
import routers from './routes/routes';
import "./cron/emailcron";
import {db} from '../src/model'        
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from './swagger';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// db.sequelize.sync({
//     force: true,
// });

app.use('/api', routers);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL');
    await sequelize.sync({ alter: true })
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

startServer();