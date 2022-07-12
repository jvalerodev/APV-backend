import nodemailer from 'nodemailer';

const emailForgotPassword = async data => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { name, email, token } = data;

    const info = await transporter.sendMail({
        from: 'APV - Administrador de Pacientes de Veterinaria',
        to: email,
        subject: 'Reestablece tu contraseña',
        text: 'Reestablece tu contraseña',
        html: `
            <p>¡Hola ${name}! Has solicitado reestablecer tu contraseña en APV.</p>
            <p>
                Haz click en el siguiente enlace para crear una nueva contraseña:
                <a href="${process.env.FRONTEND_URL}/forgot-password/${token}">Reestablecer contraseña</a>
            </p>
            <p>Si no reconoces esta acción ignora este mensaje.
        `
    });
};

export default emailForgotPassword;