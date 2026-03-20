import { useContext, useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../auth/AuthContext"
import { getMediaUrl } from "../api/axios"

export default function UserMenu() {
    const { user, logout } = useContext(AuthContext)
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const menuRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    if (!user) return null

    const avatarUrl = getMediaUrl(user.avatarPath)
    const initial = (user.accountName || "?").charAt(0).toUpperCase()

    const handleProfile = () => {
        setOpen(false)
        navigate("/profile")
    }

    const handleLogout = () => {
        setOpen(false)
        logout()
        navigate("/")
    }

    return (
        <div 
            className="user-menu" 
            ref={menuRef}
            style={{ position: "relative" }}
        >
            <button
                type="button"
                className="user-menu-trigger"
                onClick={() => setOpen(prev => !prev)}
            >
                <div className="user-menu-avatar">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt={user.accountName || "Профиль"} />
                    ) : (
                        <span>{initial}</span>
                    )}
                </div>
            </button>

            {open && (
                <div 
                    className="user-menu-dropdown"
                    style={{
                        position: "absolute",
                        right: 0,
                        top: "120%",
                        maxHeight: "200px",
                        overflowY: "auto"
                    }}
                >
                    <button className="user-menu-item" onClick={handleProfile}>
                        👤 Профиль
                    </button>
                    <button className="user-menu-item user-menu-item-logout" onClick={handleLogout}>
                        ⎋ Выход
                    </button>
                </div>
            )}
        </div>
    )
}

