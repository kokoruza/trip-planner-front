function TripList({ trips }) {
  return (
    <div className="trip-list">
      <h2>Список поездок</h2>
      {trips.length === 0 ? (
        <p className="muted">Поездок пока нет</p>
      ) : (
        <ul>
          {trips.map((trip) => (
            <li key={trip.id} className="trip-item">
              <strong>{trip.title}</strong>
              <span className="trip-dest">{trip.destination}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TripList