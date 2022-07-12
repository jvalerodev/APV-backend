import jwt from 'jsonwebtoken';
import Veterinary from '../models/Veterinary.js';

const checkAuth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            req.veterinary = await Veterinary.findByPk(decoded.id, { attributes: { exclude: ['password', 'token', 'confirmed'] } });
            return next();
        } catch (err) {
            const error = new Error('Token no válido');
            return res.status(403).json({ msg: error.message });
        }
    }

    if (!token) {
        const error = new Error('Token no válido o inexistente')
        res.status(403).json({ msg: error.message });
    }

    next();
};

export default checkAuth;