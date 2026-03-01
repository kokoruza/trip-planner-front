import { useState } from "react"
import Sticker from "./Sticker"
import { createSticker } from "../api/boardApi"

export default function Board({ boardId }) {

    const [stickers, setStickers] = useState([])

    const addSticker = async e => {

        const rect = e.target.getBoundingClientRect()

        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const sticker = await createSticker(boardId, "New note", x, y)

        setStickers([...stickers, sticker])
    }

    return (

        <div
            onDoubleClick={addSticker}
            className="board-canvas"
        >

            {stickers.map(s => (
                <Sticker key={s.id} sticker={s}/>
            ))}

        </div>
    )
}