import { useState, useContext, useEffect } from "react"
import { getTripMembers, removeTripMember } from "../api/tripApi"
import { getAccount } from "../api/accountsApi"
import { AuthContext } from "../auth/AuthContext"
import { API_ORIGIN } from "../api/axios"

export default function TripMembersManager({ trip, onMembersUpdate }) {
    const { user } = useContext(AuthContext)
    const [members, setMembers] = useState(trip.members || [])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [showInviteLink, setShowInviteLink] = useState(false)
    const [inviteCode, setInviteCode] = useState("")
    const [removingMemberId, setRemovingMemberId] = useState(null)

    // Get current user ID from localStorage
    const currentUserId = localStorage.getItem("accountId")
    
    // Check if current user is trip owner
    const isOwner = trip.ownerId === currentUserId

    // Load members on mount and when trip changes
    useEffect(() => {
        loadMembers()
    }, [trip.id])

    // Generate invite link/code
    const handleGenerateInvite = () => {
        // Generate a unique code based on trip ID and timestamp
        const code = btoa(`${trip.id}-${Date.now()}`).substring(0, 12).toUpperCase()
        setInviteCode(code)
        setShowInviteLink(true)
    }

    // Copy invite link to clipboard
    const handleCopyInviteLink = async () => {
        const inviteLink = `${window.location.origin}/join/${trip.id}?code=${inviteCode}`
        try {
            await navigator.clipboard.writeText(inviteLink)
            alert("Ссылка скопирована в буфер обмена!")
        } catch (err) {
            alert("Ошибка при копировании ссылки")
        }
    }

    // Load members from API
    const loadMembers = async () => {
        try {
            setLoading(true)
            setError("")
            const membersData = await getTripMembers(trip.id)
            
            // Fetch full account info for each member
            const membersWithInfo = await Promise.all(
                membersData.map(async (member) => {
                    try {
                        const accountInfo = await getAccount(member.accountId)
                        return {
                            ...member,
                            accountName: accountInfo.accountName,
                            email: accountInfo.email,
                            avatarPath: accountInfo.avatarPath
                        }
                    } catch (err) {
                        console.error(`Ошибка загрузки информации о пользователе ${member.accountId}:`, err)
                        return member
                    }
                })
            )
            
            setMembers(membersWithInfo)
            if (onMembersUpdate) {
                onMembersUpdate(membersWithInfo)
            }
        } catch (err) {
            setError("Ошибка загрузки членов группы")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // Remove member from trip
    const handleRemoveMember = async (accountId) => {
        if (!window.confirm("Вы уверены, что хотите удалить этого участника?")) {
            return
        }

        try {
            setRemovingMemberId(accountId)
            setError("")
            await removeTripMember(trip.id, accountId)
            setMembers(members.filter(m => m.accountId !== accountId))
            if (onMembersUpdate) {
                onMembersUpdate(members.filter(m => m.accountId !== accountId))
            }
        } catch (err) {
            setError(err?.response?.data?.message || "Ошибка при удалении участника")
            console.error(err)
        } finally {
            setRemovingMemberId(null)
        }
    }

    return (
        <div className="trip-section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h2 style={{ margin: "0" }}>👥 Участники ({members.length})</h2>
                {isOwner && (
                    <button 
                        className="btn-primary"
                        onClick={handleGenerateInvite}
                        style={{ padding: "8px 16px", fontSize: "14px" }}
                        title="Сгенерировать ссылку для приглашения"
                    >
                        🔗 Пригласить
                    </button>
                )}
            </div>

            {error && (
                <div style={{ 
                    color: "#ef4444", 
                    padding: "12px", 
                    background: "#fee2e2", 
                    borderRadius: "8px", 
                    fontSize: "14px",
                    marginBottom: "16px"
                }}>
                    {error}
                </div>
            )}

            {/* Invite Link Section */}
            {showInviteLink && inviteCode && (
                <div style={{
                    background: "var(--hover)",
                    border: "2px solid var(--primary)",
                    borderRadius: "8px",
                    padding: "16px",
                    marginBottom: "16px"
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <h3 style={{ margin: "0", fontSize: "16px", fontWeight: "600" }}>Ссылка для приглашения</h3>
                        <button 
                            className="btn-ghost"
                            onClick={() => setShowInviteLink(false)}
                            style={{ padding: "4px 8px", fontSize: "14px" }}
                        >
                            ✕
                        </button>
                    </div>
                    <div style={{
                        background: "var(--white)",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        padding: "12px",
                        marginBottom: "12px",
                        fontFamily: "monospace",
                        fontSize: "12px",
                        wordBreak: "break-all",
                        color: "var(--text)"
                    }}>
                        {`${window.location.origin}/join/${trip.id}?code=${inviteCode}`}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-light)", marginBottom: "12px" }}>
                        Код действителен: <strong>{inviteCode}</strong>
                    </div>
                    <button 
                        className="btn-primary"
                        onClick={handleCopyInviteLink}
                        style={{ padding: "8px 16px", fontSize: "12px", width: "100%" }}
                    >
                        📋 Скопировать ссылку
                    </button>
                </div>
            )}

            {/* Members List */}
            <div className="section-content">
                {loading ? (
                    <div style={{ textAlign: "center", color: "var(--text-light)", padding: "20px" }}>
                        Загрузка...
                    </div>
                ) : members.length === 0 ? (
                    <div className="empty-message">
                        Нет участников
                    </div>
                ) : (
                    members.map(member => {
                        const avatarUrl = member.avatarPath
                            ? `${API_ORIGIN}${member.avatarPath}`
                            : null

                        return (
                        <div 
                            key={member.accountId} 
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "12px",
                                background: "var(--hover)",
                                borderRadius: "8px",
                                marginBottom: "8px",
                                borderLeft: "3px solid var(--primary)"
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                                <div style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    overflow: "hidden",
                                    background: "var(--white)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    color: "var(--primary)",
                                    flexShrink: 0
                                }}>
                                    {avatarUrl ? (
                                        <img
                                            src={avatarUrl}
                                            alt={member.accountName || "Участник"}
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    ) : (
                                        <span>{(member.accountName || "?")[0].toUpperCase()}</span>
                                    )}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: "500", color: "var(--text)" }}>
                                        {member.accountName || member.email}
                                    </div>
                                    <div style={{ fontSize: "12px", color: "var(--text-light)" }}>
                                        {member.role || "User"}
                                    </div>
                                </div>
                            </div>
                            {isOwner && member.accountId !== currentUserId && (
                                <button 
                                    className="btn-danger"
                                    onClick={() => handleRemoveMember(member.accountId)}
                                    disabled={removingMemberId === member.accountId}
                                    style={{ 
                                        padding: "6px 12px", 
                                        fontSize: "12px",
                                        marginLeft: "12px"
                                    }}
                                    title="Удалить участника"
                                >
                                    {removingMemberId === member.accountId ? "..." : "✕"}
                                </button>
                            )}
                        </div>
                        )
                    })
                )}
            </div>

            {isOwner && (
                <button 
                    className="btn-ghost"
                    onClick={loadMembers}
                    disabled={loading}
                    style={{ 
                        padding: "8px 12px", 
                        fontSize: "12px",
                        marginTop: "12px",
                        width: "100%"
                    }}
                >
                    {loading ? "Загрузка..." : "🔄 Обновить список"}
                </button>
            )}
        </div>
    )
}
