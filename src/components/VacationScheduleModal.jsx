import { useState } from "react"
import { createVacationSchedule } from "../api/calendarApi"

const getLocalDateString = (date) => {
    if (!date) return ""
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export default function VacationScheduleModal({ tripId, onClose, onScheduleCreated, selectedDate = null }) {
    const [formData, setFormData] = useState({
        startDate: selectedDate ? getLocalDateString(selectedDate) : "",
        endDate: selectedDate ? getLocalDateString(selectedDate) : ""
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if (!formData.startDate || !formData.endDate) {
            setError("Обе даты обязательны")
            return
        }

        const start = new Date(formData.startDate)
        const end = new Date(formData.endDate)

        if (start > end) {
            setError("Дата начала должна быть раньше даты окончания")
            return
        }

        try {
            setLoading(true)
            const newSchedule = await createVacationSchedule(tripId, {
                startDate: start.toISOString(),
                endDate: end.toISOString()
            })

            onScheduleCreated(newSchedule)
            setFormData({
                startDate: "",
                endDate: ""
            })
            onClose()
        } catch (err) {
            setError(err?.response?.data?.message || "Ошибка создания расписания отпуска")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const getDaysDifference = () => {
        if (!formData.startDate || !formData.endDate) return 0
        const start = new Date(formData.startDate)
        const end = new Date(formData.endDate)
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
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
                    🌴 Мой график отпуска
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
                    {/* Start Date */}
                    <div style={{ marginBottom: "16px" }}>
                        <label style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "var(--text)",
                            marginBottom: "6px"
                        }}>
                            Дата начала отпуска
                        </label>
                        <input
                            type="date"
                            value={formData.startDate}
                            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
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
                                accentColor: "#f59e0b"
                            }}
                        />
                    </div>

                    {/* End Date */}
                    <div style={{ marginBottom: "16px" }}>
                        <label style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "var(--text)",
                            marginBottom: "6px"
                        }}>
                            Дата окончания отпуска
                        </label>
                        <input
                            type="date"
                            value={formData.endDate}
                            onChange={e => setFormData({ ...formData, endDate: e.target.value })}
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
                                accentColor: "#f59e0b"
                            }}
                        />
                    </div>

                    {/* Info Box */}
                    {formData.startDate && formData.endDate && (
                        <div style={{
                            background: "var(--bg-secondary)",
                            padding: "12px",
                            borderRadius: "8px",
                            marginBottom: "16px",
                            border: "1px solid var(--border)"
                        }}>
                            <div style={{
                                fontSize: "14px",
                                color: "var(--text)",
                                fontWeight: "600",
                                marginBottom: "4px"
                            }}>
                                📊 Длительность отпуска: {getDaysDifference()} дн.
                            </div>
                            <div style={{
                                fontSize: "13px",
                                color: "var(--text-secondary)"
                            }}>
                                {formData.startDate} — {formData.endDate}
                            </div>
                        </div>
                    )}

                    <p style={{
                        fontSize: "13px",
                        color: "var(--text-secondary)",
                        padding: "12px",
                        background: "var(--bg-secondary)",
                        borderRadius: "8px",
                        margin: "0 0 16px 0"
                    }}>
                        ℹ️ Ваш отпуск будет отмечен оранжевой рамкой. Остальные участники смогут видеть, когда вы отдыхаете.
                    </p>

                    {/* Buttons */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
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
                            {loading ? "Сохранение..." : "Добавить"}
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
