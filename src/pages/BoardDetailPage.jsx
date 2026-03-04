import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import Canvas from "../components/Board"
import { getBoard, getCardsByBoard, updateCard } from "../api/boardApi"

export default function BoardDetailPage() {

    const { boardId } = useParams()
    const navigate = useNavigate()
    const [board, setBoard] = useState(null)
    const [cards, setCards] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        loadBoard()
    }, [boardId])

    const loadBoard = async () => {
        try {
            setLoading(true)
            const boardData = await getBoard(boardId)
            setBoard(boardData)

            const cardsData = await getCardsByBoard(boardId)
            setCards(cardsData)
        } catch (err) {
            setError(err?.response?.data?.message || "Ошибка при загрузке доски")
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateCard = async (updatedCard) => {
        try {
            await updateCard(updatedCard.id, {
                text: updatedCard.text,
                color: updatedCard.color,
                positionX: updatedCard.positionX,
                positionY: updatedCard.positionY
            })
            setCards(cards.map(c => c.id === updatedCard.id ? updatedCard : c))
        } catch (err) {
            if (err?.response?.status === 403) {
                setError("Только создатель карточки может её редактировать")
            } else {
                setError(err?.response?.data?.message || "Ошибка при обновлении карточки")
            }
        }
    }

    const handleDeleteCard = (cardId) => {
        setCards(cards.filter(c => c.id !== cardId))
    }

    const handleCardCreate = (newCard) => {
        setCards([...cards, newCard])
    }

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                fontSize: '18px',
                color: 'var(--text-light)'
            }}>
                Доска загружается...
            </div>
        )
    }

    return (
        <>
            {error && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    padding: '12px 16px',
                    background: '#fee',
                    border: '1px solid #fcc',
                    color: '#c33',
                    fontSize: '14px',
                    zIndex: 1000
                }}>
                    {error}
                    <button 
                        onClick={() => setError("")}
                        style={{
                            marginLeft: '12px',
                            background: '#fcc',
                            border: 'none',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        ✕
                    </button>
                </div>
            )}
            <Canvas 
                boardId={boardId}
                cards={cards}
                onUpdate={handleUpdateCard}
                onDelete={handleDeleteCard}
                onCardCreate={handleCardCreate}
                onNavigateBack={() => navigate(-1)}
            />
        </>
    )
}
