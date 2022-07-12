import nodemailer from 'nodemailer';

const emailRegister = async data => {
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
        subject: 'Confirma tu cuenta en APV',
        text: 'Confirma tu cuenta en APV',
        html: `
            <p>¡Hola ${name}! Confirma tu cuenta en APV.</p>
            <p>
                Tu cuenta está casi lista, solo debes validarla mediante el siguiente enlace:
                <a href="${process.env.FRONTEND_URL}/confirm-account/${token}">Confirmar cuenta</a>
            </p>
            <p>Si no creaste esta cuenta, ignora este mensaje.
        `
    });
};

export default emailRegister;