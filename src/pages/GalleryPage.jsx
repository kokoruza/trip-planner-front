import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AuthContext } from "../auth/AuthContext"
import { getGalleryByTrip } from "../api/galleryApi"
import GalleryPhotoCard from "../components/GalleryPhotoCard"
import GalleryPhotoModal from "../components/GalleryPhotoModal"
import UploadPhotoModal from "../components/UploadPhotoModal"

export default function GalleryPage() {
    const { tripId } = useParams()
    const navigate = useNavigate()
    const { user } = useContext(AuthContext)
    
    const [photos, setPhotos] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [showUploadModal, setShowUploadModal] = useState(false)
    const [selectedPhoto, setSelectedPhoto] = useState(null)

    useEffect(() => {
        loadPhotos()
    }, [tripId])

    const loadPhotos = async () => {
        try {
            setLoading(true)
            setError("")
            const response = await getGalleryByTrip(tripId)
            setPhotos(response.data || [])
        } catch (err) {
            setError("Ошибка загрузки галереи")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handlePhotoUploaded = (newPhoto) => {
        setPhotos([newPhoto, ...photos])
        setShowUploadModal(false)
    }

    const handlePhotoDeleted = (photoId) => {
        setPhotos(photos.filter(p => p.id !== photoId))
        setSelectedPhoto(null)
    }

    const handlePhotoUpdated = (updatedPhoto) => {
        setPhotos(photos.map(p => p.id === updatedPhoto.id ? updatedPhoto : p))
        setSelectedPhoto(updatedPhoto)
    }

    if (loading) {
        return (
            <div className="page">
                <div style={{ textAlign: "center", padding: "40px" }}>
                    Загрузка галереи...
                </div>
            </div>
        )
    }

    return (
        <div className="page">
            <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
                <div className="page-header" style={{ marginBottom: "24px" }}>
                    <button className="btn-secondary" onClick={() => navigate(-1)}>
                        ← Назад
                    </button>
                    <h1 style={{ margin: "0", flex: 1, textAlign: "center", color: "var(--primary)" }}>
                        🖼️ Галерея
                    </h1>
                    <button 
                        className="btn-primary"
                        onClick={() => setShowUploadModal(true)}
                        style={{ padding: "8px 16px", fontSize: "14px" }}
                    >
                        ➕ Добавить фото
                    </button>
                </div>

                {error && (
                    <div style={{
                        padding: "12px",
                        background: "#fee2e2",
                        border: "1px solid #fca5a5",
                        borderRadius: "8px",
                        color: "#ef4444",
                        marginBottom: "16px"
                    }}>
                        {error}
                    </div>
                )}

                {photos.length === 0 ? (
                    <div className="empty-message" style={{ textAlign: "center", padding: "40px" }}>
                        📭 Галерея пуста
                    </div>
                ) : (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                        gap: "16px"
                    }}>
                        {photos.map(photo => (
                            <GalleryPhotoCard 
                                key={photo.id} 
                                photo={photo}
                                onPhotoUpdated={handlePhotoUpdated}
                                onPhotoDeleted={handlePhotoDeleted}
                                onPhotoClick={setSelectedPhoto}
                            />
                        ))}
                    </div>
                )}

                {showUploadModal && (
                    <UploadPhotoModal 
                        tripId={tripId}
                        onClose={() => setShowUploadModal(false)}
                        onPhotoUploaded={handlePhotoUploaded}
                    />
                )}

                {selectedPhoto && (
                    <GalleryPhotoModal 
                        photo={selectedPhoto}
                        onClose={() => setSelectedPhoto(null)}
                        onPhotoUpdated={handlePhotoUpdated}
                    />
                )}
            </div>
        </div>
    )
}
