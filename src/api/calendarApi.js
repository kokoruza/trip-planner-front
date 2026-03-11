import api from "./axios"

// Events API
export const getEventsByTrip = async (tripId) => {
    const res = await api.get(`/trips/${tripId}/events`)
    return res.data || []
}

export const createEvent = async (tripId, payload) => {
    // Always use FormData for consistency
    const formData = new FormData()
    formData.append("title", payload.title || "")
    formData.append("date", payload.date || "")
    if (payload.description) formData.append("description", payload.description)
    if (payload.file) formData.append("file", payload.file)
    
    const res = await api.post(`/trips/${tripId}/events`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    })
    return res.data
}

export const updateEvent = async (eventId, payload) => {
    const res = await api.put(`/events/${eventId}`, payload)
    return res.data
}

export const deleteEvent = async (eventId) => {
    await api.delete(`/events/${eventId}`)
}

// Vacation Schedule API
export const getVacationSchedules = async (tripId) => {
    const res = await api.get(`/trips/${tripId}/vacation-schedules`)
    return res.data || []
}

export const createVacationSchedule = async (tripId, payload) => {
    const res = await api.post(`/trips/${tripId}/vacation-schedules`, payload)
    return res.data
}

export const updateVacationSchedule = async (scheduleId, payload) => {
    const res = await api.put(`/vacation-schedules/${scheduleId}`, payload)
    return res.data
}

export const deleteVacationSchedule = async (scheduleId) => {
    await api.delete(`/vacation-schedules/${scheduleId}`)
}
