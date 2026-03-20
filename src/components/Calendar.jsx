import { useState, useEffect } from "react"
import { getMediaUrl } from "../api/axios"

export default function Calendar({ events = [], vacationSchedules = [], onDaySelect }) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth <= 768 : false)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    }

    const getCurrentMonthDays = () => {
        const daysInMonth = getDaysInMonth(currentDate)
        const firstDay = getFirstDayOfMonth(currentDate)
        const days = []

        for (let i = 0; i < firstDay; i++) {
            days.push(null)
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i))
        }

        return days
    }

    const getEventsForDate = (date) => {
        if (!date) return []
        return events.filter(event => {
            const eventDate = new Date(event.date)
            return eventDate.toDateString() === date.toDateString()
        })
    }

    const getVacationsForDate = (date) => {
        if (!date) return []
        return vacationSchedules.filter(vacation => {
            const startDate = new Date(vacation.startDate)
            const endDate = new Date(vacation.endDate)
            return date >= startDate && date <= endDate
        })
    }

    const formatMonthYear = (date) => {
        const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
                       "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]
        return `${months[date.getMonth()]} ${date.getFullYear()}`
    }

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
    }

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
    }

    const getAvatarUrl = (avatarPath) => {
        return getMediaUrl(avatarPath)
    }

    const days = getCurrentMonthDays()
    const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]

    return (
        <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
            {/* Header - NOT scrollable */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
                gap: "12px",
                flexWrap: "wrap",
                position: isMobile ? "sticky" : "relative",
                top: 0,
                zIndex: isMobile ? "5" : "auto",
                background: isMobile ? "var(--white)" : "transparent",
                paddingBottom: isMobile ? "12px" : "0",
                borderBottom: isMobile ? "1px solid var(--border)" : "none",
                flexShrink: 0
            }}>
                <button
                    onClick={prevMonth}
                    style={{
                        background: "var(--primary)",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        width: "clamp(32px, 8vw, 40px)",
                        height: "clamp(32px, 8vw, 40px)",
                        cursor: "pointer",
                        fontSize: "clamp(14px, 4vw, 18px)",
                        fontWeight: "600",
                        transition: "all 0.2s",
                        flexShrink: 0
                    }}
                    onMouseOver={e => e.target.style.background = "var(--primary-dark)"}
                    onMouseOut={e => e.target.style.background = "var(--primary)"}
                    onTouchStart={e => e.target.style.background = "var(--primary-dark)"}
                    onTouchEnd={e => e.target.style.background = "var(--primary)"}
                >
                    ←
                </button>
                <h2 style={{
                    margin: 0,
                    color: "var(--primary)",
                    fontSize: "clamp(16px, 5vw, 22px)",
                    fontWeight: "700",
                    textAlign: "center",
                    flex: "1 1 auto",
                    minWidth: "120px",
                    whiteSpace: "nowrap"
                }}>
                    {formatMonthYear(currentDate)}
                </h2>
                <button
                    onClick={nextMonth}
                    style={{
                        background: "var(--primary)",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        width: "clamp(32px, 8vw, 40px)",
                        height: "clamp(32px, 8vw, 40px)",
                        cursor: "pointer",
                        fontSize: "clamp(14px, 4vw, 18px)",
                        fontWeight: "600",
                        transition: "all 0.2s",
                        flexShrink: 0
                    }}
                    onMouseOver={e => e.target.style.background = "var(--primary-dark)"}
                    onMouseOut={e => e.target.style.background = "var(--primary)"}
                    onTouchStart={e => e.target.style.background = "var(--primary-dark)"}
                    onTouchEnd={e => e.target.style.background = "var(--primary)"}
                >
                    →
                </button>
            </div>

            {/* Calendar Grid Container - Scrollable */}
            <div style={{ width: "100%", overflowX: "auto" }}>
                {/* Calendar Grid */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, minmax(60px, 1fr))",
                    gap: "clamp(4px, 2vw, 8px)",
                    minWidth: "100%"
                }}>
                {/* Weekday Headers */}
                {weekDays.map(day => (
                    <div
                        key={day}
                        style={{
                            padding: "clamp(8px, 2vw, 12px)",
                            textAlign: "center",
                            fontWeight: "700",
                            color: "var(--primary)",
                            fontSize: "clamp(11px, 2.5vw, 13px)",
                            textTransform: "uppercase"
                        }}
                    >
                        {day}
                    </div>
                ))}

                {/* Calendar Days */}
                {days.map((date, idx) => {
                    const dayEvents = date ? getEventsForDate(date) : []
                    const dayVacations = date ? getVacationsForDate(date) : []
                    const isToday = date && date.toDateString() === new Date().toDateString()
                    const hasEvents = dayEvents.length > 0
                    const hasVacations = dayVacations.length > 0

                    return (
                        <div
                            key={idx}
                            onClick={() => date && onDaySelect(date)}
                            style={{
                                minHeight: "clamp(70px, 18vw, 100px)",
                                padding: "clamp(8px, 2vw, 12px)",
                                background: date ? "var(--white)" : "transparent",
                                border: isToday ? "2px solid var(--primary)" : "1px solid var(--border)",
                                borderRadius: "10px",
                                cursor: date ? "pointer" : "default",
                                transition: "all 0.2s",
                                position: "relative",
                                display: "flex",
                                flexDirection: "column",
                                backgroundColor: date ? (
                                    isToday ? "var(--primary-light-alpha)" : "var(--white)"
                                ) : "transparent"
                            }}
                            onMouseOver={e => {
                                if (date) {
                                    e.currentTarget.style.borderColor = "var(--primary)"
                                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(37, 99, 235, 0.1)"
                                    e.currentTarget.style.transform = "translateY(-2px)"
                                }
                            }}
                            onMouseOut={e => {
                                if (date) {
                                    e.currentTarget.style.borderColor = "var(--border)"
                                    e.currentTarget.style.boxShadow = "none"
                                    e.currentTarget.style.transform = "translateY(0)"
                                }
                            }}
                        >
                            {date && (
                                <>
                                    {/* Day Number */}
                                    <div style={{
                                        fontSize: "clamp(14px, 3vw, 16px)",
                                        fontWeight: "700",
                                        color: isToday ? "var(--primary)" : "var(--text)",
                                        marginBottom: "clamp(4px, 1vw, 8px)"
                                    }}>
                                        {date.getDate()}
                                    </div>

                                    {/* Event Avatars */}
                                    {(hasEvents || hasVacations) && (
                                        <div style={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: "clamp(4px, 1vw, 6px)",
                                            flex: 1,
                                            alignContent: "flex-start"
                                        }}>
                                            {/* Event Avatars (blue border) */}
                                            {dayEvents.slice(0, 2).map(event => (
                                                <div
                                                    key={`event-${event.id}`}
                                                    style={{
                                                        width: "clamp(22px, 5vw, 28px)",
                                                        height: "clamp(22px, 5vw, 28px)",
                                                        borderRadius: "50%",
                                                        border: "2px solid var(--primary)",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontSize: "clamp(9px, 2vw, 11px)",
                                                        fontWeight: "600",
                                                        overflow: "hidden",
                                                        backgroundColor: "var(--bg-secondary)",
                                                        flexShrink: 0
                                                    }}
                                                    title={event.createdByEmail}
                                                >
                                                    {event.createdByAvatarPath ? (
                                                        <img
                                                            src={getAvatarUrl(event.createdByAvatarPath)}
                                                            alt={event.createdByEmail}
                                                            style={{
                                                                width: "100%",
                                                                height: "100%",
                                                                objectFit: "cover",
                                                                display: "block"
                                                            }}
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <span style={{ color: "var(--primary)" }}>
                                                            {event.createdByEmail?.[0]?.toUpperCase() || "?"}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}

                                            {/* Vacation Avatars (orange border) */}
                                            {dayVacations.slice(0, 2).map(vacation => (
                                                <div
                                                    key={`vacation-${vacation.id}`}
                                                    style={{
                                                        width: "clamp(22px, 5vw, 28px)",
                                                        height: "clamp(22px, 5vw, 28px)",
                                                        borderRadius: "50%",
                                                        border: "2px solid #f59e0b",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontSize: "clamp(9px, 2vw, 11px)",
                                                        fontWeight: "600",
                                                        overflow: "hidden",
                                                        backgroundColor: "var(--bg-secondary)",
                                                        flexShrink: 0
                                                    }}
                                                    title={vacation.createdByEmail}
                                                >
                                                    {vacation.createdByAvatarPath ? (
                                                        <img
                                                            src={getAvatarUrl(vacation.createdByAvatarPath)}
                                                            alt={vacation.createdByEmail}
                                                            style={{
                                                                width: "100%",
                                                                height: "100%",
                                                                objectFit: "cover",
                                                                display: "block"
                                                            }}
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <span style={{ color: "#f59e0b" }}>
                                                            {vacation.createdByEmail?.[0]?.toUpperCase() || "?"}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}

                                            {/* Count badge */}
                                            {(dayEvents.length > 2 || dayVacations.length > 2) && (
                                                <div style={{
                                                    fontSize: "clamp(8px, 1.5vw, 10px)",
                                                    fontWeight: "600",
                                                    color: "var(--text-secondary)",
                                                    padding: "clamp(2px, 0.5vw, 4px)"
                                                }}>
                                                    {dayEvents.length + dayVacations.length > 4 && `+${dayEvents.length + dayVacations.length - 4}`}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )
                })}
            </div>
            </div>
        </div>
    )
}
