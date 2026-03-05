import { useState, useContext } from "react"
import { AuthContext } from "../auth/AuthContext"
import { likePhoto, unlikePhoto, addComment, deleteComment } from "../api/galleryApi"
import { API_ORIGIN } from "../api/axios"

export default function GalleryPhotoModal({ photo, onClose, onPhotoUpdated }) {
    const { user } = useContext(AuthContext)
    const [commentText, setCommentText] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const currentUserId = localStorage.getItem("accountId")
    const isCreator = photo.uploadedById === currentUserId

    const handleLike = async () => {
        try {
            if (photo.userLiked) {
                await unlikePhoto(photo.id)
            } else {
                await likePhoto(photo.id)
            }
            const updatedPhoto = {
                ...photo,
                userLiked: !photo.userLiked,
                likeCount: photo.userLiked ? photo.likeCount - 1 : photo.likeCount + 1
            }
            onPhotoUpdated(updatedPhoto)
        } catch (err) {
            setError("Ошибка при обновлении лайка")
            console.error(err)
        }
    }

    const handleAddComment = async (e) => {
        e.preventDefault()

        if (!commentText.trim()) return

        try {
            setLoading(true)
            const response = await addComment(photo.id, commentText.trim())
            const newComment = response.data

            const updatedPhoto = {
                ...photo,
                comments: [newComment, ...photo.comments]
            }
            onPhotoUpdated(updatedPhoto)
            setCommentText("")
        } catch (err) {
            setError("Ошибка при добавлении комментария")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(photo.id, commentId)
            const updatedPhoto = {
                ...photo,
                comments: photo.comments.filter(c => c.id !== commentId)
            }
            onPhotoUpdated(updatedPhoto)
        } catch (err) {
            setError("Ошибка при удалении комментария")
            console.error(err)
        }
    }

    return (
        <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "16px"
        }} onClick={onClose}>
            <div style={{
                background: "var(--white)",
                borderRadius: "12px",
                overflow: "hidden",
                maxWidth: "900px",
                width: "100%",
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "row"
            }} onClick={(e) => e.stopPropagation()}>
                
                {/* Image section */}
                <div style={{
                    flex: 1,
                    minWidth: 0,
                    background: "var(--bg)",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <img
                        src={`${API_ORIGIN}${photo.imagePath}`}
                        alt={photo.title}
                        style={{
                            maxWidth: "100%",
                            maxHeight: "calc(90vh - 32px)",
                            objectFit: "contain",
                            borderRadius: "8px"
                        }}
                    />
                </div>

                {/* Comments section */}
                <div style={{
                    width: "320px",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    borderLeft: "1px solid var(--border)",
                    background: "var(--white)",
                    overflowY: "auto"
                }}>
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        style={{
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            background: "var(--primary)",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "32px",
                            height: "32px",
                            cursor: "pointer",
                            fontSize: "18px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        ✕
                    </button>

                    {/* Title */}
                    <h2 style={{ margin: "0 0 4px 0", fontSize: "16px", color: "var(--primary)" }}>
                        {photo.title}
                    </h2>

                    {/* User Info */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", fontSize: "12px", color: "var(--text-light)" }}>
                        <div style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            background: "var(--primary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "10px",
                            fontWeight: "600",
                            flexShrink: 0
                        }}>
                            {photo.uploadedByAvatar ? (
                                <img src={`${API_ORIGIN}${photo.uploadedByAvatar}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                                <span>{photo.uploadedByName?.[0]?.toUpperCase() || "?"}</span>
                            )}
                        </div>
                        <div>
                            <div style={{ fontWeight: "600" }}>{photo.uploadedByName}</div>
                            <div>{new Date(photo.createdAt).toLocaleDateString("ru-RU")}</div>
                        </div>
                    </div>

                    {/* Description */}
                    {photo.description && (
                        <p style={{ margin: "8px 0 12px 0", fontSize: "13px", color: "var(--text)" }}>
                            {photo.description}
                        </p>
                    )}

                    {/* Like button */}
                    <button
                        onClick={handleLike}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            fontSize: "14px",
                            padding: "0 0 12px 0",
                            color: "var(--text)"
                        }}
                    >
                        {photo.userLiked ? "❤️" : "🤍"}
                        <span style={{ fontSize: "12px" }}>{photo.likeCount}</span>
                    </button>

                    {/* Comments header */}
                    <div style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "var(--primary)",
                        marginBottom: "12px",
                        paddingBottom: "8px",
                        borderBottom: "1px solid var(--border)"
                    }}>
                        💬 Комментарии ({photo.comments.length})
                    </div>

                    {/* Comments list */}
                    <div style={{ flex: 1, overflowY: "auto", marginBottom: "12px" }}>
                        {photo.comments.length === 0 ? (
                            <div style={{ fontSize: "12px", color: "var(--text-light)", textAlign: "center", padding: "16px 0" }}>
                                Нет комментариев
                            </div>
                        ) : (
                            photo.comments.map((comment) => (
                                <div key={comment.id} style={{
                                    padding: "8px",
                                    background: "var(--bg)",
                                    borderRadius: "6px",
                                    marginBottom: "8px",
                                    fontSize: "12px"
                                }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                                        <div style={{ fontWeight: "600", color: "var(--primary)" }}>
                                            {comment.authorName}
                                        </div>
                                        {comment.authorId === currentUserId && (
                                            <button
                                                onClick={() => handleDeleteComment(comment.id)}
                                                style={{
                                                    border: "none",
                                                    background: "transparent",
                                                    cursor: "pointer",
                                                    color: "#ef4444",
                                                    fontSize: "12px",
                                                    padding: "0"
                                                }}
                                                title="Удалить комментарий"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                    <div style={{ color: "var(--text)", wordBreak: "break-word" }}>
                                        {comment.text}
                                    </div>
                                    <div style={{ fontSize: "11px", color: "var(--text-light)", marginTop: "4px" }}>
                                        {new Date(comment.createdAt).toLocaleDateString("ru-RU")}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Error message */}
                    {error && (
                        <div style={{
                            fontSize: "11px",
                            color: "#ef4444",
                            marginBottom: "8px",
                            background: "#fee2e2",
                            padding: "6px",
                            borderRadius: "4px"
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Add Comment Form */}
                    <form onSubmit={handleAddComment} style={{ display: "flex", gap: "6px" }}>
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Комментарий..."
                            style={{
                                flex: 1,
                                padding: "6px 8px",
                                border: "1px solid var(--border)",
                                borderRadius: "6px",
                                fontSize: "12px",
                                background: "var(--bg)"
                            }}
                        />
                        <button
                            type="submit"
                            disabled={loading || !commentText.trim()}
                            className="btn-primary"
                            style={{ padding: "6px 10px", fontSize: "12px" }}
                        >
                            ✓
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
