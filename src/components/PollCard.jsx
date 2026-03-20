import { useState, useContext } from "react"
import { AuthContext } from "../auth/AuthContext"
import { votePoll, deletePoll } from "../api/pollApi"
import { getMediaUrl } from "../api/axios"

export default function PollCard({ poll, onPollUpdated, onPollDeleted }) {
    const { user } = useContext(AuthContext)
    const [voting, setVoting] = useState(false)
    const [error, setError] = useState("")
    const [expandedImages, setExpandedImages] = useState(false)
    const currentUserId = localStorage.getItem("accountId")
    const isCreator = poll.createdById === currentUserId

    const handleVote = async (optionId) => {
        if (poll.hasUserVoted) {
            setError("Вы уже проголосовали в этом голосовании")
            return
        }

        try {
            setVoting(true)
            setError("")
            await votePoll(poll.id, optionId)
            // Update UI optimistically
            const updatedPoll = {
                ...poll,
                hasUserVoted: true,
                userVotedOptionId: optionId,
                totalVotes: poll.totalVotes + 1,
                options: poll.options.map(opt => ({
                    ...opt,
                    voteCount: opt.id === optionId ? opt.voteCount + 1 : opt.voteCount
                }))
            }
            onPollUpdated(updatedPoll)
        } catch (err) {
            setError("Ошибка при голосовании")
            console.error(err)
        } finally {
            setVoting(false)
        }
    }

    const handleDelete = async () => {
        if (!window.confirm("Вы уверены, что хотите удалить это голосование?")) return

        try {
            await deletePoll(poll.id)
            onPollDeleted(poll.id)
        } catch (err) {
            setError("Ошибка при удалении голосования")
            console.error(err)
        }
    }

    const getVotePercentage = (voteCount) => {
        if (poll.totalVotes === 0) return 0
        return Math.round((voteCount / poll.totalVotes) * 100)
    }

    return (
        <div style={{
            background: "var(--white)",
            border: "2px solid var(--primary)",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "var(--shadow)"
        }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div style={{ flex: 1 }}>
                    <h3 style={{ margin: "0 0 4px 0", color: "var(--primary)", fontSize: "18px" }}>
                        {poll.title}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--text-light)" }}>
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
                            fontSize: "12px",
                            fontWeight: "600"
                        }}>
                            {poll.createdByAvatar ? (
                                <img src={getMediaUrl(poll.createdByAvatar)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                                <span>{poll.createdByName?.[0]?.toUpperCase() || "?"}</span>
                            )}
                        </div>
                        <span>{poll.createdByName}</span>
                        <span>•</span>
                        <span>{new Date(poll.createdAt).toLocaleDateString("ru-RU")}</span>
                        {poll.isAnonymous && <span>• 🔒 Анонимно</span>}
                    </div>
                </div>
                {isCreator && (
                    <button 
                        className="btn-danger"
                        onClick={handleDelete}
                        style={{ padding: "4px 8px", fontSize: "12px" }}
                        title="Удалить голосование"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Description */}
            {poll.description && (
                <p style={{ margin: "12px 0", color: "var(--text-secondary)", fontSize: "14px" }}>
                    {poll.description}
                </p>
            )}

            {/* Images */}
            {poll.images.length > 0 && (
                <div style={{ marginBottom: "16px" }}>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: poll.images.length === 1 ? "1fr" : "repeat(auto-fill, minmax(100px, 1fr))",
                        gap: "8px",
                        marginBottom: "8px"
                    }}>
                        {poll.images.slice(0, expandedImages ? poll.images.length : 4).map(img => (
                            <div
                                key={img.id}
                                style={{
                                    position: "relative",
                                    borderRadius: "8px",
                                    overflow: "hidden",
                                    background: "var(--hover)",
                                    cursor: "pointer"
                                }}
                            >
                                <img
                                    src={getMediaUrl(img.imagePath)}
                                    alt={img.caption || "Poll image"}
                                    style={{ width: "100%", height: "120px", objectFit: "cover" }}
                                />
                                {img.caption && (
                                    <div style={{
                                        position: "absolute",
                                        bottom: "0",
                                        left: "0",
                                        right: "0",
                                        background: "rgba(0, 0, 0, 0.7)",
                                        color: "white",
                                        padding: "4px",
                                        fontSize: "11px",
                                        textAlign: "center"
                                    }}>
                                        {img.caption}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {poll.images.length > 4 && (
                        <button
                            className="btn-ghost"
                            onClick={() => setExpandedImages(!expandedImages)}
                            style={{ fontSize: "12px", padding: "4px 8px" }}
                        >
                            {expandedImages ? "Скрыть" : `Показать все (${poll.images.length})`}
                        </button>
                    )}
                </div>
            )}

            {/* Error */}
            {error && (
                <div style={{
                    padding: "8px",
                    background: "#fee2e2",
                    border: "1px solid #fca5a5",
                    borderRadius: "6px",
                    color: "#ef4444",
                    fontSize: "12px",
                    marginBottom: "12px"
                }}>
                    {error}
                </div>
            )}

            {/* Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {poll.options.map(option => (
                    <button
                        key={option.id}
                        onClick={() => handleVote(option.id)}
                        disabled={voting || poll.hasUserVoted}
                        style={{
                            padding: "12px",
                            background: poll.userVotedOptionId === option.id ? "var(--primary)" : "var(--hover)",
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                            cursor: poll.hasUserVoted ? "default" : "pointer",
                            textAlign: "left",
                            transition: "all 0.2s"
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontWeight: "500", color: poll.userVotedOptionId === option.id ? "white" : "var(--text)" }}>
                                {option.text}
                            </span>
                            <span style={{
                                fontSize: "12px",
                                color: poll.userVotedOptionId === option.id ? "white" : "var(--text-light)",
                                fontWeight: "600"
                            }}>
                                {option.voteCount} ({getVotePercentage(option.voteCount)}%)
                            </span>
                        </div>
                        {poll.totalVotes > 0 && (
                            <div style={{
                                background: "rgba(0, 0, 0, 0.1)",
                                height: "4px",
                                borderRadius: "2px",
                                marginTop: "6px",
                                overflow: "hidden"
                            }}>
                                <div style={{
                                    background: poll.userVotedOptionId === option.id ? "white" : "var(--primary)",
                                    height: "100%",
                                    width: `${getVotePercentage(option.voteCount)}%`,
                                    transition: "width 0.3s"
                                }} />
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {/* Stats */}
            <div style={{
                marginTop: "12px",
                fontSize: "12px",
                color: "var(--text-light)",
                textAlign: "center"
            }}>
                Всего голосов: {poll.totalVotes}
            </div>
        </div>
    )
}
