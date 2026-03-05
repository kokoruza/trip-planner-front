import { useState } from "react"
import { createPoll, uploadPollImage } from "../api/pollApi"

export default function CreatePollModal({ tripId, onClose, onPollCreated }) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [options, setOptions] = useState(["", ""])
    const [isAnonymous, setIsAnonymous] = useState(false)
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleAddOption = () => {
        setOptions([...options, ""])
    }

    const handleRemoveOption = (index) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index))
        }
    }

    const handleOptionChange = (index, value) => {
        const newOptions = [...options]
        newOptions[index] = value
        setOptions(newOptions)
    }

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files || [])
        setImages([...images, ...files.map(f => ({ file: f, caption: "" }))])
    }

    const handleRemoveImage = (index) => {
        setImages(images.filter((_, i) => i !== index))
    }

    const handleImageCaptionChange = (index, caption) => {
        const newImages = [...images]
        newImages[index].caption = caption
        setImages(newImages)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!title.trim()) {
            setError("Вопрос не может быть пустым")
            return
        }

        const validOptions = options.filter(opt => opt.trim())
        if (validOptions.length < 2) {
            setError("Нужно минимум 2 варианта ответа")
            return
        }

        try {
            setLoading(true)
            setError("")

            // Create poll
            const response = await createPoll(tripId, {
                title: title.trim(),
                description: description.trim() || null,
                options: validOptions,
                isAnonymous
            })

            const newPoll = response.data

            // Upload images
            for (let i = 0; i < images.length; i++) {
                try {
                    await uploadPollImage(newPoll.id, images[i].file, images[i].caption || null)
                } catch (err) {
                    console.error("Ошибка загрузки изображения:", err)
                }
            }

            onPollCreated(newPoll)
            setTitle("")
            setDescription("")
            setOptions(["", ""])
            setIsAnonymous(false)
            setImages([])
            onClose()
        } catch (err) {
            setError(err?.response?.data?.message || "Ошибка при создании голосования")
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
            zIndex: 2000,
            padding: "20px"
        }}>
            <div style={{
                background: "var(--white)",
                borderRadius: "12px",
                padding: "24px",
                maxWidth: "600px",
                width: "100%",
                maxHeight: "90vh",
                overflow: "auto",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)"
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h2 style={{ margin: "0", color: "var(--primary)" }}>🗳️ Новое голосование</h2>
                    <button
                        onClick={onClose}
                        style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            fontSize: "20px"
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

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {/* Title */}
                    <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px", color: "var(--text-light)" }}>
                            Вопрос *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Задайте ваш вопрос..."
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "1px solid var(--border)",
                                borderRadius: "8px",
                                fontSize: "14px",
                                background: "var(--bg)"
                            }}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px", color: "var(--text-light)" }}>
                            Описание
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Добавьте описание (опционально)..."
                            rows="3"
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "1px solid var(--border)",
                                borderRadius: "8px",
                                fontSize: "14px",
                                background: "var(--bg)",
                                fontFamily: "inherit",
                                resize: "vertical"
                            }}
                        />
                    </div>

                    {/* Options */}
                    <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "8px", color: "var(--text-light)" }}>
                            Варианты ответов *
                        </label>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {options.map((option, index) => (
                                <div key={index} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                    <span style={{ fontSize: "12px", minWidth: "20px", color: "var(--text-light)" }}>
                                        {index + 1}.
                                    </span>
                                    <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                        placeholder={`Вариант ${index + 1}`}
                                        style={{
                                            flex: 1,
                                            padding: "8px",
                                            border: "1px solid var(--border)",
                                            borderRadius: "6px",
                                            fontSize: "14px",
                                            background: "var(--bg)"
                                        }}
                                    />
                                    {options.length > 2 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveOption(index)}
                                            style={{
                                                border: "none",
                                                background: "transparent",
                                                cursor: "pointer",
                                                color: "#ef4444",
                                                fontSize: "16px"
                                            }}
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={handleAddOption}
                            className="btn-ghost"
                            style={{ fontSize: "12px", padding: "6px 12px", marginTop: "8px" }}
                        >
                            ➕ Добавить вариант
                        </button>
                    </div>

                    {/* Anonymous */}
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                        <input
                            type="checkbox"
                            checked={isAnonymous}
                            onChange={(e) => setIsAnonymous(e.target.checked)}
                            style={{ cursor: "pointer" }}
                        />
                        <span style={{ fontSize: "14px" }}>🔒 Анонимное голосование</span>
                    </label>

                    {/* Images */}
                    <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "8px", color: "var(--text-light)" }}>
                            Изображения
                        </label>
                        {images.length > 0 && (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px", marginBottom: "12px" }}>
                                {images.map((img, index) => (
                                    <div key={index} style={{ position: "relative" }}>
                                        <img
                                            src={URL.createObjectURL(img.file)}
                                            alt="Preview"
                                            style={{
                                                width: "100%",
                                                height: "80px",
                                                objectFit: "cover",
                                                borderRadius: "6px"
                                            }}
                                        />
                                        <input
                                            type="text"
                                            value={img.caption}
                                            onChange={(e) => handleImageCaptionChange(index, e.target.value)}
                                            placeholder="Подпись"
                                            style={{
                                                width: "100%",
                                                padding: "4px",
                                                fontSize: "11px",
                                                border: "none",
                                                borderRadius: "4px",
                                                marginTop: "4px"
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            style={{
                                                position: "absolute",
                                                top: "2px",
                                                right: "2px",
                                                background: "rgba(0, 0, 0, 0.6)",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "50%",
                                                width: "20px",
                                                height: "20px",
                                                cursor: "pointer",
                                                fontSize: "12px"
                                            }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <label style={{
                            display: "inline-block",
                            padding: "8px 12px",
                            background: "var(--hover)",
                            border: "1px solid var(--border)",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "12px"
                        }}>
                            📷 Добавить изображение
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageSelect}
                                style={{ display: "none" }}
                            />
                        </label>
                    </div>

                    {/* Buttons */}
                    <div style={{ display: "flex", gap: "12px" }}>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary"
                            style={{ flex: 1 }}
                        >
                            {loading ? "Создание..." : "Создать"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="btn-secondary"
                            style={{ flex: 1 }}
                        >
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
