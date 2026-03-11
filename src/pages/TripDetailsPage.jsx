import { useEffect, useState, useContext } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { getMyTrips } from "../api/tripApi"
import { getBoards, createBoard } from "../api/boardApi"
import { AuthContext } from "../auth/AuthContext"
import UserMenu from "../components/UserMenu"
import ThemeToggle from "../components/ThemeToggle"
import TripMembersManager from "../components/TripMembersManager"

export default function TripDetailsPage() {

    const { tripId } = useParams()
    const navigate = useNavigate()
    const { logout } = useContext(AuthContext)

    const [trip, setTrip] = useState(null)
    const [boards, setBoards] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [showBoardModal, setShowBoardModal] = useState(false)
    const [boardFormData, setBoardFormData] = useState({
        name: "",
        description: ""
    })
    const [creatingBoard, setCreatingBoard] = useState(false)

    useEffect(() => {
        loadTripDetails()
    }, [tripId])

    const loadTripDetails = async () => {
        try {
            setLoading(true)
            const trips = await getMyTrips()
            const foundTrip = trips.find(t => t.id === tripId)
            
            if (!foundTrip) {
                setError("Отпуск не найден")
                return
            }
            
            setTrip(foundTrip)

            const boardsData = await getBoards(tripId)
            setBoards(boardsData)
        } catch (err) {
            setError("Ошибка загрузки данных")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateBoard = async (e) => {
        e.preventDefault()
        setError("")

        if (!boardFormData.name.trim()) {
            setError("Название доски обязательно")
            return
        }

        if (!boardFormData.description.trim()) {
            setError("Описание доски обязательно")
            return
        }

        try {
            setCreatingBoard(true)
            const newBoard = await createBoard({
                name: boardFormData.name,
                description: boardFormData.description,
                tripId: tripId
            })
            
            setBoards([...boards, newBoard])
            setBoardFormData({ name: "", description: "" })
            setShowBoardModal(false)
        } catch (err) {
            setError(err?.response?.data?.message || "Ошибка создания доски")
        } finally {
            setCreatingBoard(false)
        }
    }

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    if (loading) {
        return (
            <div className="page">
                <div style={{ textAlign: "center", padding: "60px 24px" }}>
                    Загрузка...
                </div>
            </div>
        )
    }

    if (error || !trip) {
        return (
            <div className="page">
                <div style={{ textAlign: "center", padding: "60px 24px", color: "#ef4444" }}>
                    {error || "Отпуск не найден"}
                </div>
                <div style={{ textAlign: "center" }}>
                    <Link to="/trips" className="btn-primary" style={{ display: "inline-block" }}>
                        Вернуться к отпускам
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="page">
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                {/* Header */}
                <div className="page-header" style={{ paddingBottom: "16px", borderBottom: "2px solid white" }}>
                    <div>
                        <Link to="/trips" style={{ 
                            color: "var(--primary)", 
                            textDecoration: "none",
                            marginRight: "16px",
                            fontWeight: "600"
                        }}>
                            ← Вернуться
                        </Link>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <ThemeToggle />
                        <UserMenu />
                    </div>
                </div>

                {/* Trip Header */}
                <div className="trip-details-header">
                    <h1>{trip.title}</h1>
                    <p className="destination">📍 {trip.destination}</p>
                    {trip.description && (
                        <p className="description">{trip.description}</p>
                    )}
                </div>

                {/* Trip Info Grid */}
                <div className="trip-info-grid">
                    {/* Members Section */}
                    <TripMembersManager 
                        trip={trip} 
                        onMembersUpdate={(members) => {
                            setTrip({ ...trip, members })
                        }}
                    />

                    {/* Trip Info Section */}
                    <div className="trip-section">
                        <h2>📋 Информация</h2>
                        <div className="section-content">
                            <div style={{ padding: "12px", background: "var(--hover)", borderRadius: "8px" }}>
                                <div style={{ fontSize: "12px", color: "var(--text-light)" }}>ID</div>
                                <div style={{ fontFamily: "monospace", fontSize: "12px", marginTop: "4px", wordBreak: "break-all" }}>
                                    {trip.id}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Boards Section */}
                <div className="trip-section" style={{ marginTop: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <h2 style={{ margin: "0" }}>📊 Доски</h2>
                        <button 
                            className="btn-primary"
                            onClick={() => setShowBoardModal(true)}
                            style={{ padding: "8px 16px", fontSize: "14px" }}
                        >
                            + Создать доску
                        </button>
                    </div>
                    
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

                    {boards.length === 0 ? (
                        <div className="boards-empty-message">
                            На этот отпуск еще не созданы доски
                        </div>
                    ) : (
                        <div className="boards-list-grid">
                            {boards.map(board => (
                                <Link
                                    key={board.id}
                                    to={`/boards/${board.id}`}
                                    className="board-list-item"
                                >
                                    <div className="board-name">{board.title || board.name}</div>
                                    {board.description && (
                                        <p className="board-description">{board.description}</p>
                                    )}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Create Board Modal */}
                {showBoardModal && (
                    <div className="modal-overlay" onClick={() => !creatingBoard && setShowBoardModal(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <h2>Создать новую доску</h2>
                            
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

                            <form onSubmit={handleCreateBoard}>
                                <input
                                    type="text"
                                    placeholder="Название доски (обязательно)"
                                    value={boardFormData.name}
                                    onChange={e => setBoardFormData({ ...boardFormData, name: e.target.value })}
                                    required
                                    disabled={creatingBoard}
                                />

                                <textarea
                                    placeholder="Описание доски (обязательно)"
                                    value={boardFormData.description}
                                    onChange={e => setBoardFormData({ ...boardFormData, description: e.target.value })}
                                    required
                                    disabled={creatingBoard}
                                />

                                <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                                    <button 
                                        type="submit" 
                                        className="btn-primary"
                                        disabled={creatingBoard}
                                        style={{ flex: 1 }}
                                    >
                                        {creatingBoard ? "Создание..." : "Создать"}
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn-secondary"
                                        disabled={creatingBoard}
                                        onClick={() => setShowBoardModal(false)}
                                        style={{ flex: 1 }}
                                    >
                                        Отмена
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Quick Links to Polls & Gallery */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "12px",
                    marginTop: "24px"
                }}>
                    <Link
                        to={`/trips/${tripId}/polls`}
                        className="btn-primary"
                        style={{
                            padding: "16px",
                            textAlign: "center",
                            textDecoration: "none",
                            borderRadius: "8px",
                            fontSize: "16px",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px"
                        }}
                    >
                        🗳️ Голосования
                    </Link>
                    <Link
                        to={`/trips/${tripId}/gallery`}
                        className="btn-primary"
                        style={{
                            padding: "16px",
                            textAlign: "center",
                            textDecoration: "none",
                            borderRadius: "8px",
                            fontSize: "16px",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px"
                        }}
                    >
                        🖼️ Галерея
                    </Link>
                    <Link
                        to={`/trips/${tripId}/calendar`}
                        className="btn-primary"
                        style={{
                            padding: "16px",
                            textAlign: "center",
                            textDecoration: "none",
                            borderRadius: "8px",
                            fontSize: "16px",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px"
                        }}
                    >
                        📅 Календарь
                    </Link>
                </div>
            </div>
        </div>
    )
}
