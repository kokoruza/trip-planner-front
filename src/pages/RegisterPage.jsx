import { useState, useContext } from "react"
import { AuthContext } from "../auth/AuthContext"
import { useNavigate } from "react-router-dom"

export default function RegisterPage() {

    const { signUp } = useContext(AuthContext)

    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const submit = async e => {

        e.preventDefault()

        await signUp(email, password)

        navigate("/boards")
    }

    return (

        <form onSubmit={submit}>

            <h2>Register</h2>

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

            <button>Register</button>

        </form>
    )
}