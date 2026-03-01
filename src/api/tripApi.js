import api from "./axios"

export const getMyTrips = async () => {
    const res = await api.get("/trips/my")
    return res.data
}

export const getTrips = async () => {
    const res = await api.get("/trips")
    return res.data
}

export const createTrip = async (payload) => {
    const res = await api.post("/trips", payload)
    return res.data
}
