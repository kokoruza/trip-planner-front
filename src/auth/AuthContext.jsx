import { createContext, useState } from "react"
import { login, register } from "../api/authApi"
import { getAccount } from "../api/accountsApi"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)

    const signIn = async (email, password) => {

        const data = await login(email, password)

        localStorage.setItem("accessToken", data.accessToken)
        localStorage.setItem("refreshToken", data.refreshToken)

        // fetch account details
        try {
            const account = await getAccount(data.accountId)
            setUser(account)
        } catch (e) {
            setUser({ accountId: data.accountId })
        }
    }

    const signUp = async (email, password) => {

        const data = await register(email, password)

        localStorage.setItem("accessToken", data.accessToken)
        localStorage.setItem("refreshToken", data.refreshToken)

        try {
            const account = await getAccount(data.accountId)
            setUser(account)
        } catch (e) {
            setUser({ accountId: data.accountId })
        }
    }

    const logout = () => {

        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")

        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, signIn, signUp, logout }}>
            {children}
        </AuthContext.Provider>
    )
}