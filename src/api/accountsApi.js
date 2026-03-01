import api from "./axios"

export const getAccount = async (id) => {
    const res = await api.get(`/accounts/${id}`)
    return res.data
}
