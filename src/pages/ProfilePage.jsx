import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AuthContext } from "../auth/AuthContext"
import { getAccount, updateAccount, deleteAccount } from "../api/accountsApi"

export default function ProfilePage() {
    const { accountId } = useParams()
    const navigate = useNavigate()
    const { user: currentUser, logout } = useContext(AuthContext)

    const [profile, setProfile] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const [editForm, setEditForm] = useState({
        accountName: "",
        email: ""
    })

    // Определяем, это свой профиль или чужой
    const isOwnProfile = accountId === currentUser?.id || !accountId

    // Получаем ID профиля для загрузки
    const profileIdToLoad = accountId || currentUser?.id

    console.log("📋 ProfilePage: accountId from route:", accountId)
    console.log("👤 ProfilePage: currentUser:", currentUser)
    console.log("🆔 ProfilePage: profileIdToLoad:", profileIdToLoad)

    useEffect(() => {
        console.log("⚡ ProfilePage useEffect triggered, profileIdToLoad:", profileIdToLoad)
        if (profileIdToLoad) {
            console.log("📥 ProfilePage: Calling loadProfile")
            loadProfile()
        } else {
            console.log("⏹️ ProfilePage: profileIdToLoad is falsy, stopping load")
            setLoading(false)
        }
    }, [profileIdToLoad])

    const loadProfile = async () => {
        if (!profileIdToLoad) return
        setLoading(true)
        setError("")
        try {
            const data = await getAccount(profileIdToLoad)
            setProfile(data)
            setEditForm({
                accountName: data.accountName,
                email: data.email
            })
        } catch (err) {
            setError(err?.response?.data?.message || "Ошибка при загрузке профиля")
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = () => {
        if (!isOwnProfile) return
        setIsEditing(true)
        setError("")
        setSuccess("")
    }

    const handleCancel = () => {
        setIsEditing(false)
        setEditForm({
            accountName: profile.accountName,
            email: profile.email
        })
        setError("")
    }

    const handleSave = async () => {
        if (!editForm.accountName.trim()) {
            setError("Имя аккаунта не может быть пусто")
            return
        }
        if (!editForm.email.trim() || !editForm.email.includes("@")) {
            setError("Введите корректный email")
            return
        }

        setSaving(true)
        setError("")
        setSuccess("")

        try {
            const updated = await updateAccount(profileIdToLoad, editForm)
            setProfile(updated)
            setIsEditing(false)
            setSuccess("Профиль успешно обновлен")
        } catch (err) {
            setError(err?.response?.data?.message || "Ошибка при сохранении профиля")
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!window.confirm("Вы уверены? Эта операция необратима!")) return

        setSaving(true)
        setError("")

        try {
            await deleteAccount(profileIdToLoad)
            if (isOwnProfile) {
                logout()
                navigate("/login")
            } else {
                navigate("/trips")
            }
        } catch (err) {
            setError(err?.response?.data?.message || "Ошибка при удалении аккаунта")
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="page">
                <div style={{ textAlign: "center", padding: "40px", color: "var(--text-light)" }}>
                    Загружается информация о профиле...
                </div>
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="page">
                <div style={{ textAlign: "center", padding: "40px", color: "var(--text)" }}>
                    Профиль не найден
                </div>
            </div>
        )
    }

    return (
        <div className="page">
            <div style={{ maxWidth: "600px", margin: "0 auto" }}>
                <div style={{ marginBottom: "24px" }}>
                    <button
                        className="btn-secondary"
                        onClick={() => navigate(-1)}
                        style={{ marginBottom: "16px" }}
                    >
                        ← Назад
                    </button>
                </div>

                <div style={{
                    background: "var(--white)",
                    border: "2px solid var(--primary)",
                    borderRadius: "12px",
                    padding: "32px",
                    boxShadow: "var(--shadow)"
                }}>
                    <h1 style={{ margin: "0 0 32px 0", color: "var(--primary)", fontSize: "28px" }}>
                        {isOwnProfile ? "Мой профиль" : `Профиль ${profile.accountName}`}
                    </h1>

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

                    {success && (
                        <div style={{
                            padding: "12px",
                            background: "#dcfce7",
                            border: "1px solid #86efac",
                            borderRadius: "8px",
                            color: "#16a34a",
                            marginBottom: "16px",
                            fontSize: "14px"
                        }}>
                            {success}
                        </div>
                    )}

                    {!isEditing ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            <div>
                                <label style={{ display: "block", fontSize: "12px", color: "var(--text-light)", marginBottom: "4px", fontWeight: "600" }}>
                                    Имя аккаунта
                                </label>
                                <div style={{
                                    padding: "12px",
                                    background: "var(--hover)",
                                    borderRadius: "8px",
                                    fontSize: "16px",
                                    color: "var(--text)"
                                }}>
                                    {profile.accountName}
                                </div>
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: "12px", color: "var(--text-light)", marginBottom: "4px", fontWeight: "600" }}>
                                    Почта
                                </label>
                                <div style={{
                                    padding: "12px",
                                    background: "var(--hover)",
                                    borderRadius: "8px",
                                    fontSize: "16px",
                                    color: "var(--text)"
                                }}>
                                    {profile.email}
                                </div>
                            </div>

                            {isOwnProfile && (
                                <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                                    <button
                                        className="btn-primary"
                                        onClick={handleEdit}
                                        style={{ flex: 1 }}
                                    >
                                        ✎ Редактировать
                                    </button>
                                    <button
                                        className="btn-danger"
                                        onClick={handleDelete}
                                        style={{
                                            background: "#ef4444",
                                            color: "var(--white)",
                                            border: "none",
                                            padding: "10px 20px",
                                            borderRadius: "12px",
                                            cursor: "pointer",
                                            fontWeight: "600",
                                            transition: "all 0.3s ease"
                                        }}
                                        onMouseEnter={e => e.target.style.background = "#dc2626"}
                                        onMouseLeave={e => e.target.style.background = "#ef4444"}
                                    >
                                        🗑 Удалить
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            <div>
                                <label style={{ display: "block", fontSize: "12px", color: "var(--text-light)", marginBottom: "4px", fontWeight: "600" }}>
                                    Имя аккаунта
                                </label>
                                <input
                                    type="text"
                                    value={editForm.accountName}
                                    onChange={e => setEditForm({ ...editForm, accountName: e.target.value })}
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        border: "2px solid var(--primary)",
                                        borderRadius: "8px",
                                        fontSize: "16px",
                                        fontFamily: "inherit",
                                        boxSizing: "border-box"
                                    }}
                                    disabled={saving}
                                />
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: "12px", color: "var(--text-light)", marginBottom: "4px", fontWeight: "600" }}>
                                    Почта
                                </label>
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        border: "2px solid var(--primary)",
                                        borderRadius: "8px",
                                        fontSize: "16px",
                                        fontFamily: "inherit",
                                        boxSizing: "border-box"
                                    }}
                                    disabled={saving}
                                />
                            </div>

                            <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                                <button
                                    className="btn-primary"
                                    onClick={handleSave}
                                    disabled={saving}
                                    style={{ flex: 1 }}
                                >
                                    {saving ? "Сохранение..." : "✓ Сохранить"}
                                </button>
                                <button
                                    className="btn-secondary"
                                    onClick={handleCancel}
                                    disabled={saving}
                                    style={{ flex: 1 }}
                                >
                                    ✕ Отмена
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
