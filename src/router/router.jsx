import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import LoginPage from "../pages/LoginPage"
import RegisterPage from "../pages/RegisterPage"
import TripsPage from "../pages/TripsPage"
import TripDetailsPage from "../pages/TripDetailsPage"
import BoardDetailPage from "../pages/BoardDetailPage"

export default function Router() {

    return (

        <BrowserRouter>

            <Routes>

                <Route path="/" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/trips" element={<TripsPage/>}/>
                <Route path="/trips/:tripId" element={<TripDetailsPage/>}/>
                <Route path="/boards/:boardId" element={<BoardDetailPage/>}/>
                <Route path="*" element={<Navigate to="/" />} />

            </Routes>

        </BrowserRouter>

    )
}