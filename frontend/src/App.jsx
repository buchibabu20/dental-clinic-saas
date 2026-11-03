import { useState } from 'react'
import './App.css'
import Patients from './components/Patients'

function App() {
  const [totalPatients, setTotalPatients] = useState(1250)
  return (
    <div className="app">
      <aside className="sidebar">
        <h2 className="brand">DentalCare</h2>
        <p className="clinic-label">CLINIC MANAGEMENT</p>

        <nav>
          <a className="nav-link active" href="#dashboard">Dashboard</a>
          <a className="nav-link" href="#patient-list">Patients</a>
          <a className="nav-link" href="#appointments">Appointments</a>
          <a className="nav-link" href="#treatments">Treatments</a>
          <a className="nav-link" href="#billing">Billing & Payments</a>
          <a className="nav-link" href="#reports">Reports</a>
          <a className="nav-link" href="#settings">Settings</a>
        </nav>

        <div className="sidebar-bottom">
          <div className="avatar">DR</div>
          <div>
            <strong>Clinic Admin</strong>
            <p>Administrator</p>
          </div>
        </div>
      </aside>

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
            <h2>24</h2>
            <span className="stat-note">6 appointments remaining</span>
          </div>

          <div className="stat-card">
            <span className="stat-icon purple">T</span>
            <p>Treatments Completed</p>
            <h2>18</h2>
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

            <div className="appointment">
              <div className="time">09:00 AM</div>
              <div className="patient-avatar">RK</div>
              <div className="patient-info">
                <strong>Rahul Kumar</strong>
                <p>Dental Cleaning</p>
              </div>
              <span className="status completed">Completed</span>
            </div>

            <div className="appointment">
              <div className="time">10:30 AM</div>
              <div className="patient-avatar">SP</div>
              <div className="patient-info">
                <strong>Sneha Patel</strong>
                <p>Dental Checkup</p>
              </div>
              <span className="status waiting">Waiting</span>
            </div>

            <div className="appointment">
              <div className="time">11:30 AM</div>
              <div className="patient-avatar">AM</div>
              <div className="patient-info">
                <strong>Arjun Mehta</strong>
                <p>Root Canal Consultation</p>
              </div>
              <span className="status scheduled">Scheduled</span>
            </div>

            <div className="appointment">
              <div className="time">12:30 PM</div>
              <div className="patient-avatar">PD</div>
              <div className="patient-info">
                <strong>Priya Das</strong>
                <p>Teeth Whitening</p>
              </div>
              <span className="status scheduled">Scheduled</span>
            </div>
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
      <Patients />
    </div>
  )
}

export default App

