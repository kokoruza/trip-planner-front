import { useState, useContext } from "react"
import { AuthContext } from "../auth/AuthContext"
import { useNavigate, Link } from "react-router-dom"

export default function RegisterPage() {

    const { signUp } = useContext(AuthContext)

    const navigate = useNavigate()

    const [accountName, setAccountName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async e => {

        e.preventDefault()
        setError("")

        if (password !== confirmPassword) {
            setError("Пароли не совпадают")
            return
        }

        if (password.length < 6) {
            setError("Пароль должен быть не менее 6 символов")
            return
        }

        setLoading(true)

        try {
            await signUp(accountName, email, password)
            navigate("/trips")
        } catch (err) {
            setError(err?.response?.data?.message || "Ошибка регистрации. Проверьте данные.")
        } finally {
            setLoading(false)
        }
    }

    return (

        <div className="auth-page">
            <div className="auth-card">
                <h2>Регистрация</h2>

                {error && <div style={{ color: "#ef4444", padding: "12px", background: "#fee2e2", borderRadius: "8px", fontSize: "14px" }}>
                    {error}
                </div>}

                <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px", padding: "12px", background: "#f0f7ff", borderRadius: "8px" }}>
                    При входе вы сможете использовать <strong>логин или почту</strong> из полей ниже
                </div>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        placeholder="Имя пользователя"
                        value={accountName}
                        onChange={e => setAccountName(e.target.value)}
                        required
                        disabled={loading}
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        disabled={loading}
                    />

                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />

                    <input
                        type="password"
                        placeholder="Подтвердите пароль"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                        disabled={loading}
                    />

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? "Загрузка..." : "Зарегистрироваться"}
                    </button>

                </form>

                <div className="auth-link">
                    Уже есть аккаунт? <Link to="/">Войти</Link>
                </div>
            </div>
        </div>
    )
}