import { useState, useContext } from "react"
import { AuthContext } from "../auth/AuthContext"
import { useNavigate } from "react-router-dom"

export default function LoginPage() {

    const { signIn } = useContext(AuthContext)

    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async e => {

        e.preventDefault()

        await signIn(email, password)

        navigate("/boards")
    }

    return (

        <form onSubmit={handleSubmit}>

            <h2>Login</h2>

            <input
                placeholder="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />

            <button>Login</button>

        </form>
    )
}