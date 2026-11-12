import { useEffect, useState } from 'react'
function Billing() {
  const [bills, setBills] = useState([])
  useEffect(() => {
  async function fetchBills() {
    try {
      const response = await fetch('http://localhost:5000/api/billing')
      const data = await response.json()
      console.log('Billing data:', data)

      setBills(data)
    } catch (error) {
      console.error('Error fetching bills:', error)
    }
  }

  fetchBills()
}, [])
  return (
    <div>
      <h2>Billing Management</h2>
      <p>Total Bills: {bills.length}</p>
      {bills.map((bill) => (
  <div key={bill._id}>
    <p>Bill Number: {bill.billNumber}</p>
    <p>Total Amount: ₹{bill.totalAmount}</p>
    <p>Payment Status: {bill.paymentStatus}</p>
    <hr />
  </div>
))}
    </div>
 
  )
}

export default Billing