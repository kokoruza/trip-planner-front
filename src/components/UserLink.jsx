import { useNavigate } from "react-router-dom"
import { getMediaUrl } from "../api/axios"

export default function UserLink({ 
    accountId, 
    name, 
    avatar, 
    size = "sm",
    showName = true,
    className = ""
}) {
    const navigate = useNavigate()

    const sizeMap = {
        sm: { avatar: "24px", fontSize: "11px" },
        md: { avatar: "32px", fontSize: "13px" },
        lg: { avatar: "48px", fontSize: "14px" }
    }

    const dims = sizeMap[size]
    const initials = name?.[0]?.toUpperCase() || "?"

    const handleClick = (e) => {
        if (e) e.stopPropagation()
        if (!accountId) {
            console.warn("UserLink: No accountId provided")
            return
        }
        navigate(`/profile/${accountId}`)
    }

    return (
        <div 
            style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                transition: "opacity 0.2s"
            }}
            onClick={handleClick}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.7"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
            className={className}
            title={`Перейти в профиль ${name}`}
        >
            <div style={{
                width: dims.avatar,
                height: dims.avatar,
                borderRadius: "50%",
                overflow: "hidden",
                background: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: dims.fontSize,
                fontWeight: "600",
                flexShrink: 0,
                border: "2px solid var(--primary)"
            }}>
                {avatar ? (
                    <img 
                        src={getMediaUrl(avatar)}
                        alt="" 
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                ) : (
                    <span>{initials}</span>
                )}
            </div>
            {showName && (
                <span style={{
                    fontSize: "14px",
                    color: "var(--primary)",
                    fontWeight: "600",
                    textDecoration: "underline",
                    textDecorationColor: "transparent",
                    transition: "text-decoration-color 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.textDecorationColor = "var(--primary)"}
                onMouseLeave={(e) => e.currentTarget.style.textDecorationColor = "transparent"}
                >
                    {name}
                </span>
            )}
        </div>
    )
}
