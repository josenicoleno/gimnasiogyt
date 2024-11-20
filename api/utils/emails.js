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
  const html = `
    <div style="background-color: #f5f5f5; padding: 20px; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${process.env.FRONTEND_URL}/logo.png" alt="Logo" style="width: 50px;">
        <h1 style="color: #333; margin: 10px 0;">Gimansio GyT</h1>
      </div>
      <div style="background-color: white; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-bottom: 20px;">Restablecer contraseña</h2>
        <p style="color: #666; margin-bottom: 30px;">Has solicitado restablecer tu contraseña. Haz clic en el botón de abajo para continuar:</p>
        <div style="text-align: center;">
          <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Restablecer Contraseña</a>
        </div>
        <p style="color: #666; margin-top: 30px; font-size: 12px;">Si no solicitaste restablecer tu contraseña, puedes ignorar este correo.</p>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} Gimnasio GyT. Todos los derechos reservados.</p>
      </div>
    </div>
  `;
  await sendEmail(to, "Reset Password", html);
};

export const sendPasswordHasBeenReset = async (to, username) => {
  const html = `
    <div style="background-color: #f5f5f5; padding: 20px; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${process.env.FRONTEND_URL}/logo.png" alt="Logo" style="width: 50px;">
        <h1 style="color: #333; margin: 10px 0;">Gimnasio GyT</h1>
      </div>
      <div style="background-color: white; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-bottom: 20px;">Contraseña Actualizada</h2>
        <p style="color: #666; margin-bottom: 30px;">Tu contraseña ha sido actualizada exitosamente por ${username}.</p>
        <p style="color: #666; margin-top: 30px; font-size: 12px;">Si no realizaste este cambio, por favor contacta con nosotros inmediatamente.</p>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} Gimnasio GyT. Todos los derechos reservados.</p>
      </div>
    </div>
  `;
  await sendEmail(to, "Contraseña Actualizada", html);
};

export const sendVerificationEmail = async (to, verificationToken) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
  const html = `
    <div style="background-color: #f5f5f5; padding: 20px; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${process.env.FRONTEND_URL}/logo.png" alt="Logo" style="width: 50px;">
        <h1 style="color: #333; margin: 10px 0;">Gimnasio GyT</h1>
      </div>
      <div style="background-color: white; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-bottom: 20px;">Verifica tu Email</h2>
        <p style="color: #666; margin-bottom: 30px;">Gracias por registrarte. Por favor verifica tu email haciendo clic en el botón siguiente:</p>
        <div style="text-align: center;">
          <a href="${verificationUrl}" style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Verificar Email</a>
        </div>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} Gimnasio GyT. Todos los derechos reservados.</p>
      </div>
    </div>
  `;
  await sendEmail(to, "Verificar Email", html);
};

export const sendWelcomeEmail = async (to, username) => {
  const html = `
    <div style="background-color: #f5f5f5; padding: 20px; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${process.env.FRONTEND_URL}/logo.png" alt="Logo" style="width: 50px;">
        <h1 style="color: #333; margin: 10px 0;">Gimnasio GyT</h1>
      </div>
      <div style="background-color: white; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-bottom: 20px;">¡Bienvenido/a ${username}!</h2>
        <p style="color: #666; margin-bottom: 30px;">Gracias por unirte a nuestra comunidad. Estamos emocionados de tenerte con nosotros.</p>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} Gimnasio GyT. Todos los derechos reservados.</p>
      </div>
    </div>
  `;
  await sendEmail(to, "¡Bienvenido/a a Gimnasio GyT!", html);
};

export const newCommentNotification = async (postTitle) => {
  const usersAdminEmail = await User.find({ isAdmin: true }).select("email");
  const html = `
    <div style="background-color: #f5f5f5; padding: 20px; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${process.env.FRONTEND_URL}/logo.png" alt="Logo" style="width: 50px;">
        <h1 style="color: #333; margin: 10px 0;">Gimnasio GyT</h1>
      </div>
      <div style="background-color: white; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-bottom: 20px;">Nuevo Comentario</h2>
        <p style="color: #666; margin-bottom: 30px;">Se ha publicado un nuevo comentario en la entrada: "${postTitle}"</p>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()}Gimnasio GyT. Todos los derechos reservados.</p>
      </div>
    </div>
  `;
  usersAdminEmail.forEach(async (user) => {
    await sendEmail(user.email, "Nueva Notificación de Comentario", html);
  });
};

export const sendContactEmail = async (to, name, content) => {
  const html = `
    <div style="background-color: #f5f5f5; padding: 20px; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${process.env.FRONTEND_URL}/logo.png" alt="Logo" style="width: 50px;">
        <h1 style="color: #333; margin: 10px 0;">Gimnasio GyT</h1>
      </div>
      <div style="background-color: white; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-bottom: 20px;">Nuevo Mensaje de Contacto</h2>
        <p style="color: #666; margin-bottom: 30px;">De: ${name}</p>
        <div style="color: #666; margin-bottom: 30px;">${content}</div>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} Gimnasio GyT. Todos los derechos reservados.</p>
      </div>
    </div>
  `;
  await sendEmail(to, `Nuevo contacto de ${name}`, html);
};

export const sendRegistrationtEmail = async (to, name, content, phone) => {
  const html = `
    <div style="background-color: #f5f5f5; padding: 20px; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${process.env.FRONTEND_URL}/logo.png" alt="Logo" style="width: 50px;">
        <h1 style="color: #333; margin: 10px 0;">Gimnasio GyT</h1>
      </div>
      <div style="background-color: white; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-bottom: 20px;">Nueva Solicitud de Registro</h2>
        <p style="color: #666; margin-bottom: 10px;">De: ${name}</p>
        <p style="color: #666; margin-bottom: 10px;">Teléfono: ${phone}</p>
        <div style="color: #666; margin-bottom: 30px;">${content}</div>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} Gimnasio GyT. Todos los derechos reservados.</p>
      </div>
    </div>
  `;
  await sendEmail(to, `Nueva solicitud de registro de ${name}`, html);
};
