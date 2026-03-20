import { useContext } from "react"
import { AuthContext } from "../auth/AuthContext"
import { deleteGalleryPhoto, likePhoto, unlikePhoto } from "../api/galleryApi"
import { getMediaUrl } from "../api/axios"
import UserLink from "./UserLink"

export default function GalleryPhotoCard({ photo, onPhotoUpdated, onPhotoDeleted, onPhotoClick }) {
    const { user } = useContext(AuthContext)
    const currentUserId = localStorage.getItem("accountId")
    const isCreator = photo.uploadedById === currentUserId

    const handleLike = async (e) => {
        e.stopPropagation()
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
            console.error("Ошибка при обновлении лайка", err)
        }
    }


    const handleDelete = async (e) => {
        e.stopPropagation()
        if (!window.confirm("Вы уверены, что хотите удалить это фото?")) return

        try {
            await deleteGalleryPhoto(photo.id)
            onPhotoDeleted(photo.id)
        } catch (err) {
            console.error("Ошибка при удалении фото", err)
        }
    }

    return (
        <div style={{
            background: "var(--white)",
            border: "2px solid var(--primary)",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "var(--shadow)",
            cursor: "pointer",
            transition: "transform 0.2s, box-shadow 0.2s"
        }} 
        onClick={() => onPhotoClick(photo)}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)"
            e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.2)"
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)"
            e.currentTarget.style.boxShadow = "var(--shadow)"
        }}>
            {/* Image */}
            <div style={{
                position: "relative",
                background: "var(--hover)",
                paddingTop: "100%",
                overflow: "hidden"
            }}>
                <img
                    src={getMediaUrl(photo.imagePath)}
                    alt={photo.title}
                    style={{
                        position: "absolute",
                        top: "0",
                        left: "0",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                    }}
                />
            </div>

            {/* Header */}
            <div style={{ padding: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <h3 style={{ margin: "0", color: "var(--primary)", fontSize: "16px", flex: 1 }}>
                        {photo.title}
                    </h3>
                    {isCreator && (
                        <button
                            className="btn-danger"
                            onClick={handleDelete}
                            style={{ padding: "4px 8px", fontSize: "12px" }}
                            title="Удалить фото"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* User Info */}
                <UserLink
                    accountId={photo.uploadedById}
                    name={photo.uploadedByName}
                    avatar={photo.uploadedByAvatar}
                    size="sm"
                    showName={true}
                    style={{ marginBottom: "8px" }}
                />
                <div style={{ fontSize: "12px", color: "var(--text-light)" }}>
                    {new Date(photo.createdAt).toLocaleDateString("ru-RU")}
                </div>

                {/* Description */}
                {photo.description && (
                    <p style={{ margin: "8px 0", fontSize: "13px", color: "var(--text)", lineHeight: "1.4", textOverflow: "ellipsis", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                        {photo.description}
                    </p>
                )}

                {/* Likes and Comments */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    paddingTop: "8px",
                    borderTop: "1px solid var(--border)",
                    fontSize: "12px"
                }}>
                    <button
                        onClick={handleLike}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            fontSize: "16px",
                            padding: "0",
                            color: "var(--text)"
                        }}
                        title={photo.userLiked ? "Убрать лайк" : "Поставить лайк"}
                    >
                        {photo.userLiked ? "❤️" : "🤍"}
                        <span style={{ fontSize: "12px", color: "var(--text-light)" }}>{photo.likeCount}</span>
                    </button>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--text-light)" }}>
                        💬 <span>{photo.comments.length}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
