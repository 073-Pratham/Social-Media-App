import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
  debug: false, // show debug logs in console
  logger: false // show connection logs
});

interface MailOptionsFormat {
  from: string;
  to: string;
  subject: string;
  text: string;
}

const sendMail = async (mailOptions: MailOptionsFormat) => {
  try {
    console.log("Sending mail...");
    const info = await transporter.sendMail(mailOptions);
    console.log("Mail sent successfully:", info);
  } catch (error) {
    console.error("Error sending mail:", error);
  }
};

export default sendMail;
