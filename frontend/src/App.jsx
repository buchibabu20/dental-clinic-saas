import { useEffect, useState } from 'react'
import './App.css'
import Patients from './components/Patients'
import Appointments from './components/Appointments'
import Billing from './components/Billing'


function App() {
  const [activePage, setActivePage] = useState('Dashboard')
 const [totalPatients, setTotalPatients] = useState(0)
  const [appointments, setAppointments] = useState([])
  useEffect(() => {
  async function fetchAppointments() {
    try {
      const response = await fetch(
        'http://localhost:5000/api/appointments'
      )

      const data = await response.json()

      setTotalPatients(data.length)

      setAppointments(data)
    } catch (error) {
      console.error('Error fetching appointments:', error)
    }
  }

  fetchAppointments()
}, [])

const todayAppointments = appointments.filter((appointment) => {
  return new Date(appointment.appointmentDate).toDateString() === new Date().toDateString()
})
const completedAppointments = todayAppointments.filter((appointment) => {
  return appointment.status === 'Completed'
})
  return (
    <div className="app">
      <aside className="sidebar">
        <h2 className="brand">DentalCare</h2>
        <p className="clinic-label">CLINIC MANAGEMENT</p>

       
<nav>
  <a
    className={activePage === 'Dashboard' ? 'nav-link active' : 'nav-link'}
    href="#dashboard"
    onClick={() => setActivePage('Dashboard')}
  >
    Dashboard
  </a>

  <a
    className={activePage === 'Patients' ? 'nav-link active' : 'nav-link'}
    href="#patient-list"
    onClick={() => setActivePage('Patients')}
  >
    Patients
  </a>

  <a
    className={activePage === 'Appointments' ? 'nav-link active' : 'nav-link'}
    href="#appointments"
    onClick={() => setActivePage('Appointments')}
  >
    Appointments
  </a>

  <a
    className={activePage === 'Treatments' ? 'nav-link active' : 'nav-link'}
    href="#treatments"
    onClick={() => setActivePage('Treatments')}
  >
    Treatments
  </a>

  <a
    className={activePage === 'Billing' ? 'nav-link active' : 'nav-link'}
    href="#billing"
    onClick={() => setActivePage('Billing')}
  >
    Billing & Payments
  </a>

  <a
    className={activePage === 'Reports' ? 'nav-link active' : 'nav-link'}
    href="#reports"
    onClick={() => setActivePage('Reports')}
  >
    Reports
  </a>

  <a
    className={activePage === 'Settings' ? 'nav-link active' : 'nav-link'}
    href="#settings"
    onClick={() => setActivePage('Settings')}
  >
    Settings
  </a>
</nav>


        <div className="sidebar-bottom">
          <div className="avatar">DR</div>
          <div>
            <strong>Clinic Admin</strong>
            <p>Administrator</p>
          </div>
        </div>
      </aside>

{activePage === 'Dashboard' && (
  <main className="main-content" id="dashboard">

        <header className="topbar">
          <div>
            <p className="eyebrow">OVERVIEW</p>
            <h1>DentalCare Dashboard</h1>
            <p className="subtitle">Welcome back! Here is your clinic overview.</p>
          </div>
          <button className="primary-button" onClick={() => alert('Appointment form coming soon!')}>
            + New Appointment
          </button>
        </header>

        
<section className="stats-grid">

  <div className="stat-card">
    <span className="stat-icon blue">P</span>
    <p>Total Patients</p>
    <h2>{totalPatients}</h2>
    <span className="stat-note">Clinic patient records</span>
  </div>

  <div className="stat-card">
    <span className="stat-icon green">A</span>
    <p>Today's Appointments</p>
    <h2>{todayAppointments.length}</h2>
    <span className="stat-note">6 appointments remaining</span>
  </div>

  <div className="stat-card">
    <span className="stat-icon purple">T</span>
    <p>Treatments Completed</p>
    <h2>{completedAppointments.length}</h2>
    <span className="stat-note">Today's completed visits</span>
  </div>

  <div className="stat-card">
    <span className="stat-icon orange">₹</span>
    <p>Today's Revenue</p>
    <h2>₹32,500</h2>
    <span className="stat-note">Sample dashboard amount</span>
  </div>

</section>


        <section className="content-grid">
          <div className="panel" id="appointments">
            <div className="panel-heading">
              <div>
                <h2>Today's Appointments</h2>
                <p>Manage your upcoming patient visits</p>
              </div>
              <a href="#appointments">View all</a>
            </div>

       {todayAppointments.map((appointment) => (
  <div className="appointment" key={appointment._id}>
    <div className="time">{appointment.appointmentTime}</div>

    <div className="patient-avatar">
      {appointment.patientName.substring(0, 2).toUpperCase()}
    </div>

    <div className="patient-info">
      <strong>{appointment.patientName}</strong>
      <p>{appointment.treatment}</p>
    </div>

    <span className={`status ${appointment.status.toLowerCase()}`}>
      {appointment.status}
    </span>
  </div>
))}
</div>
          <div className="panel" id="patients">
            <div className="panel-heading">
              <div>
                <h2>Quick Actions</h2>
                <p>Common clinic tasks</p>
              </div>
            </div>

            
          <button className="action-button" onClick={() => {
  document.getElementById('patient-list')?.scrollIntoView({ behavior: 'smooth' })
}}>
              <span className="action-icon">+</span>
              <span>
                <strong>Add New Patient</strong>
                <small>Register a patient record</small>
              </span>
              <span className="arrow">›</span>
            </button>

            <button className="action-button" onClick={() => alert('Appointment scheduling coming soon!')}>
              <span className="action-icon">+</span>
              <span>
                <strong>Schedule Appointment</strong>
                <small>Book a patient visit</small>
              </span>
              <span className="arrow">›</span>
            </button>

            <button className="action-button" onClick={() => alert('Billing module coming soon!')}>
              <span className="action-icon">₹</span>
              <span>
                <strong>Create Invoice</strong>
                <small>Prepare a patient bill</small>
              </span>
              <span className="arrow">›</span>
            </button>

            <div className="notice">
              <strong>Getting started</strong>
              <p>This dashboard currently uses sample data. We will connect it to the database later.</p>
            </div>
          </div>
        </section>

        <footer>DentalCare Clinic Management · Dashboard Preview</footer>
    </main>
)}
{activePage === 'Patients' && <Patients />}

{activePage === 'Appointments' && <Appointments />}

{activePage === 'Billing' && <Billing />}
      </div>
  )
}

export default App

