import { useEffect, useState, useContext } from "react"
import { useNavigate, Link } from "react-router-dom"
import { getMyTrips, createTrip } from "../api/tripApi"
import { AuthContext } from "../auth/AuthContext"

export default function TripsPage() {

    const { logout } = useContext(AuthContext)
    const navigate = useNavigate()

    const [trips, setTrips] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [showModal, setShowModal] = useState(false)
    
    const [formData, setFormData] = useState({
        title: "",
        destination: "",
        description: ""
    })
    const [creatingTrip, setCreatingTrip] = useState(false)

    useEffect(() => {
        loadTrips()
    }, [])

    const loadTrips = async () => {
        try {
            setLoading(true)
            const data = await getMyTrips()
            setTrips(data)
        } catch (err) {
            setError("Ошибка загрузки отпусков")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateTrip = async (e) => {
        e.preventDefault()
        setError("")

        if (!formData.title.trim() || !formData.destination.trim()) {
            setError("Название и пункт назначения обязательны")
            return
        }

        try {
            setCreatingTrip(true)
            await createTrip({
                title: formData.title,
                destination: formData.destination,
                description: formData.description || null
            })
            
            setFormData({ title: "", destination: "", description: "" })
            setShowModal(false)
            await loadTrips()
        } catch (err) {
            setError(err?.response?.data?.message || "Ошибка создания отпуска")
        } finally {
            setCreatingTrip(false)
        }
    }

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    return (
        <div className="page trips-page">
            <div className="trips-header">
                <h1>Мои отпуска</h1>
                <button className="btn-primary" onClick={() => setShowModal(true)}>
                    + Создать новый
                </button>
                <button className="btn-ghost" onClick={() => navigate("/profile")} style={{ marginLeft: "12px" }}>
                    👤 Профиль
                </button>
                <button className="btn-ghost" onClick={handleLogout} style={{ marginLeft: "12px" }}>
                    Выход
                </button>
            </div>

            {error && (
                <div style={{ 
                    color: "#ef4444", 
                    padding: "16px", 
                    background: "#fee2e2", 
                    borderRadius: "8px", 
                    fontSize: "14px",
                    marginBottom: "24px"
                }}>
                    {error}
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: "center", padding: "60px 24px", fontSize: "18px" }}>
                    Загрузка...
                </div>
            ) : trips.length === 0 ? (
                <div className="trips-empty">
                    <div className="emoji">✈️</div>
                    <h3>Отпусков еще нет</h3>
                    <p>Создайте свой первый отпуск и начните планировать приключение!</p>
                    <button className="btn-primary" onClick={() => setShowModal(true)}>
                        Создать отпуск
                    </button>
                </div>
            ) : (
                <div className="trips-container">
                    {trips.map(trip => (
                        <Link 
                            key={trip.id} 
                            to={`/trips/${trip.id}`}
                            style={{ textDecoration: "none", color: "inherit" }}
                        >
                            <div className="trip-card">
                                <h3 className="trip-title">{trip.title}</h3>
                                <p className="trip-destination">📍 {trip.destination}</p>
                                {trip.description && (
                                    <p className="trip-description">{trip.description}</p>
                                )}
                                <div className="trip-meta">
                                    <span>ID: {trip.id.slice(0, 8)}...</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Modal for creating trip */}
            {showModal && (
                <div className="modal-overlay" onClick={() => !creatingTrip && setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>Создать новый отпуск</h2>
                        
                        {error && (
                            <div style={{ 
                                color: "#ef4444", 
                                padding: "12px", 
                                background: "#fee2e2", 
                                borderRadius: "8px", 
                                fontSize: "14px",
                                marginBottom: "16px"
                            }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleCreateTrip}>
                            <input
                                type="text"
                                placeholder="Название отпуска (обязательно)"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                                disabled={creatingTrip}
                            />

                            <input
                                type="text"
                                placeholder="Пункт назначения (обязательно)"
                                value={formData.destination}
                                onChange={e => setFormData({ ...formData, destination: e.target.value })}
                                required
                                disabled={creatingTrip}
                            />

                            <textarea
                                placeholder="Описание (опционально)"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                disabled={creatingTrip}
                            />

                            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                                <button 
                                    type="submit" 
                                    className="btn-primary"
                                    disabled={creatingTrip}
                                    style={{ flex: 1 }}
                                >
                                    {creatingTrip ? "Создание..." : "Создать"}
                                </button>
                                <button 
                                    type="button" 
                                    className="btn-secondary"
                                    disabled={creatingTrip}
                                    onClick={() => setShowModal(false)}
                                    style={{ flex: 1 }}
                                >
                                    Отмена
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
