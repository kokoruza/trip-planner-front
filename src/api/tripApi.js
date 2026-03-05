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

// Trip Members Management
export const getTripMembers = async (tripId) => {
    const res = await api.get(`/trips/${tripId}/members`)
    return res.data
}

export const addTripMember = async (tripId, accountId, role = "User") => {
    const res = await api.post(`/trips/${tripId}/members`, {
        tripId,
        accountId,
        role
    })
    return res.data
}

export const updateTripMember = async (tripId, accountId, role) => {
    const res = await api.put(`/trips/${tripId}/members/${accountId}`, {
        role
    })
    return res.data
}

export const removeTripMember = async (tripId, accountId) => {
    await api.delete(`/trips/${tripId}/members/${accountId}`)
}
