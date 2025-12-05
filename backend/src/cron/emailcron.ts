import cron from "node-cron";
import { checkEmails } from "../services/emailServices";

cron.schedule("*/50 * * * * *", () => {
  console.log("⏱ Cron: Checking vendor emails...");
  checkEmails();
});
