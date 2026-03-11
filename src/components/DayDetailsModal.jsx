import { useState } from "react"
import { deleteEvent, deleteVacationSchedule } from "../api/calendarApi"
import EventDetailsModal from "./EventDetailsModal"

const formatDate = (date) => {
    if (!date) return ""
    const d = new Date(date)
    const days = ["Вск", "Пнд", "Втр", "Ср", "Чтв", "Птн", "Сбт"]
    const months = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня",
                   "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"]
    return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`
}

import { API_ORIGIN } from "../api/axios"

const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return null
    if (avatarPath.startsWith('http')) return avatarPath
    return `${API_ORIGIN}${avatarPath}`
}

const getImageUrl = (event) => {
    if (!event) return null
    // API returns imageUrl as a relative path like "/gallery/..."
    // Similar to how avatars work, need to prepend API_ORIGIN
    if (event.imageUrl) {
        return event.imageUrl.startsWith('http') 
            ? event.imageUrl 
            : `${API_ORIGIN}${event.imageUrl}`
    }
    if (event.imagePath) {
        return event.imagePath.startsWith('http')
            ? event.imagePath
            : `${API_ORIGIN}${event.imagePath}`
    }
    if (event.photoPath) {
        return event.photoPath.startsWith('http')
            ? event.photoPath
            : `${API_ORIGIN}${event.photoPath}`
    }
    return null
}

export default function DayDetailsModal({ date, events, vacations, onClose, onEventDeleted, onVacationDeleted, onAddEvent, onAddVacation }) {
    const [deleteLoading, setDeleteLoading] = useState(null)
    const [error, setError] = useState("")
    const [selectedEvent, setSelectedEvent] = useState(null)

    const dayEvents = events.filter(e => new Date(e.date).toDateString() === date.toDateString())
    const dayVacations = vacations.filter(v => {
        const start = new Date(v.startDate)
        const end = new Date(v.endDate)
        return date >= start && date <= end
    })

    const handleDeleteEvent = async (eventId) => {
        try {
            setDeleteLoading(`event-${eventId}`)
            await deleteEvent(eventId)
            onEventDeleted(eventId)
        } catch (err) {
            setError("Ошибка удаления события")
            console.error(err)
        } finally {
            setDeleteLoading(null)
        }
    }

    const handleDeleteVacation = async (vacationId) => {
        try {
            setDeleteLoading(`vacation-${vacationId}`)
            await deleteVacationSchedule(vacationId)
            onVacationDeleted(vacationId)
        } catch (err) {
            setError("Ошибка удаления расписания")
            console.error(err)
        } finally {
            setDeleteLoading(null)
        }
    }

    return (
        <div style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            padding: "20px"
        }}>
            <div style={{
                background: "var(--white)",
                borderRadius: "12px",
                padding: "28px",
                maxWidth: "600px",
                width: "100%",
                maxHeight: "80vh",
                overflowY: "auto",
                boxShadow: "var(--shadow)"
            }}>
                {/* Header */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                    paddingBottom: "16px",
                    borderBottom: "2px solid var(--border)"
                }}>
                    <h2 style={{ margin: 0, color: "var(--primary)", fontSize: "20px" }}>
                        📅 {formatDate(date)}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: "none",
                            border: "none",
                            fontSize: "24px",
                            cursor: "pointer",
                            color: "var(--text-secondary)"
                        }}
                    >
                        ✕
                    </button>
                </div>

                {error && (
                    <div style={{
                        padding: "12px",
                        background: "#fee2e2",
                        border: "1px solid #fca5a5",
                        borderRadius: "8px",
                        color: "#ef4444",
                        marginBottom: "16px",
                        fontSize: "14px"
                    }}>
                        {error}
                    </div>
                )}

                {/* Events Section */}
                <div style={{ marginBottom: "24px" }}>
                    <h3 style={{ margin: "0 0 12px 0", color: "var(--text)", fontSize: "16px", fontWeight: "600" }}>
                        📍 События ({dayEvents.length})
                    </h3>
                    {dayEvents.length === 0 ? (
                        <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "14px" }}>
                            Нет событий на этот день
                        </p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            {dayEvents.map(event => (
                                <div
                                    key={event.id}
                                    onClick={() => setSelectedEvent(event)}
                                    style={{
                                        background: "var(--bg-secondary)",
                                        padding: "12px",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                        opacity: 1,
                                        border: "1px solid var(--border)"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "var(--hover)"
                                        e.currentTarget.style.transform = "translateY(-2px)"
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "var(--bg-secondary)"
                                        e.currentTarget.style.transform = "translateY(0)"
                                    }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px",
                                                marginBottom: "4px"
                                            }}>
                                                {event.createdByAvatarPath ? (
                                                    <img
                                                        src={getAvatarUrl(event.createdByAvatarPath)}
                                                        alt={event.createdByEmail}
                                                        style={{
                                                            width: "24px",
                                                            height: "24px",
                                                            borderRadius: "50%",
                                                            border: "2px solid var(--primary)",
                                                            objectFit: "cover"
                                                        }}
                                                    />
                                                ) : (
                                                    <div style={{
                                                        width: "24px",
                                                        height: "24px",
                                                        borderRadius: "50%",
                                                        background: "var(--primary)",
                                                        color: "white",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontSize: "12px",
                                                        fontWeight: "600"
                                                    }}>
                                                        {event.createdByEmail?.[0]?.toUpperCase() || "?"}
                                                    </div>
                                                )}
                                                <strong style={{ color: "var(--text)", fontSize: "14px" }}>
                                                    {event.title}
                                                </strong>
                                            </div>
                                            {event.description && (
                                                <p style={{
                                                    margin: "4px 0 8px 32px",
                                                    color: "var(--text-secondary)",
                                                    fontSize: "13px",
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden"
                                                }}>
                                                    {event.description}
                                                </p>
                                            )}
                                            {getImageUrl(event) && (
                                                <div style={{ marginLeft: "32px", marginTop: "8px" }}>
                                                    <img
                                                        src={getImageUrl(event)}
                                                        alt={event.title}
                                                        style={{
                                                            maxWidth: "100%",
                                                            maxHeight: "80px",
                                                            borderRadius: "6px",
                                                            objectFit: "cover"
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDeleteEvent(event.id)
                                            }}
                                            disabled={deleteLoading === `event-${event.id}`}
                                            style={{
                                                background: "#fee2e2",
                                                border: "1px solid #fca5a5",
                                                color: "#dc2626",
                                                padding: "4px 8px",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                                fontSize: "12px",
                                                marginLeft: "8px",
                                                opacity: deleteLoading === `event-${event.id}` ? 0.6 : 1,
                                                flexShrink: 0
                                            }}
                                        >
                                            {deleteLoading === `event-${event.id}` ? "..." : "✕"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Vacation Section */}
                <div style={{ marginBottom: "24px" }}>
                    <h3 style={{ margin: "0 0 12px 0", color: "var(--text)", fontSize: "16px", fontWeight: "600" }}>
                        🌴 Отпуска ({dayVacations.length})
                    </h3>
                    {dayVacations.length === 0 ? (
                        <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "14px" }}>
                            Нет отпусков на этот день
                        </p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            {dayVacations.map(vacation => (
                                <div
                                    key={vacation.id}
                                    style={{
                                        background: "var(--bg-secondary)",
                                        padding: "12px",
                                        borderRadius: "8px",
                                        border: "1px solid var(--border)"
                                    }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                                            {vacation.createdByAvatarPath ? (
                                                <img
                                                    src={getAvatarUrl(vacation.createdByAvatarPath)}
                                                    alt={vacation.createdByEmail}
                                                    style={{
                                                        width: "28px",
                                                        height: "28px",
                                                        borderRadius: "50%",
                                                        border: "3px solid #f59e0b",
                                                        objectFit: "cover"
                                                    }}
                                                />
                                            ) : (
                                                <div style={{
                                                    width: "28px",
                                                    height: "28px",
                                                    borderRadius: "50%",
                                                    background: "#f59e0b",
                                                    color: "white",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: "13px",
                                                    fontWeight: "600",
                                                    border: "3px solid #f59e0b"
                                                }}>
                                                    {vacation.createdByEmail?.[0]?.toUpperCase() || "?"}
                                                </div>
                                            )}
                                            <div>
                                                <div style={{ color: "var(--text)", fontSize: "14px", fontWeight: "600" }}>
                                                    {vacation.createdByEmail}
                                                </div>
                                                <div style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
                                                    {new Date(vacation.startDate).toLocaleDateString()} - {new Date(vacation.endDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteVacation(vacation.id)}
                                            disabled={deleteLoading === `vacation-${vacation.id}`}
                                            style={{
                                                background: "#fee2e2",
                                                border: "1px solid #fca5a5",
                                                color: "#dc2626",
                                                padding: "4px 8px",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                                fontSize: "12px",
                                                marginLeft: "8px",
                                                opacity: deleteLoading === `vacation-${vacation.id}` ? 0.6 : 1
                                            }}
                                        >
                                            {deleteLoading === `vacation-${vacation.id}` ? "..." : "✕"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    paddingTop: "16px",
                    borderTop: "2px solid var(--border)"
                }}>
                    <button
                        onClick={onAddEvent}
                        style={{
                            padding: "12px",
                            background: "var(--primary)",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "600",
                            fontSize: "14px"
                        }}
                    >
                        ➕ Событие
                    </button>
                    <button
                        onClick={onAddVacation}
                        style={{
                            padding: "12px",
                            background: "#f59e0b",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "600",
                            fontSize: "14px"
                        }}
                    >
                        🌴 Отпуск
                    </button>
                </div>
            </div>

            {selectedEvent && (
                <EventDetailsModal
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                    onDeleted={(eventId) => {
                        setSelectedEvent(null)
                        onEventDeleted(eventId)
                    }}
                />
            )}
        </div>
    )
}
