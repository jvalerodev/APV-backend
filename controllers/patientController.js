import Patient from '../models/Patient.js';

// Agrega un paciente
const addPatient = async (req, res) => {
    const { name, owner, email, date, symptoms } = req.body;

    try {
        const patient = await Patient.create({ name, owner, email, date, symptoms, veterinary_id: req.veterinary.id });
        res.json(patient);
    } catch (error) {
        console.log(error);
    }
};

// Obtiene todos los pacientes del veterinario
const getPatients = async (req, res) => {
    const patients = await Patient.findAll({ where: { veterinary_id: req.veterinary.id } });
    res.json(patients);
};

// Obtiene un paciente en especifico
const getPatient = async (req, res) => {
    const { id } = req.params;
    const patient = await Patient.findByPk(id);

    if (!patient) {
        return res.status(404).json({ msg: 'Paciente no encontrado' });
    }

    if (patient.veterinary_id.toString() !== req.veterinary.id.toString()) {
        return res.json({ msg: 'Acción no válida' });
    }

    res.json(patient);
};

// Actualiza un paciente
const updatePatient = async (req, res) => {
    const { id } = req.params;
    const patient = await Patient.findByPk(id);

    if (!patient) {
        return res.status(404).json({ msg: 'Paciente no encontrado' });
    }

    if (patient.veterinary_id.toString() !== req.veterinary.id.toString()) {
        return res.json({ msg: 'Acción no válida' });
    }

    // Actualizar paciente
    patient.name = req.body.name || patient.name;
    patient.owner = req.body.owner || patient.owner;
    patient.email = req.body.email || patient.email;
    patient.date = req.body.date || patient.date;
    patient.symptoms = req.body.symptoms || patient.symptoms;

    // Actualizar los datos del paciente
    try {
        await patient.save();
        res.json(patient);
    } catch (error) {
        console.log(error);
    }
};

// Elimina un paciente
const deletePatient = async (req, res) => {
    const { id } = req.params;
    const patient = await Patient.findByPk(id);

    if (!patient) {
        return res.status(404).json({ msg: 'Paciente no encontrado' });
    }

    if (patient.veterinary_id.toString() !== req.veterinary.id.toString()) {
        return res.json({ msg: 'Acción no válida' });
    }

    // Eliminar al paciente
    try {
        await Patient.destroy({ where: { id: patient.id } });
        res.json({ msg: 'Paciente eliminado correctamente' });
    } catch (error) {
        console.log(error);
    }
};

export { addPatient, getPatients, getPatient, updatePatient, deletePatient };