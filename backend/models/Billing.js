
const mongoose = require('mongoose')

const billingSchema = new mongoose.Schema({
  billNumber: {
    type: String,
    required: true,
    unique: true
  },

  patientName: {
    type: String,
    required: true
  },

  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },

  billType: {
    type: String,
    enum: ['Outpatient', 'Inpatient'],
    required: true
  },

  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },

  discountAmount: {
    type: Number,
    default: 0,
    min: 0
  },

  discountReason: {
    type: String,
    default: ''
  },

  discountApprovedBy: {
    type: String,
    default: ''
  },

  discountAppliedBy: {
    type: String,
    default: ''
  },

  discountDate: {
    type: Date
  },

  items: [
    {
      description: {
        type: String,
        required: true
      },
      amount: {
        type: Number,
        required: true,
        min: 0
      }
    }
  ],

  payments: [
    {
      paymentDate: {
        type: Date,
        default: Date.now
      },
      amount: {
        type: Number,
        required: true,
        min: 0
      },
      paymentMethods: [
        {
          method: {
            type: String,
            enum: ['Cash', 'UPI', 'Card', 'Bank Transfer'],
            required: true
          },
          amount: {
            type: Number,
            required: true,
            min: 0
          }
        }
      ]
    }
  ],

  balanceAmount: {
    type: Number,
    default: 0,
    min: 0
  },

   paymentStatus: {
    type: String,
    enum: ['Paid', 'Partial', 'Pending'],
    default: 'Pending'
  },

  isDeleted: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true
})

const Billing = mongoose.model('Billing', billingSchema)

module.exports = Billing
