const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  appointmentTime: {
    type: String,
    required: true
  },
  treatment: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  }
}, {
  timestamps: true
})

const Appointment = mongoose.model('Appointment', appointmentSchema)

module.exports = Appointment