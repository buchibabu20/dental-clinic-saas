const express = require('express')
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const Patient = require('./models/Patient')

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch((error) => console.log('MongoDB connection failed:', error.message))

// Test route
app.get('/', (req, res) => {
  res.send('DentalCare backend is running!')
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

// Get all patients
app.get('/api/patients', async (req, res) => {
  try {
    const patients = await Patient.find()
    res.json(patients)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})