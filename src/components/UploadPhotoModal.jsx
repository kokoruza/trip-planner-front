import { useState } from "react"
import { uploadGalleryPhoto } from "../api/galleryApi"

export default function UploadPhotoModal({ tripId, onClose, onPhotoUploaded }) {
    const [file, setFile] = useState(null)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [preview, setPreview] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
            const reader = new FileReader()
            reader.onload = (event) => {
                setPreview(event.target?.result)
            }
            reader.readAsDataURL(selectedFile)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!file) {
            setError("Выберите изображение")
            return
        }

        if (!title.trim()) {
            setError("Введите название фото")
            return
        }

        try {
            setLoading(true)
            setError("")

            const response = await uploadGalleryPhoto(
                tripId,
                file,
                title.trim(),
                description.trim() || null
            )

            onPhotoUploaded(response.data)
            setFile(null)
            setTitle("")
            setDescription("")
            setPreview(null)
            onClose()
        } catch (err) {
            setError(err?.response?.data?.message || "Ошибка при загрузке фото")
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
                maxWidth: "500px",
                width: "100%",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)"
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h2 style={{ margin: "0", color: "var(--primary)" }}>📸 Загрузить фото</h2>
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
                    {/* Image Preview */}
                    {preview ? (
                        <div style={{
                            borderRadius: "8px",
                            overflow: "hidden",
                            background: "var(--hover)"
                        }}>
                            <img
                                src={preview}
                                alt="Preview"
                                style={{ width: "100%", maxHeight: "300px", objectFit: "contain" }}
                            />
                        </div>
                    ) : (
                        <label style={{
                            border: "2px dashed var(--border)",
                            borderRadius: "8px",
                            padding: "40px",
                            textAlign: "center",
                            cursor: "pointer",
                            background: "var(--hover)",
                            transition: "all 0.2s"
                        }}>
                            <div style={{ fontSize: "32px", marginBottom: "8px" }}>📷</div>
                            <div style={{ fontSize: "14px", fontWeight: "500" }}>
                                Нажмите для выбора изображения
                            </div>
                            <div style={{ fontSize: "12px", color: "var(--text-light)", marginTop: "4px" }}>
                                или перетащите сюда
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                style={{ display: "none" }}
                            />
                        </label>
                    )}

                    {/* Change Image Button */}
                    {preview && (
                        <label style={{
                            padding: "8px 12px",
                            background: "var(--hover)",
                            border: "1px solid var(--border)",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "12px",
                            textAlign: "center"
                        }}>
                            🔄 Выбрать другое
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                style={{ display: "none" }}
                            />
                        </label>
                    )}

                    {/* Title */}
                    <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px", color: "var(--text-light)" }}>
                            Название *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Введите название фото..."
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

                    {/* Buttons */}
                    <div style={{ display: "flex", gap: "12px" }}>
                        <button
                            type="submit"
                            disabled={loading || !file}
                            className="btn-primary"
                            style={{ flex: 1 }}
                        >
                            {loading ? "Загрузка..." : "Загрузить"}
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
