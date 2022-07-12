import Veterinary from '../models/Veterinary.js';
import generateJWT from '../helpers/generateJWT.js';
import generateId from '../helpers/generateId.js';
import emailRegister from '../helpers/emailRegister.js';
import emailForgotPassword from '../helpers/emailForgotPassword.js';

// Registrar al usuario
const register = async (req, res) => {
    const { name, password, email } = req.body;

    // Prevenir usuarios duplicados
    const userExist = await Veterinary.findOne({ where: { email } });

    // Si el usuario ya existe
    if (userExist) {
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({ msg: error.message });
    }

    try {
        // Se almacena el veterinario en la base de datos
        const veterinary = await Veterinary.create({ name, email, password });

        // Enviar el email de confirmacion
        emailRegister({ name, email, token: veterinary.token });

        res.json({ msg: 'Usuario registrado' });
    } catch (error) {
        console.log(error.message);
    }
};

// Confirmar cuenta del usuario
const confirm = async (req, res) => {
    const { token } = req.params;

    const confirmUser = await Veterinary.findOne({ where: { token } });

    if (!confirmUser) {
        const error = new Error('Token no válido');
        return res.status(404).json({ msg: error.message });
    }

    // El token existe por lo tanto se procede a confirmar el usuario
    try {
        confirmUser.token = null;
        confirmUser.confirmed = true;
        await confirmUser.save();
        res.json({ msg: '¡Usuario confirmado correctamente!' });
    } catch (error) {
        console.log(error);
    }
};

// Autenticar al usuario
const authenticate = async (req, res) => {
    const { email, password } = req.body;

    // Comprobar si el usuario existe
    const user = await Veterinary.findOne({ where: { email } });

    // Si el usuario no existe
    if (!user) {
        const error = new Error('El Usuario no existe');
        return res.status(404).json({ msg: error.message });
    }

    // Comprobar si el usuario esta confirmado
    if (!user.confirmed) {
        const error = new Error('Tu cuenta no ha sido confirmada');
        return res.status(403).json({ msg: error.message });
    }

    // Validar el password
    if (!await user.validatePassword(password)) {
        const error = new Error('El Password es incorrecto');
        return res.status(403).json({ msg: error.message });
    }

    // Auntenticar al usuario
    res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: generateJWT(user.id)
    });
};

// Valida el email del usuario para cambiar su password
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const veterinary = await Veterinary.findOne({ where: { email } });

    if (!veterinary) {
        const error = new Error('El usuario no existe');
        return res.status(400).json({ msg: error.message });
    }

    try {
        veterinary.token = generateId();
        await veterinary.save();

        // Enviar el email de confirmacion
        emailForgotPassword({ name: veterinary.name, email, token: veterinary.token });

        res.json({ msg: 'Hemos enviado un email con las instrucciones' });
    } catch (error) {
        console.log(error);
    }
};

// Comprueba si el token enviado al correo es valido
const validateToken = async (req, res) => {
    const { token } = req.params;
    const validToken = await Veterinary.findOne({ where: { token } });

    // Si no se encuentra el token en la base de datos
    if (!validToken) {
        const error = new Error('Token no válido');
        return res.status(400).json({ msg: error.message });
    }

    res.json({ msg: 'Token válido y el usuario existe' })
};

// Crea el nuevo password del usuario - POST
const newPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const veterinary = await Veterinary.findOne({ where: { token } });

    // Si no existe el token
    if (!veterinary) {
        const error = new Error('Ocurrió un error');
        return res.status(400).json({ msg: error.message });
    }

    // En caso de que exista
    try {
        veterinary.token = null;
        veterinary.password = password;
        await veterinary.save();
        res.json({ msg: 'Contraseña modificada correctamente' });
    } catch (error) {
        console.log(error);
    }
};

// Perfil del usuario
const profile = (req, res) => {
    const { veterinary } = req;
    res.json(veterinary);
};

// Actualizar la informacion de perfil del usuario
const updateProfile = async (req, res) => {
    const { id } = req.params;
    const veterinary = await Veterinary.findByPk(id, { attributes: { exclude: ['password', 'token', 'confirmed'] } });

    if (!veterinary) {
        const error = new Error('Ocurrió un error');
        return res.status(400).json({ msg: error.message });
    }

    const { email } = req.body;

    if (veterinary.email !== email) {  // El usuario está modificando su email
        const emailExists = await Veterinary.findOne({ where: { email } });

        if (emailExists) {
            const error = new Error('Email no disponible');
            return res.status(400).json({ msg: error.message });
        }
    }

    // Se actualizan los datos en la BD
    try {
        veterinary.name = req.body.name;
        veterinary.email = req.body.email;
        veterinary.web = req.body.web;
        veterinary.phone = req.body.phone;

        const updatedVet = await veterinary.save();
        res.json(updatedVet);
    } catch (error) {
        console.log(error);
    }
};

// Actualiza la contraseña modificada por el usuario desde su perfil
const updatePassword = async (req, res) => {
    // Leer los datos
    const { id } = req.veterinary // req.veterinary viene del authMiddleware
    const { currentPassword, newPassword } = req.body;

    // Comprobar que el veterinario existe
    const veterinary = await Veterinary.findByPk(id);

    if (!veterinary) {
        const error = new Error('Ocurrió un error');
        return res.status(400).json({ msg: error.message });
    }

    // Comprobar la contraseña
    if (!await veterinary.validatePassword(currentPassword)) {
        const error = new Error('La contraseña actual es incorrecta');
        return res.status(400).json({ msg: error.message });
    }

    // Almacenar la nueva contraseña
    veterinary.password = newPassword;
    await veterinary.save();
    res.json({ msg: 'Contraseña actualizada correctamente' });
};

export { register, confirm, authenticate, forgotPassword, validateToken, newPassword, profile, updateProfile, updatePassword };