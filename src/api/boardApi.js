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

export const createBoard = async (title, tripId) => {
    const payload = { name: title }
    if (tripId) payload.tripId = tripId

    const res = await api.post("/boards", payload)

    return { ...res.data, title: res.data.name }
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