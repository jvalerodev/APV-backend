import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './config/db.js';
import veterinaryRoutes from './routes/veterinaryRoutes.js';
import patientRoutes from './routes/patientRoutes.js';

const app = express();
// dotenv.config();
app.use(express.json());

const PORT = process.env.PORT || 4000;

db.authenticate()
    .then(() => console.log('Base de datos conectada'))
    .catch(error => console.log(error));

const allowedDomains = process.env.FRONTEND_URL.split(' ');

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedDomains.indexOf(origin) !== -1) {
            // El origen del request esta permitido
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'), false);
        }
    }
};

app.use(cors(corsOptions));

app.use('/api/veterinarians', veterinaryRoutes);
app.use('/api/patients', patientRoutes);

app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto: ${PORT}`);
});