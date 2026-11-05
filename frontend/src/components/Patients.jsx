import { useEffect, useState } from 'react'


function Patients() {
  const [search, setSearch] = useState('')
  const [patients, setPatients] = useState([])

  async function fetchPatients() {
    const response = await fetch('http://localhost:5000/api/patients')
    const data = await response.json()
    console.log('Patients from backend:', data)
    setPatients(data)
  }
  useEffect(() => {
  fetchPatients()
}, [])

  const [showForm, setShowForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newAge, setNewAge] = useState('')
  const [newTreatment, setNewTreatment] = useState('')
  const [editingPatientId, setEditingPatientId] = useState(null)


  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(search.toLowerCase())
  )

 async function addPatient(event) {
  event.preventDefault()

  try {
    const response = await fetch('http://localhost:5000/api/patients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: newName,
        age: Number(newAge),
        treatment: newTreatment
      })
    })

    if (!response.ok) {
      throw new Error('Failed to save patient')
    }

    const savedPatient = await response.json()

    setPatients(prevPatients => [...prevPatients, savedPatient])

    setNewName('')
    setNewAge('')
    setNewTreatment('')
    setShowForm(false)

  } catch (error) {
    console.error('Error saving patient:', error)
    alert('Could not save patient. Please try again.')
  }
}
function startEditPatient(patient) {
  setEditingPatientId(patient._id)
  setNewName(patient.name)
  setNewAge(patient.age)
  setNewTreatment(patient.treatment)
  setShowForm(true)
}
 async function updatePatient(event) {
  event.preventDefault()

  try {
    const response = await fetch(
      `http://localhost:5000/api/patients/${editingPatientId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newName,
          age: Number(newAge),
          treatment: newTreatment
        })
      }
    )

    if (!response.ok) {
      throw new Error('Failed to update patient')
    }

    const updatedPatient = await response.json()

    setPatients(prevPatients =>
      prevPatients.map(patient =>
        patient._id === editingPatientId ? updatedPatient : patient
      )
    )

    setEditingPatientId(null)
    setNewName('')
    setNewAge('')
    setNewTreatment('')
    setShowForm(false)

    alert('Patient updated successfully!')

  } catch (error) {
    console.error('Error updating patient:', error)
    alert('Could not update patient. Please try again.')
  }
}

  async function deletePatient(id) {
  const confirmed = window.confirm(
    'Are you sure you want to delete this patient?'
  )

  if (!confirmed) {
    return
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/patients/${id}`,
      {
        method: 'DELETE'
      }
    )

    if (!response.ok) {
      throw new Error('Failed to delete patient')
    }

    setPatients(prevPatients =>
      prevPatients.filter(patient => patient._id !== id)
    )

  } catch (error) {
    console.error('Error deleting patient:', error)
    alert('Could not delete patient. Please try again.')
  }
}


  return (
    <div className="patients-container" id="patient-list">
      <h1>Patients</h1>

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : '+ Add New Patient'}
      </button>

      {showForm && (
        <form onSubmit={editingPatientId ? updatePatient : addPatient}>
          <h2>{editingPatientId ? 'Edit Patient' : 'Register New Patient'}</h2>

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
<button type="submit">
  {editingPatientId ? 'Update Patient' : 'Save Patient'}
</button>
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
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredPatients.map((patient) => (
            <tr key={patient._id}>
  <td>{patient._id}</td>
  <td>{patient.name}</td>
  <td>{patient.age}</td>
  <td>{patient.treatment}</td>
  <td>
    <button onClick={() => startEditPatient(patient)}>
  Edit
</button>

<button onClick={() => deletePatient(patient._id)}>
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

export default Patients


