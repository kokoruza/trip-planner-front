import { useEffect, useState, useContext } from "react"
import { getBoards, createBoard } from "../api/boardApi"
import Board from "../components/Board"
import { AuthContext } from "../auth/AuthContext"
import { useNavigate } from "react-router-dom"
import { getMyTrips } from "../api/tripApi"
import TripList from "../components/TripList"

export default function BoardPage() {

    const { logout } = useContext(AuthContext)
    const navigate = useNavigate()

    const [boards, setBoards] = useState([])
    const [selectedBoard, setSelectedBoard] = useState(null)
    const [newBoardTitle, setNewBoardTitle] = useState("")

    const [trips, setTrips] = useState([])
    const [selectedTrip, setSelectedTrip] = useState(null)

    const loadBoards = async (tripId) => {
        try {
            const data = await getBoards(tripId)
            setBoards(data)

            if (data.length > 0) {
                setSelectedBoard(data[0])
            } else {
                setSelectedBoard(null)
            }
        } catch (error) {
            console.error("Ошибка загрузки бордов", error)
        }
    }

    const loadTrips = async () => {
        try {
            const data = await getMyTrips()
            setTrips(data)
            if (data.length > 0) {
                setSelectedTrip(data[0])
                await loadBoards(data[0].id)
            }
        } catch (error) {
            console.error("Ошибка загрузки поездок", error)
        }
    }

    useEffect(() => {
        loadTrips()
    }, [])

    const handleCreateBoard = async (e) => {
        e.preventDefault()

        if (!newBoardTitle.trim()) return

        const tripId = selectedTrip?.id

        const board = await createBoard(newBoardTitle, tripId)

        setBoards([...boards, board])
        setSelectedBoard(board)
        setNewBoardTitle("")
    }

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    return (
        <div className="page page-board">

            <div className="page-header">
                <h1>Boards</h1>
                <button onClick={handleLogout} className="btn-ghost">Logout</button>
            </div>

            <div className="board-layout">

                <aside className="sidebar">
                    <h3>Мои поездки</h3>

                    <ul className="trip-list-sidebar">
                        {trips.map(trip => (
                            <li
                                key={trip.id}
                                onClick={async () => {
                                    setSelectedTrip(trip)
                                    await loadBoards(trip.id)
                                }}
                                className={selectedTrip?.id === trip.id ? 'active' : ''}
                            >
                                {trip.title}
                            </li>
                        ))}
                    </ul>

                    <h3 className="mt">Мои борды</h3>

                    <ul className="boards-list">
                        {boards.map(board => (
                            <li
                                key={board.id}
                                onClick={() => setSelectedBoard(board)}
                                className={selectedBoard?.id === board.id ? 'active' : ''}
                            >
                                {board.title}
                            </li>
                        ))}
                    </ul>

                    <form onSubmit={handleCreateBoard} className="create-board-form">
                        <input
                            placeholder="Новый борд"
                            value={newBoardTitle}
                            onChange={e => setNewBoardTitle(e.target.value)}
                        />
                        <button type="submit">Создать</button>
                    </form>
                </aside>

                <main className="board-main">
                    {selectedBoard ? (
                        <>
                            <h2>{selectedBoard.title}</h2>
                            <Board boardId={selectedBoard.id} />
                        </>
                    ) : (
                        <p>Нет выбранного борда</p>
                    )}
                </main>

            </div>
        </div>
    )
}