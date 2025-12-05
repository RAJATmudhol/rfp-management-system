import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/database';
import { checkEmails } from './services/emailServices';
import routers from './routes/routes';
import "./cron/emailcron";
import {db} from '../src/model'        

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// db.sequelize.sync({
//     force: true,
// });

app.use('/api', routers);

// Poll emails every 5 min
// setInterval(checkEmails, 300000);
// checkEmails
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