import Sequelize from 'sequelize';
import db from '../config/db.js';
import Veterinary from './Veterinary.js';

const Patient = db.define('patients', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    owner: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    date: {
        type: Sequelize.DATE,
        allowNull: false
    },
    symptoms: {
        type: Sequelize.STRING,
        allowNull: false
    },
    createdAt: {
        type: Sequelize.DATE,
        field: 'created_at'
    },
    updatedAt: {
        type: Sequelize.DATE,
        field: 'updated_at'
    }
}, {
    timestamps: true
});

Patient.belongsTo(Veterinary, { foreignKey: 'veterinary_id' });

export default Patient;