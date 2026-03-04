import { createContext, useState } from "react"
import { login, register } from "../api/authApi"
import { getAccount } from "../api/accountsApi"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)

    const signIn = async (accountName, password) => {

        const data = await login(accountName, password)

        localStorage.setItem("accessToken", data.accessToken)
        localStorage.setItem("refreshToken", data.refreshToken)

        // Optionally fetch account details (можно убрать, если не используется)
        try {
            const account = await getAccount(data.accountId)
            setUser(account)
        } catch (e) {
            // Account fetch failed, but login succeeded - that's ok
            console.warn("Could not fetch account details", e)
            setUser({ accountId: data.accountId })
        }
    }

    const signUp = async (accountName, email, password) => {

        const data = await register(accountName, email, password)

        localStorage.setItem("accessToken", data.accessToken)
        localStorage.setItem("refreshToken", data.refreshToken)

        try {
            const account = await getAccount(data.accountId)
            setUser(account)
        } catch (e) {
            // Account fetch failed, but signup succeeded - that's ok
            console.warn("Could not fetch account details", e)
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