
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const Patient = require('./models/Patient')
const Appointment = require('./models/Appointment')
const Billing = require('./models/Billing')

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

// ===============================
// PATIENT APIs
// ===============================

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

// ===============================
// APPOINTMENT APIs
// ===============================

// Book a new appointment
app.post('/api/appointments', async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body)
    const savedAppointment = await newAppointment.save()

    res.status(201).json(savedAppointment)
  } catch (error) {
    console.error('Appointment booking error:', error)
    res.status(500).json({ message: error.message })
  }
})

// Update an appointment
app.put('/api/appointments/:id', async (req, res) => {
  try {
    console.log('PUT appointment route reached!')

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' })
    }

    res.status(200).json(updatedAppointment)
  } catch (error) {
    console.error('Appointment update error:', error)
    res.status(500).json({ message: error.message })
  }
})

// Delete an appointment
app.delete('/api/appointments/:id', async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(
      req.params.id
    )

    if (!deletedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' })
    }

    res.status(200).json({
      message: 'Appointment deleted successfully'
    })
  } catch (error) {
    console.error('Appointment delete error:', error)
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

// ===============================
// BILLING APIs
// ===============================

// Generate a new bill
app.post('/api/billing', async (req, res) => {
  try {
    const {
      patientId,
      patientName,
      billType,
      items
    } = req.body

    const patient = await Patient.findById(patientId)

    if (!patient) {
      return res.status(404).json({
        message: 'Patient not found'
      })
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: 'Please add at least one treatment charge'
      })
    }

    if (items.some(item =>
      !item.description ||
      Number(item.amount) <= 0 ||
      !Number.isFinite(Number(item.amount))
    )) {
      return res.status(400).json({
        message: 'Please provide valid treatment descriptions and amounts'
      })
    }

    const totalAmount = items.reduce((total, item) => {
      return total + Number(item.amount)
    }, 0)

    // Generate invoice number
    const billNumber = `BILL-${Date.now()}`

    const newBill = new Billing({
      billNumber,
      patientId,
      patientName,
      billType,
      totalAmount,
      items,
      balanceAmount: totalAmount,
      paymentStatus: 'Pending'
    })

    const savedBill = await newBill.save()

    res.status(201).json({
      message: 'Bill generated successfully',
      bill: savedBill
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get all bills (exclude deleted bills)
app.get('/api/billing', async (req, res) => {
  try {
    const bills = await Billing.find({
      isDeleted: { $ne: true }
    }).sort({ createdAt: -1 })

    res.json(bills)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get a single bill by ID (exclude deleted bills)
app.get('/api/billing/:id', async (req, res) => {
  try {
    const bill = await Billing.findOne({
      _id: req.params.id,
      isDeleted: { $ne: true }
    })

    if (!bill) {
      return res.status(404).json({
        message: 'Bill not found'
      })
    }

    res.json(bill)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Record a payment
app.post('/api/billing/:id/payments', async (req, res) => {
  try {
    const billId = req.params.id

    const bill = await Billing.findOne({
      _id: billId,
      isDeleted: { $ne: true }
    })

    if (!bill) {
      return res.status(404).json({
        message: 'Bill not found'
      })
    }

    const { amount, paymentMethods } = req.body

    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({
        message: 'Please enter a valid payment amount'
      })
    }

    if (!Array.isArray(paymentMethods) || paymentMethods.length === 0) {
      return res.status(400).json({
        message: 'Please provide at least one payment method'
      })
    }

    if (paymentMethods.some(payment =>
      !['Cash', 'UPI', 'Card', 'Bank Transfer'].includes(payment.method) ||
      !Number.isFinite(Number(payment.amount)) ||
      Number(payment.amount) <= 0
    )) {
      return res.status(400).json({
        message: 'Invalid payment method or amount'
      })
    }

    const methodsTotal = paymentMethods.reduce((total, payment) => {
      return total + Number(payment.amount)
    }, 0)

    if (methodsTotal !== Number(amount)) {
      return res.status(400).json({
        message: 'Payment method amounts must equal the total payment amount'
      })
    }

    if (Number(amount) > bill.balanceAmount) {
      return res.status(400).json({
        message: 'Payment cannot exceed the remaining balance'
      })
    }

    if (
      bill.billType === 'Outpatient' &&
      Number(amount) !== bill.balanceAmount
    ) {
      return res.status(400).json({
        message: 'Outpatients must pay the full remaining balance'
      })
    }

    bill.payments.push({
      amount: Number(amount),
      paymentMethods: paymentMethods.map(payment => ({
        method: payment.method,
        amount: Number(payment.amount)
      }))
    })

    // Calculate total amount paid so far
    const totalPaid = bill.payments.reduce((total, payment) => {
      return total + payment.amount
    }, 0)

    // Update remaining balance
    bill.balanceAmount = Math.max(
      0,
      bill.totalAmount - bill.discountAmount - totalPaid
    )

    // Update payment status
    if (bill.balanceAmount === 0) {
      bill.paymentStatus = 'Paid'
    } else {
      bill.paymentStatus = 'Partial'
    }

    const updatedBill = await bill.save()

    res.json({
      message: 'Payment recorded successfully',
      bill: updatedBill
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Add additional charges to an Inpatient bill
app.post('/api/billing/:id/items', async (req, res) => {
  try {
    const bill = await Billing.findOne({
      _id: req.params.id,
      isDeleted: { $ne: true }
    })

    if (!bill) {
      return res.status(404).json({
        message: 'Bill not found'
      })
    }

    if (bill.billType !== 'Inpatient') {
      return res.status(400).json({
        message: 'Additional charges can only be added to Inpatient bills'
      })
    }

    const { items } = req.body

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: 'Please add at least one additional charge'
      })
    }

    if (items.some(item =>
      !item.description ||
      !Number.isFinite(Number(item.amount)) ||
      Number(item.amount) <= 0
    )) {
      return res.status(400).json({
        message: 'Please provide valid descriptions and amounts'
      })
    }

    const additionalAmount = items.reduce((total, item) => {
      return total + Number(item.amount)
    }, 0)

    bill.items.push(...items)
    bill.totalAmount += additionalAmount
    bill.balanceAmount += additionalAmount

    const totalPaid = bill.payments.reduce((total, payment) => {
      return total + payment.amount
    }, 0)

    if (bill.balanceAmount === 0) {
      bill.paymentStatus = 'Paid'
    } else if (totalPaid > 0) {
      bill.paymentStatus = 'Partial'
    } else {
      bill.paymentStatus = 'Pending'
    }

    const updatedBill = await bill.save()

    res.json({
      message: 'Additional charges added successfully',
      bill: updatedBill
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Apply discount to a bill
app.put('/api/billing/:id/discount', async (req, res) => {
  try {
    const bill = await Billing.findOne({
      _id: req.params.id,
      isDeleted: { $ne: true }
    })

    if (!bill) {
      return res.status(404).json({
        message: 'Bill not found'
      })
    }

    const {
      discountAmount,
      discountReason,
      discountApprovedBy,
      discountAppliedBy
    } = req.body

    // Validate discount amount
    if (
      !Number.isFinite(Number(discountAmount)) ||
      Number(discountAmount) <= 0
    ) {
      return res.status(400).json({
        message: 'Please enter a valid discount amount'
      })
    }

    // Discount must be less than bill total
    if (Number(discountAmount) >= bill.totalAmount) {
      return res.status(400).json({
        message: 'Discount must be less than the bill total'
      })
    }

    // Calculate total already paid
    const totalPaid = bill.payments.reduce((total, payment) => {
      return total + payment.amount
    }, 0)

    // Discount cannot make the balance less than zero
    const newBalance =
      bill.totalAmount - Number(discountAmount) - totalPaid

    if (newBalance < 0) {
      return res.status(400).json({
        message: 'Discount cannot exceed the remaining balance'
      })
    }

    // Store discount details
    bill.discountAmount = Number(discountAmount)
    bill.discountReason = discountReason || ''
    bill.discountApprovedBy = discountApprovedBy || ''
    bill.discountAppliedBy = discountAppliedBy || ''
    bill.discountDate = new Date()

    // Update remaining balance
    bill.balanceAmount = newBalance

    // Update payment status
    if (bill.balanceAmount === 0) {
      bill.paymentStatus = 'Paid'
    } else if (totalPaid > 0) {
      bill.paymentStatus = 'Partial'
    } else {
      bill.paymentStatus = 'Pending'
    }

    const updatedBill = await bill.save()

    res.json({
      message: 'Discount applied successfully',
      bill: updatedBill
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Soft delete a bill
app.delete('/api/billing/:id', async (req, res) => {
  try {
    const bill = await Billing.findOne({
      _id: req.params.id,
      isDeleted: { $ne: true }
    })

    if (!bill) {
      return res.status(404).json({
        message: 'Bill not found'
      })
    }

    bill.isDeleted = true
    await bill.save()

    res.json({
      message: 'Bill deleted successfully'
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
