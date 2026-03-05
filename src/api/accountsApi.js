import api from "./axios"

// Helper to normalize account response from PascalCase to camelCase
const normalizeAccount = (account) => {
    if (!account) return null
    return {
        id: account.Id,
        accountName: account.AccountName,
        email: account.Email,
        ...account // in case there are other properties
    }
}

export const getAccount = async (id) => {
    const res = await api.get(`/accounts/${id}`)
    return normalizeAccount(res.data)
}

export const updateAccount = async (id, data) => {
    const res = await api.put(`/accounts/${id}`, {
        accountName: data.accountName,
        email: data.email
    })
    return res.data
}

export const deleteAccount = async (id) => {
    await api.delete(`/accounts/${id}`)
}
