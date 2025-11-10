import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { MailerSend, EmailParams, Recipient } from "mailersend";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// MailerSend setup
const ms = new MailerSend({
  api_key: "mlsn.0c1c309620ef879c94f4ca42f11b0241b721c713663b884f1cb0cca5c8c3ac7f" // paste API key here
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: true }));

// Render form
app.get("/", (req, res) => {
  res.render("index");
});

// Handle form submission
app.post("/send-email", async (req, res) => {
  const { email } = req.body;

  try {
    const recipients = [new Recipient(email)];
    const emailParams = new EmailParams()
      .setFrom("davidisrael20328371@gmail.com", "Test MailerSend") // must be verified
      .setRecipients(recipients)
      .setSubject("Test Email")
      .setHtml("<p>Hi there! This is a test email.</p>");

    await ms.send(emailParams);
    res.send("Email sent successfully!");
  } catch (err) {
    console.error(err);
    res.send("Email sending failed: " + JSON.stringify(err));
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));