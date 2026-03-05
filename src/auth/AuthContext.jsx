import { createContext, useState, useEffect } from "react"
import { login, register } from "../api/authApi"
import { getAccount } from "../api/accountsApi"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)

    // Восстанавливаем пользователя при загрузке сессии
    useEffect(() => {
        const recoverUser = async () => {
            const accountId = localStorage.getItem("accountId")
            console.log("🔄 AuthContext: Attempting recovery with accountId:", accountId)
            
            if (accountId) {
                try {
                    console.log("📡 AuthContext: Calling getAccount for:", accountId)
                    const account = await getAccount(accountId)
                    console.log("✅ AuthContext: Got account:", account)
                    setUser(account)
                } catch (e) {
                    console.warn("❌ AuthContext: Could not recover user profile", e)
                    console.log("📌 AuthContext: Setting minimal user with id:", accountId)
                    setUser({ id: accountId })
                }
            } else {
                console.log("⚠️ AuthContext: No accountId in localStorage")
            }
        }
        recoverUser()
    }, [])

    const signIn = async (accountName, password) => {

        const data = await login(accountName, password)

        localStorage.setItem("accessToken", data.accessToken)
        localStorage.setItem("refreshToken", data.refreshToken)
        localStorage.setItem("accountId", data.accountId)

        // Optionally fetch account details
        try {
            const account = await getAccount(data.accountId)
            setUser(account)
        } catch (e) {
            // Account fetch failed, but login succeeded - that's ok
            console.warn("Could not fetch account details", e)
            setUser({ id: data.accountId })
        }
    }

    const signUp = async (accountName, email, password) => {

        const data = await register(accountName, email, password)

        localStorage.setItem("accessToken", data.accessToken)
        localStorage.setItem("refreshToken", data.refreshToken)
        localStorage.setItem("accountId", data.accountId)

        try {
            const account = await getAccount(data.accountId)
            setUser(account)
        } catch (e) {
            // Account fetch failed, but signup succeeded - that's ok
            console.warn("Could not fetch account details", e)
            setUser({ id: data.accountId })
        }
    }

    const logout = () => {

        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("accountId")

        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, signIn, signUp, logout }}>
            {children}
        </AuthContext.Provider>
    )
}