import { useEffect, useState } from 'react'

function Appointments() {
  const [appointments, setAppointments] = useState([])
  const [showForm, setShowForm] = useState(false)
const [patientName, setPatientName] = useState('')
const [appointmentDate, setAppointmentDate] = useState('')
const [appointmentTime, setAppointmentTime] = useState('')
const [treatment, setTreatment] = useState('')
const [editingAppointment, setEditingAppointment] = useState(null)

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

  async function handleConfirmAppointment() {
  try {
    const response = await fetch('http://localhost:5000/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        patientName,
        appointmentDate,
        appointmentTime,
        treatment
      })
    })

    if (!response.ok) {
      throw new Error('Failed to save appointment')
    }
    await fetchAppointments()
    alert('Appointment booked successfully!')
    setPatientName('')
setAppointmentDate('')
setAppointmentTime('')
setTreatment('')
setShowForm(false)
  
  } catch (error) {
    console.error('Error booking appointment:', error)
    alert('Failed to book appointment')
  }
}
function handleEditClick(appointment) {
  setEditingAppointment(appointment)
  setPatientName(appointment.patientName)
  setAppointmentDate(appointment.appointmentDate.slice(0, 10))
  setAppointmentTime(appointment.appointmentTime)
  setTreatment(appointment.treatment)
}
async function handleUpdateAppointment() {
  try {
    const response = await fetch(
      `http://localhost:5000/api/appointments/${editingAppointment._id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
         body: JSON.stringify({
      patientName,
      appointmentDate,
      appointmentTime,
      treatment
    })
      }
    )
if (!response.ok) {
  throw new Error('Failed to update appointment')
  } 
  await fetchAppointments()
  alert('Appointment updated successfully!')
  setEditingAppointment(null)
  setPatientName('')
setAppointmentDate('')
setAppointmentTime('')
setTreatment('')
}
  

  catch (error) {
    console.error('Error updating appointment:', error)
  }
}
async function handleDeleteAppointment(id) {
  const confirmDelete = window.confirm(
    'Are you sure you want to delete this appointment?'
  )

  if (!confirmDelete) {
    return
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/appointments/${id}`,
      {
        method: 'DELETE'
      }
    )

    if (!response.ok) {
      throw new Error('Failed to delete appointment')
    }

    await fetchAppointments()

    alert('Appointment deleted successfully!')
  } catch (error) {
    console.error('Error deleting appointment:', error)
    alert('Failed to delete appointment')
  }
}

async function handleStatusChange(id, newStatus) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/appointments/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus
        })
      }
    )

    if (!response.ok) {
      throw new Error('Failed to update appointment status')
    }

    await fetchAppointments()

    alert('Appointment status updated successfully!')
  } catch (error) {
    console.error('Error updating appointment status:', error)
    alert('Failed to update appointment status')
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
    <input
  type="text"
  placeholder="Appointment Time (e.g. 10:30 AM)"
  value={appointmentTime}
  onChange={(event) => setAppointmentTime(event.target.value)}
/>

<input
  type="text"
  placeholder="Treatment"
  value={treatment}
  onChange={(event) => setTreatment(event.target.value)}
/>
<button
  type="button"
  onClick={handleConfirmAppointment}
>
  Confirm Appointment
</button>
  </div>
  )}
  {editingAppointment && (
  <div>
    <h3>Edit Appointment</h3>
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

<input
  type="text"
  placeholder="Appointment Time"
  value={appointmentTime}
  onChange={(event) => setAppointmentTime(event.target.value)}
/>

<input
  type="text"
  placeholder="Treatment"
  value={treatment}
  onChange={(event) => setTreatment(event.target.value)}
/>
<button
  type="button"
  onClick={handleUpdateAppointment}
>
  Update Appointment
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
            <th>Action</th>
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
              <td>
  <select
    value={appointment.status}
    onChange={(event) =>
      handleStatusChange(appointment._id, event.target.value)
    }
  >
    <option value="Scheduled">Scheduled</option>
    <option value="Completed">Completed</option>
    <option value="Cancelled">Cancelled</option>
  </select>
</td>
              <td>
                
<button onClick={() => handleEditClick(appointment)}>
  Edit
</button>
<button onClick={() => handleDeleteAppointment(appointment._id)}>
  Delete
</button>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Appointments