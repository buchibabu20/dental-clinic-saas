import { useEffect, useState } from 'react'

function Patients() {
  const [search, setSearch] = useState('')
  const [patients, setPatients] = useState([])

  async function fetchPatients() {
    const response = await fetch('http://localhost:5000/api/patients')
    const data = await response.json()
    setPatients(data)
  }
  const [showForm, setShowForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newAge, setNewAge] = useState('')
  const [newTreatment, setNewTreatment] = useState('')


  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(search.toLowerCase())
  )

  function addPatient(event) {
    event.preventDefault()

    const newPatient = {
      id: Date.now(),
      name: newName,
      age: Number(newAge),
      treatment: newTreatment
    }

    setPatients([...patients, newPatient])
    setNewName('')
    setNewAge('')
    setNewTreatment('')
    setShowForm(false)
  }

  return (
    <div className="patients-container" id="patient-list">
      <h1>Patients</h1>

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : '+ Add New Patient'}
      </button>

      {showForm && (
        <form onSubmit={addPatient}>
          <h2>Register New Patient</h2>

          <input
            type="text"
            placeholder="Patient name"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Patient age"
            value={newAge}
            onChange={(event) => setNewAge(event.target.value)}
            min="0"
            required
          />

          <input
            type="text"
            placeholder="Treatment"
            value={newTreatment}
            onChange={(event) => setNewTreatment(event.target.value)}
            required
          />

          <button type="submit">Save Patient</button>
        </form>
      )}

      <p>Manage your dental clinic patients here.</p>

      <input
        type="text"
        placeholder="Search patients by name..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <table className="patients-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Treatment</th>
          </tr>
        </thead>

        <tbody>
          {filteredPatients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.id}</td>
              <td>{patient.name}</td>
              <td>{patient.age}</td>
              <td>{patient.treatment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Patients


