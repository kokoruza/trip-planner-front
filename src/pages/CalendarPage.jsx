import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AuthContext } from "../auth/AuthContext"
import { getMyTrips } from "../api/tripApi"
import { getEventsByTrip, getVacationSchedules, deleteEvent, deleteVacationSchedule } from "../api/calendarApi"
import { getTripMembers } from "../api/tripApi"
import Calendar from "../components/Calendar"
import EventModal from "../components/EventModal"
import VacationScheduleModal from "../components/VacationScheduleModal"
import DayDetailsModal from "../components/DayDetailsModal"
import UserMenu from "../components/UserMenu"
import ThemeToggle from "../components/ThemeToggle"

export default function CalendarPage() {
    const { tripId } = useParams()
    const navigate = useNavigate()
    const { user } = useContext(AuthContext)

    const [trip, setTrip] = useState(null)
    const [events, setEvents] = useState([])
    const [vacationSchedules, setVacationSchedules] = useState([])
    const [members, setMembers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    
    const [showEventModal, setShowEventModal] = useState(false)
    const [showVacationModal, setShowVacationModal] = useState(false)
    const [selectedDay, setSelectedDay] = useState(null)

    useEffect(() => {
        loadCalendarData()
    }, [tripId])

    const loadCalendarData = async () => {
        try {
            setLoading(true)
            setError("")

            // Load trip
            const trips = await getMyTrips()
            const foundTrip = trips.find(t => t.id === tripId)
            if (!foundTrip) {
                setError("Отпуск не найден")
                return
            }
            setTrip(foundTrip)

            // Load members
            const membersData = await getTripMembers(tripId)
            setMembers(membersData)

            // Load events and vacation schedules
            const eventsData = await getEventsByTrip(tripId)
            const vacationsData = await getVacationSchedules(tripId)
            
            setEvents(eventsData)
            setVacationSchedules(vacationsData)
        } catch (err) {
            setError("Ошибка загрузки данных календаря")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleEventCreated = (newEvent) => {
        setEvents([...events, newEvent])
    }

    const handleEventDeleted = (eventId) => {
        setEvents(events.filter(e => e.id !== eventId))
    }

    const handleScheduleCreated = (newSchedule) => {
        setVacationSchedules([...vacationSchedules, newSchedule])
    }

    const handleScheduleDeleted = (scheduleId) => {
        setVacationSchedules(vacationSchedules.filter(s => s.id !== scheduleId))
    }

    const handleDaySelect = (date) => {
        setSelectedDay(date)
    }

    const handleAddEventFromDay = () => {
        setShowEventModal(true)
    }

    const handleAddVacationFromDay = () => {
        setShowVacationModal(true)
    }

    if (loading) {
        return (
            <div className="page">
                <div style={{ textAlign: "center", padding: "60px 24px", fontSize: "18px" }}>
                    Загрузка календаря...
                </div>
            </div>
        )
    }

    if (error && !trip) {
        return (
            <div className="page">
                <div style={{ textAlign: "center", padding: "60px 24px", color: "#ef4444" }}>
                    {error}
                </div>
            </div>
        )
    }

    return (
        <div className="page calendar-page" style={{ display: "flex", flexDirection: "column", height: window.innerWidth <= 768 ? "100vh" : "auto", padding: window.innerWidth <= 768 ? "0" : "24px" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", flex: window.innerWidth <= 768 ? "1" : "0", minHeight: window.innerWidth <= 768 ? "0" : "auto", overflow: window.innerWidth <= 768 ? "hidden" : "visible" }}>
                {/* Header - Sticky on Mobile */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: window.innerWidth <= 768 ? "0" : "32px",
                    paddingBottom: window.innerWidth <= 768 ? "12px" : "16px",
                    paddingTop: window.innerWidth <= 768 ? "8px" : "0",
                    borderBottom: "2px solid var(--border)",
                    flexWrap: "wrap",
                    gap: "12px",
                    position: window.innerWidth <= 768 ? "sticky" : "relative",
                    top: 0,
                    zIndex: window.innerWidth <= 768 ? "10" : "auto",
                    background: window.innerWidth <= 768 ? "var(--white)" : "transparent",
                    flexShrink: 0
                }}>
                    <div>
                        <button
                            className="btn-secondary"
                            onClick={() => navigate(`/trips/${tripId}`)}
                            style={{ padding: "8px 16px", fontSize: "14px", whiteSpace: "nowrap" }}
                        >
                            ← Назад
                        </button>
                    </div>
                    <h1 style={{ 
                        margin: 0, 
                        color: "var(--primary)", 
                        flex: "1 1 100%", 
                        textAlign: "center",
                        fontSize: "clamp(18px, 5vw, 24px)"
                    }}>
                        📅 Календарь {trip?.name}
                    </h1>
                    <div style={{ 
                        display: "flex", 
                        gap: "8px",
                        marginLeft: "auto"
                    }}>
                        <ThemeToggle />
                        <UserMenu />
                    </div>
                </div>

                {error && (
                    <div style={{
                        color: "#ef4444",
                        padding: "12px",
                        background: "#fee2e2",
                        borderRadius: "8px",
                        fontSize: "14px",
                        marginBottom: "24px",
                        border: "1px solid #fca5a5"
                    }}>
                        {error}
                    </div>
                )}

                {/* Calendar - Scrollable on Mobile */}
                <div style={{
                    background: "var(--white)",
                    borderRadius: window.innerWidth <= 768 ? "0" : "var(--radius)",
                    padding: window.innerWidth <= 768 ? "12px" : "24px",
                    boxShadow: window.innerWidth <= 768 ? "none" : "var(--shadow)",
                    overflowX: "auto",
                    overflowY: window.innerWidth <= 768 ? "auto" : "hidden",
                    flex: window.innerWidth <= 768 ? "1" : "0",
                    minHeight: window.innerWidth <= 768 ? "0" : "auto"
                }}>
                    <Calendar
                        events={events}
                        vacationSchedules={vacationSchedules}
                        onDaySelect={handleDaySelect}
                    />
                </div>

                {/* Info Box */}
                <div style={{
                    marginTop: "24px",
                    padding: "16px",
                    background: "var(--bg-secondary)",
                    borderRadius: "var(--radius)",
                    border: "1px solid var(--border)",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px"
                }}>
                    <div>
                        <span style={{
                            display: "inline-block",
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            border: "2px solid var(--primary)",
                            marginRight: "8px"
                        }}></span>
                        <span style={{ fontSize: "14px", color: "var(--text)" }}>
                            синяя рамка — события
                        </span>
                    </div>
                    <div>
                        <span style={{
                            display: "inline-block",
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            border: "2px solid #f59e0b",
                            marginRight: "8px"
                        }}></span>
                        <span style={{ fontSize: "14px", color: "var(--text)" }}>
                            оранжевая рамка — мой отпуск
                        </span>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showEventModal && (
                <EventModal
                    tripId={tripId}
                    onClose={() => setShowEventModal(false)}
                    onEventCreated={handleEventCreated}
                    selectedDate={selectedDay}
                />
            )}

            {showVacationModal && (
                <VacationScheduleModal
                    tripId={tripId}
                    onClose={() => setShowVacationModal(false)}
                    onScheduleCreated={handleScheduleCreated}
                    selectedDate={selectedDay}
                />
            )}

            {selectedDay && (
                <DayDetailsModal
                    date={selectedDay}
                    events={events}
                    vacations={vacationSchedules}
                    onClose={() => setSelectedDay(null)}
                    onEventDeleted={handleEventDeleted}
                    onVacationDeleted={handleScheduleDeleted}
                    onAddEvent={handleAddEventFromDay}
                    onAddVacation={handleAddVacationFromDay}
                />
            )}
        </div>
    )
}
