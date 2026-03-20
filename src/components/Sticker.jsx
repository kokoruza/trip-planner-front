import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { updateCard, deleteCard } from "../api/boardApi"
import { getMediaUrl } from "../api/axios"

const PREDEFINED_COLORS = [
    "#fff9c4", // Yellow
    "#ffccbc", // Orange
    "#ffcccc", // Red
    "#f0f4c3", // Light green
    "#c8e6c9", // Green
    "#b3e5fc", // Light blue
    "#bbdefb", // Blue
    "#f8bbd0", // Pink
    "#e1bee7", // Purple
]

export default function Sticker({ card, onUpdate, onDelete, isDragging, onDragStart }) {
    const navigate = useNavigate()
    const [isEditing, setIsEditing] = useState(false)
    const [editText, setEditText] = useState(card.text)
    const [editColor, setEditColor] = useState(card.color || "#fff9c4")
    const [showColorPicker, setShowColorPicker] = useState(false)
    const [error, setError] = useState("")
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        if (!editText.trim()) {
            setError("Текст карточки не может быть пусто")
            return
        }

        try {
            setIsSaving(true)
            await updateCard(card.id, {
                text: editText,
                color: editColor,
                positionX: card.positionX,
                positionY: card.positionY
            })
            onUpdate({
                ...card,
                text: editText,
                color: editColor
            })
            setIsEditing(false)
            setError("")
        } catch (err) {
            setError(err?.response?.data?.message || "Ошибка при сохранении карточки")
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!window.confirm("Вы уверены, что хотите удалить эту карточку?")) return

        try {
            await deleteCard(card.id)
            onDelete(card.id)
        } catch (err) {
            setError(err?.response?.data?.message || "Ошибка при удалении карточки. Может быть, это сделал не вы?")
        }
    }

    const handleCancel = () => {
        setEditText(card.text)
        setEditColor(card.color || "#fff9c4")
        setIsEditing(false)
        setError("")
    }

    const ownerAvatarUrl = getMediaUrl(card.ownerAvatarPath)

    if (isEditing) {
        // Mobile modal for editing
        const isMobile = window.innerWidth <= 768

        if (isMobile) {
            return (
                <>
                    <div
                        className={`sticker ${isDragging ? 'dragging' : ''}`}
                        style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            transform: `translate(${card.positionX}px, ${card.positionY}px)`,
                            background: card.color || "#fff9c4",
                            cursor: "grab",
                            zIndex: 10,
                            opacity: 0.5,
                            pointerEvents: "none"
                        }}
                    >
                        <div className="sticker-content">{card.text}</div>
                    </div>

                    <div
                        style={{
                            position: "fixed",
                            inset: 0,
                            background: "rgba(0, 0, 0, 0.5)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 2000,
                            padding: "16px",
                            touchAction: "none",
                            overscrollBehavior: "contain"
                        }}
                        onClick={handleCancel}
                    >
                        <div
                            style={{
                                background: editColor,
                                borderRadius: "12px",
                                padding: "20px",
                                maxWidth: "90vw",
                                width: "100%",
                                maxHeight: "90vh",
                                display: "flex",
                                flexDirection: "column",
                                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)"
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                            <h2 style={{
                                margin: "0 0 16px 0",
                                fontSize: "18px",
                                fontWeight: "700",
                                color: "var(--text)"
                            }}>
                                Редактирование карточки
                            </h2>

                            <textarea
                                value={editText}
                                onChange={e => setEditText(e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: "16px",
                                    fontSize: "16px",
                                    fontFamily: "inherit",
                                    border: "2px solid var(--primary)",
                                    borderRadius: "8px",
                                    marginBottom: "16px",
                                    resize: "none",
                                    minHeight: "200px"
                                }}
                                autoFocus
                            />

                            {error && (
                                <div style={{
                                    padding: "12px",
                                    background: "#fee2e2",
                                    border: "1px solid #fca5a5",
                                    borderRadius: "8px",
                                    color: "#ef4444",
                                    fontSize: "13px",
                                    marginBottom: "16px"
                                }}>
                                    {error}
                                </div>
                            )}

                            {/* Color Picker */}
                            <div style={{ marginBottom: "16px" }}>
                                <div style={{ fontSize: "12px", fontWeight: "600", marginBottom: "8px", color: "var(--text)" }}>
                                    Выберите цвет:
                                </div>
                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(5, 1fr)",
                                    gap: "8px"
                                }}>
                                    {PREDEFINED_COLORS.map(color => (
                                        <button
                                            key={color}
                                            style={{
                                                background: color,
                                                border: editColor === color ? "4px solid var(--primary)" : "2px solid var(--border)",
                                                borderRadius: "8px",
                                                height: "50px",
                                                cursor: "pointer",
                                                transition: "all 0.2s"
                                            }}
                                            onClick={() => setEditColor(color)}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Buttons */}
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "12px"
                            }}>
                                <button
                                    style={{
                                        padding: "14px",
                                        fontSize: "16px",
                                        fontWeight: "600",
                                        background: "#10b981",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "8px",
                                        cursor: isSaving ? "not-allowed" : "pointer",
                                        opacity: isSaving ? 0.6 : 1
                                    }}
                                    onClick={handleSave}
                                    disabled={isSaving}
                                >
                                    {isSaving ? "Сохранение..." : "✓ Сохранить"}
                                </button>
                                <button
                                    style={{
                                        padding: "14px",
                                        fontSize: "16px",
                                        fontWeight: "600",
                                        background: "#ef4444",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "8px",
                                        cursor: isSaving ? "not-allowed" : "pointer",
                                        opacity: isSaving ? 0.6 : 1
                                    }}
                                    onClick={handleCancel}
                                    disabled={isSaving}
                                >
                                    ✕ Отмена
                                </button>
                            </div>

                            <button
                                style={{
                                    marginTop: "12px",
                                    padding: "12px",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    background: "#fee2e2",
                                    color: "#dc2626",
                                    border: "1px solid #fca5a5",
                                    borderRadius: "8px",
                                    cursor: "pointer"
                                }}
                                onClick={handleDelete}
                            >
                                🗑️ Удалить карточку
                            </button>
                        </div>
                    </div>
                </>
            )
        }

        return (
            <div
                className="sticker sticker-editing"
                style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    transform: `translate(${card.positionX}px, ${card.positionY}px)`,
                    background: editColor,
                    zIndex: 100
                }}
                onClick={e => e.stopPropagation()}
            >
                <textarea
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    className="sticker-textarea"
                    autoFocus
                />

                {error && <div className="sticker-error">{error}</div>}

                <div className="sticker-color-picker">
                    <button
                        className="sticker-color-preview"
                        style={{ background: editColor }}
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        title="Нажмите для выбора цвета"
                    />
                    {showColorPicker && (
                        <div className="sticker-color-palette">
                            {PREDEFINED_COLORS.map(color => (
                                <button
                                    key={color}
                                    className={`sticker-color-option ${editColor === color ? 'active' : ''}`}
                                    style={{ background: color }}
                                    onClick={() => {
                                        setEditColor(color)
                                        setShowColorPicker(false)
                                    }}
                                    title={color}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="sticker-buttons">
                    <button
                        className="btn-sm btn-success"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? "..." : "✓"}
                    </button>
                    <button
                        className="btn-sm btn-cancel"
                        onClick={handleCancel}
                        disabled={isSaving}
                    >
                        ✕
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div
            className={`sticker ${isDragging ? 'dragging' : ''}`}
            style={{
                position: "absolute",
                left: 0,
                top: 0,
                transform: `translate(${card.positionX}px, ${card.positionY}px)`,
                background: card.color || "#fff9c4",
                cursor: isDragging ? "grabbing" : "grab",
                zIndex: isDragging ? 1000 : 10
            }}
            onMouseDown={onDragStart}
            onTouchStart={onDragStart}
            onDoubleClick={() => setIsEditing(true)}
            onContextMenu={(e) => {
                e.preventDefault()
                setIsEditing(true)
            }}
            title="Двойной клик для редактирования, правый клик на мобильных, перетащите для перемещения"
        >
            <div
                className="sticker-owner-badge"
                title={card.ownerAccountName || "Автор"}
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/profile/${card.ownerId}`)
                }}
            >
                {ownerAvatarUrl ? (
                    <img
                        src={ownerAvatarUrl}
                        alt={card.ownerAccountName || "Автор"}
                    />
                ) : (
                    <span className="sticker-owner-initials">
                        {(card.ownerAccountName || "?")[0].toUpperCase()}
                    </span>
                )}
            </div>
            <div className="sticker-content">
                {card.text}
            </div>
            <div className="sticker-menu">
                <button
                    className="sticker-menu-btn sticker-edit"
                    onClick={() => setIsEditing(true)}
                    onTouchStart={(e) => {
                        e.preventDefault()
                        setIsEditing(true)
                    }}
                    title="Редактировать (клик или касание)"
                    style={{
                        minWidth: "32px",
                        minHeight: "32px",
                        fontSize: "16px"
                    }}
                >
                    ✎
                </button>
                <button
                    className="sticker-menu-btn sticker-delete"
                    onClick={handleDelete}
                    onTouchStart={(e) => {
                        e.preventDefault()
                        handleDelete()
                    }}
                    title="Удалить (клик или касание)"
                    style={{
                        minWidth: "32px",
                        minHeight: "32px",
                        fontSize: "16px"
                    }}
                >
                    ✕
                </button>
            </div>
        </div>
    )
}