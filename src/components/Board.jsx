import { useState, useRef } from "react"
import Sticker from "./Sticker"
import { createCard } from "../api/boardApi"

export default function Canvas({ boardId, cards, onUpdate, onDelete, onCardCreate, onNavigateBack }) {
    const canvasRef = useRef(null)
    const innerRef = useRef(null)
    const dragStateRef = useRef(null)  // Ref для синхронного обновления до следующего render
    const [zoom, setZoom] = useState(1)
    const [pan, setPan] = useState({ x: 0, y: 0 })
    const [isDraggingCanvas, setIsDraggingCanvas] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [draggedCard, setDraggedCard] = useState(null)
    const [isCreatingSticker, setIsCreatingSticker] = useState(false)
    const [error, setError] = useState("")

    // Zoom with mouse wheel (any zoom level)
    const handleWheel = (e) => {
        e.preventDefault()

        const delta = e.deltaY > 0 ? 0.9 : 1.1
        setZoom(prev => Math.max(0.1, Math.min(5, prev * delta)))
    }

    // Pan with left mouse button on background
    const handleMouseDown = (e) => {
        // Check if click is on the inner grid (not on a sticker)
        const isStickerClick = e.target.closest('.sticker')
        if (e.button === 0 && !isStickerClick) {
            e.preventDefault()
            setIsDraggingCanvas(true)
            setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
        }
    }

    const handleMouseMove = (e) => {
        if (isDraggingCanvas && canvasRef.current) {
            const canvasWidth = canvasRef.current.clientWidth
            const canvasHeight = canvasRef.current.clientHeight
            const gridWidth = 10000 * zoom
            const gridHeight = 10000 * zoom

            let newPanX = e.clientX - dragStart.x
            let newPanY = e.clientY - dragStart.y

            newPanX = Math.min(0, Math.max(newPanX, canvasWidth - gridWidth))
            newPanY = Math.min(0, Math.max(newPanY, canvasHeight - gridHeight))

            setPan({
                x: newPanX,
                y: newPanY
            })
        }
        
        // Синхронно обновляем ref с текущей позицией мыши для плавного перетаскивания
        if (dragStateRef.current?.id) {
            dragStateRef.current.currentScreenX = e.clientX
            dragStateRef.current.currentScreenY = e.clientY
            
            // Триггер re-render чтобы применить новую позицию
            setDraggedCard(prev => prev ? { ...prev } : null)
        }
    }

    const handleMouseUp = () => {
        setIsDraggingCanvas(false)
        
        // Сохраняем карточку, если она была перетащена
        if (dragStateRef.current?.id) {
            const screenDeltaX = dragStateRef.current.currentScreenX - dragStateRef.current.startScreenX
            const screenDeltaY = dragStateRef.current.currentScreenY - dragStateRef.current.startScreenY
            
            const worldDeltaX = screenDeltaX / zoom
            const worldDeltaY = screenDeltaY / zoom
            
            const finalX = dragStateRef.current.cardStartX + worldDeltaX
            const finalY = dragStateRef.current.cardStartY + worldDeltaY

            const card = cards.find(c => c.id === dragStateRef.current.id)
            if (card) {
                onUpdate({
                    ...card,
                    positionX: Math.round(finalX),
                    positionY: Math.round(finalY)
                })
            }
            
            dragStateRef.current = null
            setDraggedCard(null)
        }
    }

    // Touch pinch zoom
    const handleTouchStart = (e) => {
        if (e.touches.length === 2) {
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            )
            setDragStart({ x: dist, y: 0 })
        }
    }

    const handleTouchMove = (e) => {
        if (e.touches.length === 2) {
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            )
            if (dragStart.x > 0) {
                const delta = dist / dragStart.x
                setZoom(prev => Math.max(0.1, Math.min(5, prev * delta)))
                setDragStart({ x: dist, y: 0 })
            }
        }
    }

    // Create sticker at default position
    const handleCreateSticker = async () => {
        if (!onCardCreate) return
        setIsCreatingSticker(true)

        try {
            const newCard = await createCard(boardId, {
                text: "Новая карточка",
                color: "#fff9c4",
                positionX: 100,
                positionY: 100
            })
            onCardCreate(newCard)
        } catch (err) {
            setError(err?.response?.data?.message || "Ошибка при создании карточки")
        } finally {
            setIsCreatingSticker(false)
        }
    }

    // Drag sticker
    const handleStickerDragStart = (card, e) => {
        e.preventDefault()
        e.stopPropagation()
        
        // Сохраняем состояние в ref для синхронного обновления
        dragStateRef.current = {
            id: card.id,
            startScreenX: e.clientX,
            startScreenY: e.clientY,
            currentScreenX: e.clientX,
            currentScreenY: e.clientY,
            cardStartX: card.positionX,
            cardStartY: card.positionY
        }
        
        // Также обновляем state для рендера
        setDraggedCard(dragStateRef.current)
    }

return (
        <div className="board-container">
            <div className="board-toolbar">
                <button
                    className="btn-secondary"
                    onClick={onNavigateBack}
                    title="Вернуться назад"
                >
                    ← Назад
                </button>
                <button
                    className="btn-primary"
                    onClick={handleCreateSticker}
                    disabled={isCreatingSticker}
                >
                    + Создать стикер
                </button>
                <div className="board-info">
                    <span>Колесико = масштаб</span>
                    <span>ЛКМ на фоне = панорама</span>
                    <span>ЛКМ на карточке = перемещение</span>
                </div>
            </div>

            {error && <div className="board-error">{error}</div>}

            <div
                ref={canvasRef}
                className="board-canvas"
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
            >
                {/* Zoom Controls */}
                <div className="zoom-controls-floating">
                    <button
                        className="zoom-btn zoom-in"
                        onClick={() => setZoom(prev => Math.min(5, prev + 0.2))}
                        title="Приблизить"
                    >
                        +
                    </button>
                    <div className="zoom-level-display">{Math.round(zoom * 100)}%</div>
                    <button
                        className="zoom-btn zoom-out"
                        onClick={() => setZoom(prev => Math.max(0.1, prev - 0.2))}
                        title="Отдалить"
                    >
                        −
                    </button>
                    <button
                        className="zoom-btn zoom-reset"
                        onClick={() => {
                            setZoom(1)
                            setPan({ x: 0, y: 0 })
                        }}
                        title="Сброс"
                    >
                        ↺
                    </button>
                </div>

                <div
                    ref={innerRef}
                    className="board-inner"
                    style={{
                        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                        transformOrigin: "top left",
                        cursor: isDraggingCanvas ? "grabbing" : "grab",
                    }}
                >
                    <div className="board-grid">
                        {cards && cards.map(card => {
                            // Если карточка в процессе drag, вычисляем её временную позицию
                            // Используем ref для синхронной позиции мыши (без задержки state)
                            let displayCard = card
                            if (dragStateRef.current?.id === card.id) {
                                const screenDeltaX = dragStateRef.current.currentScreenX - dragStateRef.current.startScreenX
                                const screenDeltaY = dragStateRef.current.currentScreenY - dragStateRef.current.startScreenY
                                const worldDeltaX = screenDeltaX / zoom
                                const worldDeltaY = screenDeltaY / zoom
                                
                                displayCard = {
                                    ...card,
                                    positionX: dragStateRef.current.cardStartX + worldDeltaX,
                                    positionY: dragStateRef.current.cardStartY + worldDeltaY
                                }
                            }
                            
                            return (
                                <Sticker
                                    key={card.id}
                                    card={displayCard}
                                    onUpdate={onUpdate}
                                    onDelete={onDelete}
                                    isDragging={draggedCard?.id === card.id}
                                    onDragStart={e => handleStickerDragStart(card, e)}
                                />
                            )
                        })}
                    </div>
                </div>
            </div>

            {isCreatingSticker && (
                <div className="loading-indicator">Создание карточки...</div>
            )}
        </div>
    )
}