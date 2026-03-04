import api from "./axios"

export const getBoards = async (tripId) => {
    let res

    if (tripId) {
        res = await api.get(`/trips/${tripId}/boards`)
    } else {
        res = await api.get("/boards")
    }

    // map backend `name` -> client `title` to keep UI consistent
    return res.data.map(b => ({ ...b, title: b.name }))
}

export const getBoard = async (boardId) => {
    const res = await api.get(`/boards/${boardId}`)
    return res.data
}

export const createBoard = async (payload) => {
    // payload should contain: { name, description, tripId }
    const res = await api.post("/boards", payload)

    return { ...res.data, title: res.data.name }
}

// Cards (Stickers)
export const getCardsByBoard = async (boardId) => {
    const res = await api.get(`/boards/${boardId}/cards`)
    return res.data
}

export const createCard = async (boardId, payload) => {
    // payload should contain: { text, color, positionX, positionY }
    const data = {
        ...payload,
        boardId
    }

    const res = await api.post(`/cards`, data)
    return res.data
}

export const updateCard = async (cardId, payload) => {
    // payload can contain: { text, color, positionX, positionY }
    const res = await api.put(`/cards/${cardId}`, payload)
    return res.data
}

export const deleteCard = async (cardId) => {
    const res = await api.delete(`/cards/${cardId}`)
    return res.data
}

export const createSticker = async (boardId, text, x, y) => {
    // backend exposes cards; create a card tied to a board
    const payload = {
        text,
        color: "#fff9c4",
        positionX: Math.round(x),
        positionY: Math.round(y),
        boardId
    }

    const res = await api.post(`/cards`, payload)

    // normalize backend card -> frontend sticker shape
    const card = res.data
    return {
        id: card.id,
        text: card.text || card.text,
        x: card.positionX ?? 0,
        y: card.positionY ?? 0
    }
}