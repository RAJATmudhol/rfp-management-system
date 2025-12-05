import nodemailer from 'nodemailer';
import imaps from 'imap-simple';
import { db } from '../model';
import { parseProposal } from './aiServices';
import { simpleParser } from "mailparser"; 
import Imap from "node-imap";
import { ParsedMail } from "mailparser";
import { log } from 'console';
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,  
  },
});

/* -------  SEND RFP EMAIL TO VENDOR---------------*/
  
export const sendRFP = async (vendorEmail: string, rfp: any) => {
  console.log("📤 Sending RFP email to:", vendorEmail);

  const htmlBody = `
    <h2>Request for Proposal (RFP)</h2>

    <p>Please review the RFP details below and reply with your proposal.</p>

    <h3>📌 RFP Summary</h3>
    <p><strong>ID:</strong> ${rfp.id}</p>
    <p><strong>Description:</strong> ${rfp.description}</p>
    <p><strong>Budget:</strong> $${rfp.budget}</p>
    <p><strong>Delivery Required:</strong> ${rfp.deliveryDays} days</p>

    <h3>📦 Items Required</h3>
    <ul>
      ${rfp.items
        .map(
          (item: any) =>
            `<li>${item.name} — Qty: ${item.quantity} (Specs: ${item.specs})</li>`
        )
        .join("")}
    </ul>

    <p><strong>Payment Terms:</strong> ${rfp.paymentTerms}</p>
    <p><strong>Warranty:</strong> ${rfp.warranty}</p>

    <br/>

    <p>📩 <strong>Please reply directly to this email</strong> with your proposal.</p>

    <p>The system will auto-read your reply to extract pricing and terms.</p>

    <hr/>

    <!-- Hidden metadata used for AI parsing -->
    <div style="opacity: 0; font-size: 1px;">
      RFP-ID: ${rfp.id}
      VENDOR-EMAIL: ${vendorEmail}
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: vendorEmail,
    subject: `RFP Request – ID: ${rfp.id}`,
    html: htmlBody,
  });
};


const imapConfig = {
  user: process.env.EMAIL_USER!,
  password: process.env.EMAIL_PASS!,
  host: process.env.EMAIL_HOST!,  // Ensure this is 'imap.gmail.com' for Gmail
  port: Number(process.env.EMAIL_PORT!),  // 993 for Gmail
  tls: true,
  tlsOptions: { rejectUnauthorized: false },
};

// function extractRfpId(mail: any): string | null {
//   const subject = mail.subject || "";
//   const match = subject.match(/ID:\s*([a-f0-9\-]+)/i);
//   return match ? match[1] : null;
// }

export function checkEmails(): Promise<void> {
  return new Promise((resolve, reject) => {
    const imap = new Imap(imapConfig);

    imap.once("ready", () => {
      imap.openBox("INBOX", false, (err, box) => {
        if (err) {
          console.error("Error opening inbox:", err);
          imap.end();
          return reject(err);
        }

        const lastChecked = new Date(0);  

        // Updated search: Fetch only replied emails (with 'Re:' in subject) since last check imap.search([["SINCE", lastChecked.toISOString()], ["SUBJECT", "RFP Request – ID:"]], (err, uids) => {
           imap.search([["SINCE", lastChecked.toISOString()], ["SUBJECT", "Re:"]], (err, uids) => {
          if (err) {
           // console.error("Error searching emails:", err);
            imap.end();
            return reject(err);
          }

          if (!uids || uids.length === 0) {
          //  console.log("No new replied emails.");
            imap.end();
            return resolve();
          }

          const f = imap.fetch(uids, { bodies: "" });

          f.on("message", async (msg, seqno) => {
            msg.on("body", async (stream, info) => {
              try {
                // Collect raw email data
                const raw = await new Promise<string>((res, rej) => {
                  let buffer = "";
                  stream.on("data", (chunk) => buffer += chunk.toString());
                  stream.on("end", () => res(buffer));
                  stream.on("error", rej);
                });

                // Parse email
                const mail = await simpleParser(raw);
                const senderEmail = mail.from?.value?.[0]?.address;
                const messageId = mail.messageId;

                if (!senderEmail || !messageId) return;

                // Extract RFP ID from subject/body
                const rfpId = extractRfpId(mail);
                if (!rfpId) {
                 // console.log("No RFP ID found in replied email:", mail.subject);
                  return;
                }

                // Skip duplicates
                const exists = await db.Proposal.findOne({ where: { messageId } });
                if (exists) {
                 // console.log("Skipping duplicate proposal:", messageId);
                  return;
                }

                // Find RFP by ID
                const rfp = await db.Rfc.findOne({ where: { id: rfpId } });
                if (!rfp) {
                //  console.log("RFP not found for ID:", rfpId);
                  return;
                }

                // Find vendor by email
                const vendor = await db.Vendor.findOne({ where: { email: senderEmail } });
                if (!vendor) {
                 // console.log("Vendor not found for email:", senderEmail);
                  return;
                }

                // Parse proposal
                const parsedData = await parseProposal(mail.text || "");

                // Save proposal
                await db.Proposal.create({
                  rfpId: rfpId,  // UUID string
                  vendorId: vendor.id,
                  vendorEmail: senderEmail,
                  rawResponse: raw,
                  parsedData: parsedData,
                  messageId: messageId,
                });

              //  console.log("✅ Proposal saved for:", senderEmail, "RFP:", rfpId);
              } catch (parseErr) {
               // console.error("Error processing replied email:", parseErr);
              }
            });
          });

          f.once("end", () => {
           // console.log("✅ Done processing all replied emails!");
            imap.end();
            resolve();
          });
        });
      });
    });

    imap.once("error", (err) => {
      console.error("IMAP connection error:", err);
      reject(err);
    });

    imap.once("end", () => {
      console.log("IMAP connection ended.");
    });

    imap.connect();
  });
}

function extractRfpId(mail: any): string | null {
  const text = mail.text || "";
  const subject = mail.subject || "";

  // From subject:   "Re: RFP Request – ID: cb3c50ef-..."
  const subjectMatch = subject.match(/ID:\s*([a-f0-9\-]{36})/i);
  if (subjectMatch) return subjectMatch[1];

  // From reply footer inside email body
  const footerMatch = text.match(/RFP-ID:\s*([a-f0-9\-]{36})/i);
  if (footerMatch) return footerMatch[1];

  // From ORIGINAL EMAIL inside reply
  const bodyMatch = text.match(/ID:\s*([a-f0-9\-]{36})/i);
  if (bodyMatch) return bodyMatch[1];

  return null;
}
