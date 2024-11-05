import { Resend } from "resend";
import User from "../models/user.model.js";

export const sendEmail = async (to, subject, html) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "noreply@josenicoleno.ar",
    to,
    subject,
    html,
  });
};

export const sendResetPasswordEmail = async (to, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const html = `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`;
  await sendEmail(to, "Reset Password", html);
};

export const sendPasswordHasBeenReset = async (to, username) => {
  const html = `<p>Your password has been reset by ${username}</p>`;
  await sendEmail(to, "Password Reset", html);
};

export const sendVerificationEmail = async (to, verificationToken) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
  const html = `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`;
  await sendEmail(to, "Verify Email", html);
};

export const sendWelcomeEmail = async (to, username) => {
  const html = `<p>Welcome ${username}!</p>`;
  await sendEmail(to, "Welcome to the blog", html);
};

export const newCommentNotification = async (postTitle) => {
  const usersAdminEmail = await User.find({ isAdmin: true }).select("email");
  const html = `<p>A new comment has been posted on your post: ${postTitle}</p>`;
  usersAdminEmail.forEach(async (user) => {
    await sendEmail(user.email, "New Comment Alert", html);
  });
};

export const sendContactEmail = async (to, name, content) => {
  const html = `<p>${content}</p>`;
  await sendEmail(to, name, html);
};
