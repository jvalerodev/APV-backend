import express from 'express';
import { register, confirm, authenticate, forgotPassword, validateToken, newPassword, profile, updateProfile, updatePassword } from '../controllers/veterinaryController.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

// Area publica
router.post('/', register); // Pagina de inicio de veterinarios - POST
router.get('/confirm/:token', confirm); // Confirma el registro del usuario
router.post('/login', authenticate); // Valida el login del usuario - POST
router.post('/forgot-password', forgotPassword); // Valida el email del usuario para cambiar su password - POST
router
    .route('/forgot-password/:token')
    .get(validateToken) // Comprueba si el token enviado al correo es valido
    .post(newPassword); // Crea el nuevo password del usuario - POST

// Area privada
router.get('/profile', checkAuth, profile);// Pagina de iniciar sesion para los veterinarios
router.put('/profile/:id', checkAuth, updateProfile);   // Actualiza la informacion del usuario
router.put('/update-password', checkAuth, updatePassword); // Actualiza la contraseña del usuario

export default router;