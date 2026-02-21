import nodemailer from 'nodemailer';
import 'dotenv/config';

// This is a mock email service for development.
// In a real application, you would configure this with a real email provider
// like SendGrid, Mailgun, or AWS SES.
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'arianna.bailey25@ethereal.email', // generated ethereal user
    pass: 'BqP6U54XUe1dJbCqW3', // generated ethereal password
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendEmail({ to, subject, text, html }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: '"Mindful Journal" <noreply@mindfuljournal.app>',
      to,
      subject,
      text,
      html,
    });

    console.log('Message sent: %s', info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    return nodemailer.getTestMessageUrl(info);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email.');
  }
}
