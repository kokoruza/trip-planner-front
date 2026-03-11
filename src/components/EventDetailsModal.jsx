import { useState } from "react"
import { deleteEvent } from "../api/calendarApi"
import { API_ORIGIN } from "../api/axios"
import UserLink from "./UserLink"

export default function EventDetailsModal({ event, onClose, onDeleted }) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const getImageUrl = () => {
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

    const imageUrl = getImageUrl()

    const handleDelete = async () => {
        if (!confirm("Вы уверены, что хотите удалить это событие?")) return

        try {
            setLoading(true)
            await deleteEvent(event.id)
            onDeleted(event.id)
            onClose()
        } catch (err) {
            setError("Ошибка удаления события")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2001,
            padding: "16px"
        }} onClick={onClose}>
            <div style={{
                background: "var(--white)",
                borderRadius: "12px",
                overflow: "auto",
                maxWidth: "600px",
                width: "100%",
                maxHeight: "90vh",
                padding: "24px"
            }} onClick={(e) => e.stopPropagation()}>
                
                {/* Header */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "20px",
                    paddingBottom: "16px",
                    borderBottom: "2px solid var(--border)"
                }}>
                    <h2 style={{ margin: 0, color: "var(--primary)", fontSize: "22px", flex: 1 }}>
                        {event.title}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: "none",
                            border: "none",
                            fontSize: "28px",
                            cursor: "pointer",
                            color: "var(--text-secondary)",
                            padding: "0",
                            marginLeft: "12px",
                            width: "32px",
                            height: "32px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
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

                {/* User Info */}
                <div style={{ marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "8px" }}>
                        Организатор:
                    </div>
                    <UserLink
                        accountId={event.createdById}
                        name={event.createdByName || event.createdByEmail || "Пользователь"}
                        avatar={event.createdByAvatarPath}
                        size="md"
                        showName={true}
                    />
                </div>

                {/* Date */}
                <div style={{ marginBottom: "16px" }}>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", fontWeight: "600" }}>
                        📅 Дата события
                    </div>
                    <div style={{ fontSize: "16px", color: "var(--text)" }}>
                        {new Date(event.date).toLocaleDateString("ru-RU")}
                    </div>
                </div>

                {/* Description */}
                {event.description && (
                    <div style={{ marginBottom: "16px" }}>
                        <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", fontWeight: "600" }}>
                            📝 Описание
                        </div>
                        <p style={{ margin: 0, fontSize: "14px", color: "var(--text)", lineHeight: "1.6", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                            {event.description}
                        </p>
                    </div>
                )}

                {/* Image */}
                {imageUrl && (
                    <div style={{ marginBottom: "16px" }}>
                        <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "8px", fontWeight: "600" }}>
                            🖼️ Фотография
                        </div>
                        <img
                            src={imageUrl}
                            alt={event.title}
                            style={{
                                width: "100%",
                                height: "auto",
                                borderRadius: "8px",
                                objectFit: "cover",
                                maxHeight: "400px"
                            }}
                        />
                    </div>
                )}

                {/* Delete button (if user is event creator) */}
                <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "2px solid var(--border)" }}>
                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "12px",
                            background: "#fee2e2",
                            color: "#dc2626",
                            border: "1px solid #fca5a5",
                            borderRadius: "8px",
                            cursor: loading ? "not-allowed" : "pointer",
                            fontSize: "14px",
                            fontWeight: "600",
                            opacity: loading ? 0.6 : 1
                        }}
                    >
                        {loading ? "Удаление..." : "🗑️ Удалить событие"}
                    </button>
                </div>
            </div>
        </div>
    )
}
