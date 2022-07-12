import Sequelize from 'sequelize';
import bcrypt from 'bcrypt';
import db from "../config/db.js";
import generateId from '../helpers/generateId.js';

const Veterinary = db.define('veterinarians', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    phone: {
        type: Sequelize.STRING,
        defaultValue: null
    },
    web: {
        type: Sequelize.STRING,
        defaultValue: null
    },
    token: {
        type: Sequelize.STRING,
        defaultValue: generateId()
    },
    confirmed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
}, {
    hooks: {
        beforeSave: async (veterinary, next) => {
            if (veterinary.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                veterinary.password = await bcrypt.hash(veterinary.password, salt);
            }
        }
    }
});

Veterinary.prototype.validatePassword = async function (passwordForm) {
    return await bcrypt.compare(passwordForm, this.password);
};

export default Veterinary;

