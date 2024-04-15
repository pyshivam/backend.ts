import nodemailer from 'nodemailer';
import config from '@config/config';
import AppError from './appError';

const sendVerificationEmail = async (email: string, token: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.gmail,
      pass: config.gmailAppPassword,
    },
  });
  const mailOptions = {
    from: config.gmail,
    to: email,
    subject: 'Account verification',
    html: `<p>Click <a href="${config.hostUrl}/api/auth/verify/${token}">here</a> to verify your account</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new AppError(500, 'Email was not sent!');
  }
};

export default sendVerificationEmail;
