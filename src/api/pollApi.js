import axios from "./axios"

const API_BASE = "/polls"

// Polls
export const createPoll = (tripId, data) =>
    axios.post(`${API_BASE}`, { tripId, ...data })

export const getPollsByTrip = (tripId) =>
    axios.get(`${API_BASE}/trip/${tripId}`)

export const getPoll = (pollId) =>
    axios.get(`${API_BASE}/${pollId}`)

export const votePoll = (pollId, optionId) =>
    axios.post(`${API_BASE}/${pollId}/vote`, { optionId })

export const deletePoll = (pollId) =>
    axios.delete(`${API_BASE}/${pollId}`)

// Poll Images
export const uploadPollImage = (pollId, file, caption) => {
    const formData = new FormData()
    formData.append("file", file)
    if (caption) formData.append("caption", caption)
    return axios.post(`${API_BASE}/${pollId}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    })
}

export const deletePollImage = (pollId, imageId) =>
    axios.delete(`${API_BASE}/${pollId}/images/${imageId}`)
