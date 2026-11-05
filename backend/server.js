const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const Patient = require('./models/Patient')
const Appointment = require('./models/Appointment')

console.log('Appointment model type:', typeof Appointment)

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cors({ origin: 'http://localhost:5173' }))

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch((error) => console.log('MongoDB connection failed:', error.message))

// Test route
app.get('/', (req, res) => {
  res.send('DentalCare backend is running!')
})

// Get all patients
app.get('/api/patients', async (req, res) => {
  try {
    const patients = await Patient.find()
    res.json(patients)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Register a new patient
app.post('/api/patients', async (req, res) => {
  try {
    const newPatient = new Patient({
      name: req.body.name,
      age: req.body.age,
      treatment: req.body.treatment
    })

    const savedPatient = await newPatient.save()

    res.status(201).json(savedPatient)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Delete a patient
app.delete('/api/patients/:id', async (req, res) => {
  try {
    const deletedPatient = await Patient.findByIdAndDelete(req.params.id)

    if (!deletedPatient) {
      return res.status(404).json({ message: 'Patient not found' })
    }

    res.json({ message: 'Patient deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update a patient
app.put('/api/patients/:id', async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        age: req.body.age,
        treatment: req.body.treatment
      },
      { new: true, runValidators: true }
    )

    if (!updatedPatient) {
      return res.status(404).json({ message: 'Patient not found' })
    }

    res.json(updatedPatient)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.post('/api/appointments', async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body)

    const savedAppointment = await newAppointment.save()

    res.status(201).json(savedAppointment)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get all appointments
app.get('/api/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find()
    res.status(200).json(appointments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})