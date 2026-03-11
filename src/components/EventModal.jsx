import { useState } from "react"
import { createEvent } from "../api/calendarApi"

const getLocalDateString = (date) => {
    if (!date) return ""
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export default function EventModal({ tripId, onClose, onEventCreated, selectedDate = null }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: selectedDate ? getLocalDateString(selectedDate) : "",
        file: null
    })
    const [preview, setPreview] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFormData({ ...formData, file: selectedFile })
            const reader = new FileReader()
            reader.onload = (event) => {
                setPreview(event.target?.result)
            }
            reader.readAsDataURL(selectedFile)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if (!formData.title.trim()) {
            setError("Название события обязательно")
            return
        }

        if (!formData.date) {
            setError("Дата события обязательна")
            return
        }

        try {
            setLoading(true)
            // Create date at noon local time to avoid timezone issues
            const [year, month, day] = formData.date.split('-').map(Number)
            const dateObj = new Date(year, month - 1, day, 12, 0, 0)
            
            const newEvent = await createEvent(tripId, {
                title: formData.title,
                description: formData.description || null,
                date: dateObj.toISOString(),
                file: formData.file
            })

            onEventCreated(newEvent)
            setFormData({
                title: "",
                description: "",
                date: "",
                file: null
            })
            setPreview(null)
            onClose()
        } catch (err) {
            setError(err?.response?.data?.message || "Ошибка создания события")
            console.error(err)
        } finally {
            setLoading(false)
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
            zIndex: 2001,
            padding: "20px"
        }} onClick={() => !loading && onClose()}>
            <div style={{
                background: "var(--white)",
                borderRadius: "12px",
                padding: "28px",
                maxWidth: "500px",
                width: "100%",
                boxShadow: "var(--shadow)"
            }} onClick={e => e.stopPropagation()}>
                <h2 style={{ margin: "0 0 24px 0", color: "var(--primary)", fontSize: "20px" }}>
                    ➕ Новое событие
                </h2>

                {error && (
                    <div style={{
                        color: "#ef4444",
                        padding: "12px",
                        background: "#fee2e2",
                        borderRadius: "8px",
                        fontSize: "14px",
                        marginBottom: "16px",
                        border: "1px solid #fca5a5"
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Title */}
                    <div style={{ marginBottom: "16px" }}>
                        <label style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "var(--text)",
                            marginBottom: "6px"
                        }}>
                            Название события
                        </label>
                        <input
                            type="text"
                            placeholder="Например: Пикник, Экскурсия..."
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            required
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "1px solid var(--border)",
                                borderRadius: "8px",
                                fontSize: "14px",
                                color: "var(--text)",
                                boxSizing: "border-box"
                            }}
                        />
                    </div>

                    {/* Date */}
                    <div style={{ marginBottom: "16px" }}>
                        <label style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "var(--text)",
                            marginBottom: "6px"
                        }}>
                            Дата события
                        </label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                            required
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "1px solid var(--border)",
                                borderRadius: "8px",
                                fontSize: "14px",
                                color: "var(--text)",
                                boxSizing: "border-box",
                                accentColor: "var(--primary)"
                            }}
                        />
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: "16px" }}>
                        <label style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "var(--text)",
                            marginBottom: "6px"
                        }}>
                            Описание (опционально)
                        </label>
                        <textarea
                            placeholder="Напиши подробности события..."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "1px solid var(--border)",
                                borderRadius: "8px",
                                fontSize: "14px",
                                color: "var(--text)",
                                boxSizing: "border-box",
                                minHeight: "80px",
                                fontFamily: "inherit",
                                resize: "vertical"
                            }}
                        />
                    </div>

                    {/* File Upload */}
                    <div style={{ marginBottom: "16px" }}>
                        <label style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "var(--text)",
                            marginBottom: "6px"
                        }}>
                            Фото события (опционально)
                        </label>
                        <label style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "20px",
                            border: "2px dashed var(--border)",
                            borderRadius: "8px",
                            cursor: "pointer",
                            background: "var(--bg-secondary)",
                            transition: "all 0.2s"
                        }}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                disabled={loading}
                                style={{ display: "none" }}
                            />
                            <span style={{
                                color: "var(--text-secondary)",
                                fontSize: "14px",
                                textAlign: "center"
                            }}>
                                📸 Нажми или перетащи фото
                            </span>
                        </label>
                    </div>

                    {/* Preview */}
                    {preview && (
                        <div style={{
                            marginBottom: "16px",
                            textAlign: "center"
                        }}>
                            <img
                                src={preview}
                                alt="Preview"
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: "200px",
                                    borderRadius: "8px",
                                    objectFit: "cover"
                                }}
                            />
                        </div>
                    )}

                    {/* Buttons */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "24px" }}>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                            style={{
                                padding: "12px",
                                fontSize: "14px",
                                opacity: loading ? 0.6 : 1
                            }}
                        >
                            {loading ? "Создание..." : "Создать"}
                        </button>
                        <button
                            type="button"
                            className="btn-secondary"
                            disabled={loading}
                            onClick={onClose}
                            style={{
                                padding: "12px",
                                fontSize: "14px"
                            }}
                        >
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
