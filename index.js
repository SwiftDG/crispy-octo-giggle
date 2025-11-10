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

  // Ask user for Gmail App Password interactively
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Enter your Gmail App Password: ", async (appPass) => {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "davidisrael20328371@gmail.com", // replace with your Gmail
          pass: appPass,
        },
      });

      await transporter.sendMail({
        from: '"Test Mailer" <davidisrael20328371@gmail.com>', // must match Gmail
        to: email,
        subject: "Test Email",
        html: "<p>Hi there! This is a test email.</p>",
      });

      console.log("Email sent successfully!");
      res.send("Email sent successfully!");
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