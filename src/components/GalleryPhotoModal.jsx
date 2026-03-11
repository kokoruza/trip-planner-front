import { useState, useContext, useEffect } from "react"
import { AuthContext } from "../auth/AuthContext"
import { likePhoto, unlikePhoto, addComment, deleteComment } from "../api/galleryApi"
import { API_ORIGIN } from "../api/axios"
import UserLink from "./UserLink"

export default function GalleryPhotoModal({ photo, onClose, onPhotoUpdated }) {
    const { user } = useContext(AuthContext)
    const [commentText, setCommentText] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth <= 768 : false)
    const currentUserId = localStorage.getItem("accountId")
    const isCreator = photo.uploadedById === currentUserId

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        
        // Prevent background scroll when modal is open
        document.body.style.overflow = "hidden"
        
        window.addEventListener("resize", handleResize)
        return () => {
            window.removeEventListener("resize", handleResize)
            document.body.style.overflow = "unset"
        }
    }, [])

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
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            background: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "16px"
        }} onClick={onClose}>
            <div 
                className="gallery-photo-modal"
                style={{
                    background: "var(--white)",
                    borderRadius: "12px",
                    overflow: "hidden",
                    maxWidth: "1000px",
                    width: "100%",
                    maxHeight: "95vh",
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    overflowY: "auto",
                    overflowX: "hidden"
                }} 
                onClick={(e) => e.stopPropagation()}
            >
                
                {/* Image section */}
                <div 
                    className="gallery-photo-image"
                    style={{
                        flex: isMobile ? "0 0 auto" : "1",
                        minWidth: 0,
                        background: "var(--bg)",
                        padding: "16px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        width: isMobile ? "100%" : "auto"
                    }}>
                    <img
                        src={`${API_ORIGIN}${photo.imagePath}`}
                        alt={photo.title}
                        style={{
                            maxWidth: "100%",
                            maxHeight: isMobile ? "auto" : "calc(95vh - 32px)",
                            objectFit: "contain",
                            borderRadius: "8px"
                        }}
                    />
                </div>

                {/* Comments section */}
                <div 
                    className="gallery-photo-comments"
                    style={{
                        width: isMobile ? "100%" : "380px",
                        maxHeight: isMobile ? "auto" : "95vh",
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        borderLeft: isMobile ? "none" : "1px solid var(--border)",
                        borderTop: isMobile ? "1px solid var(--border)" : "none",
                        background: "var(--white)",
                        position: "relative"
                    }}>
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        style={{
                            position: "absolute",
                            top: "12px",
                            right: "12px",
                            background: "var(--primary)",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "36px",
                            height: "36px",
                            cursor: "pointer",
                            fontSize: "20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 10
                        }}
                    >
                        ✕
                    </button>

                    {/* Title */}
                    <h2 style={{ margin: "0 0 8px 0", fontSize: "18px", color: "var(--primary)", paddingRight: "40px" }}>
                        {photo.title}
                    </h2>

                    {/* User Info */}
                    <div style={{ marginBottom: "12px" }}>
                        <UserLink
                            accountId={photo.uploadedById}
                            name={photo.uploadedByName}
                            avatar={photo.uploadedByAvatar}
                            size="md"
                            showName={true}
                        />
                        <div style={{ fontSize: "12px", color: "var(--text-light)", marginTop: "4px" }}>
                            {new Date(photo.createdAt).toLocaleDateString("ru-RU", { 
                                year: "numeric", 
                                month: "long", 
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                            })}
                        </div>
                    </div>

                    {/* Description */}
                    {photo.description && (
                        <p style={{ 
                            margin: "12px 0", 
                            fontSize: "14px", 
                            color: "var(--text)",
                            lineHeight: "1.5",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word"
                        }}>
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
                            fontSize: "16px",
                            padding: "8px 0 12px 0",
                            color: "var(--text)",
                            marginBottom: "12px",
                            paddingBottom: "12px",
                            borderBottom: "1px solid var(--border)"
                        }}
                    >
                        {photo.userLiked ? "❤️" : "🤍"}
                        <span style={{ fontSize: "13px", fontWeight: "600" }}>{photo.likeCount} нравится</span>
                    </button>

                    {/* Comments header */}
                    <div style={{
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "var(--primary)",
                        marginBottom: "12px"
                    }}>
                        💬 Комментарии ({photo.comments.length})
                    </div>

                    {/* Comments list */}
                    <div style={{ flex: 1, overflowY: "auto", marginBottom: "16px", paddingRight: "4px" }}>
                        {photo.comments.length === 0 ? (
                            <div style={{ fontSize: "13px", color: "var(--text-light)", textAlign: "center", padding: "24px 0" }}>
                                Нет комментариев
                            </div>
                        ) : (
                            photo.comments.map((comment) => (
                                <div key={comment.id} style={{
                                    padding: "10px",
                                    background: "var(--bg-secondary)",
                                    borderRadius: "8px",
                                    marginBottom: "10px",
                                    fontSize: "13px"
                                }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                                        <div style={{ flex: 1 }}>
                                            <UserLink
                                                accountId={comment.commentedById}
                                                name={comment.commentedByName}
                                                avatar={comment.commentedByAvatar}
                                                size="sm"
                                                showName={true}
                                            />
                                            <div style={{ fontSize: "11px", color: "var(--text-light)", marginTop: "2px" }}>
                                                {new Date(comment.createdAt).toLocaleDateString("ru-RU")}
                                            </div>
                                        </div>
                                        {comment.commentedById === currentUserId && (
                                            <button
                                                onClick={() => handleDeleteComment(comment.id)}
                                                style={{
                                                    border: "none",
                                                    background: "transparent",
                                                    cursor: "pointer",
                                                    color: "#ef4444",
                                                    fontSize: "14px",
                                                    padding: "0 4px",
                                                    marginLeft: "8px"
                                                }}
                                                title="Удалить комментарий"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                    <div style={{ 
                                        color: "var(--text)", 
                                        wordBreak: "break-word",
                                        lineHeight: "1.4",
                                        whiteSpace: "pre-wrap"
                                    }}>
                                        {comment.text}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Error message */}
                    {error && (
                        <div style={{
                            fontSize: "12px",
                            color: "#ef4444",
                            marginBottom: "12px",
                            background: "#fee2e2",
                            padding: "8px",
                            borderRadius: "6px",
                            border: "1px solid #fca5a5"
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Add Comment Form */}
                    <form onSubmit={handleAddComment} style={{ display: "flex", gap: "8px" }}>
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Напиши комментарий..."
                            style={{
                                flex: 1,
                                padding: "10px 12px",
                                border: "1px solid var(--border)",
                                borderRadius: "8px",
                                fontSize: "13px",
                                background: "var(--bg)",
                                color: "var(--text)",
                                boxSizing: "border-box"
                            }}
                        />
                        <button
                            type="submit"
                            disabled={loading || !commentText.trim()}
                            style={{
                                padding: "10px 12px",
                                fontSize: "14px",
                                background: loading || !commentText.trim() ? "var(--border)" : "var(--primary)",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                cursor: loading || !commentText.trim() ? "not-allowed" : "pointer",
                                fontWeight: "600"
                            }}
                        >
                            {loading ? "..." : "✓"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
