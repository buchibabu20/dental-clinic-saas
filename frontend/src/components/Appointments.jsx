import { useEffect, useState } from 'react'

function Appointments() {
  const [appointments, setAppointments] = useState([])
  const [showForm, setShowForm] = useState(false)
const [patientName, setPatientName] = useState('')
const [appointmentDate, setAppointmentDate] = useState('')
const [appointmentTime, setAppointmentTime] = useState('')
const [treatment, setTreatment] = useState('')

  async function fetchAppointments() {
    try {
      const response = await fetch(
        'http://localhost:5000/api/appointments'
      )

      if (!response.ok) {
        throw new Error('Failed to fetch appointments')
      }

      const data = await response.json()
      setAppointments(data)
    } catch (error) {
      console.error('Error fetching appointments:', error)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  return (
    <div className="appointments-container">
      <h2>Appointment Management</h2>
      <button onClick={() => setShowForm(!showForm)}>
  {showForm ? 'Close Form' : 'Book Appointment'}
</button>
{showForm && (
  <div>
    <h3>Book New Appointment</h3>
<input
  type="text"
  placeholder="Patient Name"
  value={patientName}
  onChange={(event) => setPatientName(event.target.value)}
  
/>
    <input
      type="date"
      value={appointmentDate}
      onChange={(event) => setAppointmentDate(event.target.value)}
    />
<button type="button">
  Confirm Appointment
</button>
  </div>
  )}
      <p>Manage your patient appointments here.</p>

      <table>
        <thead>
          <tr>
            <th>Patient</th>
            <th>Date</th>
            <th>Time</th>
            <th>Treatment</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment._id}>
              <td>{appointment.patientName}</td>
              <td>
                {new Date(appointment.appointmentDate).toLocaleDateString()}
              </td>
              <td>{appointment.appointmentTime}</td>
              <td>{appointment.treatment}</td>
              <td>{appointment.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Appointments