import { useState } from 'react'
import { createTrip } from '../api'

function AddTrip({ onTripAdded }) {
  const [title, setTitle] = useState('')
  const [destination, setDestination] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    await createTrip({ title, destination })

    setTitle('')
    setDestination('')
    onTripAdded()
  }

  return (
    <form onSubmit={handleSubmit} className="add-trip">
      <h2>Добавить поездку</h2>

      <div className="add-trip-row">
        <input
          type="text"
          placeholder="Название"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Место назначения"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
        />

        <button type="submit">Добавить</button>
      </div>
    </form>
  )
}

export default AddTrip