import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AuthContext } from "../auth/AuthContext"
import { getPollsByTrip } from "../api/pollApi"
import PollCard from "../components/PollCard"
import CreatePollModal from "../components/CreatePollModal"

export default function PollsPage() {
    const { tripId } = useParams()
    const navigate = useNavigate()
    const { user } = useContext(AuthContext)
    
    const [polls, setPolls] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [showCreateModal, setShowCreateModal] = useState(false)

    useEffect(() => {
        loadPolls()
    }, [tripId])

    const loadPolls = async () => {
        try {
            setLoading(true)
            setError("")
            const response = await getPollsByTrip(tripId)
            setPolls(response.data || [])
        } catch (err) {
            setError("Ошибка загрузки голосований")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handlePollCreated = (newPoll) => {
        setPolls([newPoll, ...polls])
        setShowCreateModal(false)
    }

    const handlePollDeleted = (pollId) => {
        setPolls(polls.filter(p => p.id !== pollId))
    }

    const handlePollUpdated = (updatedPoll) => {
        setPolls(polls.map(p => p.id === updatedPoll.id ? updatedPoll : p))
    }

    if (loading) {
        return (
            <div className="page">
                <div style={{ textAlign: "center", padding: "40px" }}>
                    Загрузка голосований...
                </div>
            </div>
        )
    }

    return (
        <div className="page">
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                <div className="page-header" style={{ marginBottom: "24px" }}>
                    <button className="btn-secondary" onClick={() => navigate(-1)}>
                        ← Назад
                    </button>
                    <h1 style={{ margin: "0", flex: 1, textAlign: "center", color: "var(--primary)" }}>
                        🗳️ Голосования
                    </h1>
                    <button 
                        className="btn-primary"
                        onClick={() => setShowCreateModal(true)}
                        style={{ padding: "8px 16px", fontSize: "14px" }}
                    >
                        ➕ Новое
                    </button>
                </div>

                {error && (
                    <div style={{
                        padding: "12px",
                        background: "#fee2e2",
                        border: "1px solid #fca5a5",
                        borderRadius: "8px",
                        color: "#ef4444",
                        marginBottom: "16px"
                    }}>
                        {error}
                    </div>
                )}

                {polls.length === 0 ? (
                    <div className="empty-message" style={{ textAlign: "center", padding: "40px" }}>
                        📭 Здесь пока нет голосований
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {polls.map(poll => (
                            <PollCard
                                key={poll.id}
                                poll={poll}
                                onPollUpdated={handlePollUpdated}
                                onPollDeleted={handlePollDeleted}
                            />
                        ))}
                    </div>
                )}

                {showCreateModal && (
                    <CreatePollModal
                        tripId={tripId}
                        onClose={() => setShowCreateModal(false)}
                        onPollCreated={handlePollCreated}
                    />
                )}
            </div>
        </div>
    )
}
