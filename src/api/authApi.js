import api from "./axios"

export const login = async (username, password) => {
    const res = await api.post("/auth/login", {
        username,
        password
    })

    return res.data
}

export const register = async (accountName, email, password) => {
    // Create account then immediately login to obtain tokens
    await api.post("/accounts/create", {
        accountName,
        email,
        passwordHash: password
    })

    const loginRes = await api.post("/auth/login", {
        username: accountName,
        password
    })

    return loginRes.data
}