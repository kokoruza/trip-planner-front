import { useState } from "react"
import { updateCard, deleteCard } from "../api/boardApi"

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

    if (isEditing) {
        return (
            <div
                className="sticker sticker-editing"
                style={{
                    position: "absolute",
                    left: card.positionX,
                    top: card.positionY,
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
                left: `${card.positionX}px`,
                top: `${card.positionY}px`,
                background: card.color || "#fff9c4",
                cursor: isDragging ? "grabbing" : "grab",
                zIndex: isDragging ? 1000 : 10
            }}
            onMouseDown={onDragStart}
            onDoubleClick={() => setIsEditing(true)}
            title="Двойной клик для редактирования, перетащите для перемещения"
        >
            <div className="sticker-content">
                {card.text}
            </div>
            <div className="sticker-menu">
                <button
                    className="sticker-menu-btn sticker-edit"
                    onClick={() => setIsEditing(true)}
                    title="Редактировать"
                >
                    ✎
                </button>
                <button
                    className="sticker-menu-btn sticker-delete"
                    onClick={handleDelete}
                    title="Удалить"
                >
                    ✕
                </button>
            </div>
        </div>
    )
}