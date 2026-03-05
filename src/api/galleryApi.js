import axios from "./axios"

const API_BASE = "/gallery"

// Gallery Photos
export const getGalleryByTrip = (tripId) =>
    axios.get(`${API_BASE}/trip/${tripId}`)

export const getGalleryPhoto = (photoId) =>
    axios.get(`${API_BASE}/${photoId}`)

export const uploadGalleryPhoto = (tripId, file, title, description) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("title", title)
    if (description) formData.append("description", description)
    return axios.post(`${API_BASE}/${tripId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    })
}

export const deleteGalleryPhoto = (photoId) =>
    axios.delete(`${API_BASE}/${photoId}`)

// Gallery Comments
export const addComment = (photoId, text) =>
    axios.post(`${API_BASE}/${photoId}/comments`, { text })

export const deleteComment = (photoId, commentId) =>
    axios.delete(`${API_BASE}/${photoId}/comments/${commentId}`)

// Gallery Likes
export const likePhoto = (photoId) =>
    axios.post(`${API_BASE}/${photoId}/like`)

export const unlikePhoto = (photoId) =>
    axios.delete(`${API_BASE}/${photoId}/like`)
