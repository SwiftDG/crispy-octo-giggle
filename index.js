import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import readline from "readline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: true }));

// Landing page with form
app.get("/", (req, res) => {
  res.render("index");
});

// Handle form submission
app.post("/send-email", async (req, res) => {
  const { email } = req.body;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Enter your Gmail App Password: ", async (appPass) => {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "davidisrael20328371@gmail.com",
          pass: appPass,
        },
      });

      // Random placeholder verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000);

      // GitHub raw URL for logo image
      const logoUrl = "https://raw.githubusercontent.com/SwiftDG/crispy-octo-giggle/main/AQPdVsCAiziCkGNrvMqvYBgAzQuvOTqSWcYtM2bMlILVipKnlI4GQiEydyoPioVv0HKt2M5-Tr5Ir8s-VvTbgQsVdbe_Q1Dn1zDcRGjhEEG8YcEtVRv_6fjxeI7oDUOgRorwZ_ofVY4g2Aet7vqwr-YECaSJ.jpeg";

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px; text-align: center;">
          <img src="${logoUrl}" alt="MyDataShield Logo" style="width: 120px; margin-bottom: 20px;">
          <h2 style="color: #333;">MyDataShield Verification Code</h2>
          <p style="font-size: 16px; color: #555;">
            Hello! Use the verification code below to verify your email address.
          </p>
          <p style="font-size: 28px; font-weight: bold; color: #2a9d8f; margin: 20px 0;">
            ${verificationCode}
          </p>
          <p style="font-size: 14px; color: #999;">
            This code will expire in 10 minutes. If you did not request this, please ignore this email.
          </p>
        </div>
      `;

      await transporter.sendMail({
        from: '"MyDataShield" <davidisrael20328371@gmail.com>',
        to: email,
        subject: "Your MyDataShield Verification Code",
        html: htmlContent,
      });

      console.log("Email sent successfully!");
      res.send(`Verification email sent! Your code (for testing) is: ${verificationCode}`);
    } catch (err) {
      console.error("Email sending failed:", err);
      res.send("Email sending failed: " + err.message);
    } finally {
      rl.close();
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});