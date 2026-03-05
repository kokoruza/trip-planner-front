import { useState, useContext, useEffect } from "react"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { AuthContext } from "../auth/AuthContext"
import { getMyTrips, addTripMember } from "../api/tripApi"
import { getAccount } from "../api/accountsApi"
import UserMenu from "../components/UserMenu"
import ThemeToggle from "../components/ThemeToggle"
import LoginPage from "./LoginPage"

export default function JoinTripPage() {
    const { tripId } = useParams()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { user, isAuthenticated } = useContext(AuthContext)
    
    const inviteCode = searchParams.get("code")
    const currentUserId = localStorage.getItem("accountId")

    const [trip, setTrip] = useState(null)
    const [loading, setLoading] = useState(true)
    const [joining, setJoining] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [tripOwnerName, setTripOwnerName] = useState("")

    useEffect(() => {
        if (isAuthenticated && currentUserId) {
            loadTripDetails()
        } else if (!isAuthenticated) {
            setLoading(false)
        }
    }, [tripId, isAuthenticated, currentUserId])

    const loadTripDetails = async () => {
        try {
            setLoading(true)
            setError("")
            const trips = await getMyTrips()
            
            // Check if user is already a member of this trip
            const foundTrip = trips.find(t => t.id === tripId)
            if (foundTrip) {
                // User is already a member
                setTrip(foundTrip)
                setSuccess(true)
                
                // Get owner name
                try {
                    if (foundTrip.ownerId) {
                        const ownerInfo = await getAccount(foundTrip.ownerId)
                        setTripOwnerName(ownerInfo.accountName)
                    }
                } catch (err) {
                    console.error("Ошибка загрузки имени создателя:", err)
                }
                
                return
            }

            // Try to load trip by ID (for display purposes only)
            setTrip({ id: tripId, title: "Группа путешествия" })
        } catch (err) {
            console.error("Ошибка загрузки группы:", err)
            setError("Ошибка загрузки информации о группе")
        } finally {
            setLoading(false)
        }
    }

    const handleJoinTrip = async () => {
        if (!inviteCode) {
            setError("Неверная ссылка приглашения")
            return
        }

        if (!currentUserId) {
            setError("Вы должны быть авторизованы для присоединения к группе")
            return
        }

        try {
            setJoining(true)
            setError("")

            // Add user as member to the trip
            await addTripMember(tripId, currentUserId, "User")
            
            // Load updated trip info
            await loadTripDetails()
            setSuccess(true)
            
            // Redirect to trip details after 2 seconds
            setTimeout(() => {
                navigate(`/trips/${tripId}`)
            }, 2000)
        } catch (err) {
            console.error("Ошибка присоединения:", err)
            setError(
                err?.response?.data?.message || 
                err?.message ||
                "Ошибка при присоединении к группе. Проверьте, что ссылка еще действительна"
            )
        } finally {
            setJoining(false)
        }
    }

    // If not authenticated, show login page with return URL
    if (!isAuthenticated) {
        return <LoginPage />
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

    return (
        <div className="page">
            <div style={{ maxWidth: "600px", margin: "0 auto" }}>
                {/* Header */}
                <div className="page-header" style={{ paddingBottom: "16px", borderBottom: "2px solid white" }}>
                    <h1 style={{ margin: "0" }}>Присоединиться к группе</h1>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <ThemeToggle />
                        <UserMenu />
                    </div>
                </div>

                {/* Content */}
                <div className="trip-section" style={{ marginTop: "32px", textAlign: "center" }}>
                    {success ? (
                        <>
                            <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
                            <h2 style={{ color: "#10b981", marginBottom: "8px" }}>
                                Поздравляем!
                            </h2>
                            <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
                                Вы успешно присоединились к группе
                                {tripOwnerName && ` (создатель: ${tripOwnerName})`}
                            </p>
                            <button 
                                className="btn-primary"
                                onClick={() => navigate(`/trips/${tripId}`)}
                                style={{ padding: "12px 24px", fontSize: "16px" }}
                            >
                                Перейти к группе →
                            </button>
                        </>
                    ) : (
                        <>
                            {error && (
                                <div style={{
                                    background: "#fee2e2",
                                    border: "1px solid #fca5a5",
                                    color: "#ef4444",
                                    padding: "16px",
                                    borderRadius: "8px",
                                    marginBottom: "24px"
                                }}>
                                    {error}
                                </div>
                            )}

                            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔗</div>
                            <h2 style={{ marginBottom: "8px" }}>
                                Приглашение в группу
                            </h2>
                            <p style={{ color: "var(--text-secondary)", marginBottom: "32px" }}>
                                Нажмите кнопку ниже, чтобы присоединиться к группе путешествия
                            </p>

                            {!inviteCode && (
                                <div style={{
                                    background: "#fef2f2",
                                    border: "1px solid #fed3d3",
                                    color: "#87123e",
                                    padding: "12px",
                                    borderRadius: "6px",
                                    marginBottom: "24px",
                                    fontSize: "12px"
                                }}>
                                    ⚠️ Ошибка: неверный код приглашения
                                </div>
                            )}

                            <button 
                                className="btn-primary"
                                onClick={handleJoinTrip}
                                disabled={joining || !inviteCode || !currentUserId}
                                style={{ 
                                    padding: "12px 32px", 
                                    fontSize: "16px",
                                    width: "100%"
                                }}
                            >
                                {joining ? "Присоединяется..." : "Присоединиться ✓"}
                            </button>

                            <button 
                                className="btn-ghost"
                                onClick={() => navigate("/trips")}
                                style={{ 
                                    padding: "12px 32px", 
                                    fontSize: "16px",
                                    width: "100%",
                                    marginTop: "12px"
                                }}
                            >
                                Вернуться к списку групп
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
