import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { MailerSend, EmailParams, Recipient, Sender } from "mailersend";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// ✅ MailerSend setup
const mailerSend = new MailerSend({
  apiKey: "mlsn.0c1c309620ef879c94f4ca42f11b0241b721c713663b884f1cb0cca5c8c3ac7f",
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Render form
app.get("/", (req, res) => {
  res.render("index");
});

// ✅ Handle form submission
app.post("/send-email", async (req, res) => {
  const { email } = req.body;

  try {
    // "from" must be a verified sender in MailerSend
    const sentFrom = new Sender("davidisrael20328371@gmail.com", "Test MailerSend");
    const recipients = [new Recipient(email)];

    const emailParams = new EmailParams({
      from: sentFrom,
      to: recipients,
      subject: "Test Email",
      html: "<p>Hi there! This is a test email from MailerSend 🎉</p>",
    });

    const response = await mailerSend.email.send(emailParams);
    console.log(response);
    res.send("✅ Email sent successfully!");
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    res.send("Email sending failed: " + JSON.stringify(error, null, 2));
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));