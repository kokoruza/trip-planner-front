export default function Sticker({ sticker }) {

    return (

        <div
            className="sticker"
            style={{
                position: "absolute",
                left: sticker.x,
                top: sticker.y
            }}
        >

            {sticker.text}

        </div>
    )
}