import { useState, useContext } from "react"
import { AuthContext } from "../auth/AuthContext"
import { useNavigate, Link } from "react-router-dom"

export default function LoginPage() {

    const { signIn } = useContext(AuthContext)

    const navigate = useNavigate()

    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async e => {

        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            await signIn(login, password)
            navigate("/trips")
        } catch (err) {
            setError(err?.response?.data?.message || "Ошибка входа. Проверьте логин/почту и пароль.")
        } finally {
            setLoading(false)
        }
    }

    return (

        <div className="auth-page">
            <div className="auth-card">
                <h2>Вход</h2>

                {error && <div style={{ color: "#ef4444", padding: "12px", background: "#fee2e2", borderRadius: "8px", fontSize: "14px" }}>
                    {error}
                </div>}

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        placeholder="Логин или почта"
                        value={login}
                        onChange={e => setLogin(e.target.value)}
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

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? "Загрузка..." : "Войти"}
                    </button>

                </form>

                <div className="auth-link">
                    Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
                </div>
            </div>
        </div>
    )
}