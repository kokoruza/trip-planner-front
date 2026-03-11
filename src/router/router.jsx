import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import LoginPage from "../pages/LoginPage"
import RegisterPage from "../pages/RegisterPage"
import TripsPage from "../pages/TripsPage"
import TripDetailsPage from "../pages/TripDetailsPage"
import BoardDetailPage from "../pages/BoardDetailPage"
import ProfilePage from "../pages/ProfilePage"
import JoinTripPage from "../pages/JoinTripPage"
import PollsPage from "../pages/PollsPage"
import GalleryPage from "../pages/GalleryPage"
import CalendarPage from "../pages/CalendarPage"

export default function Router() {

    return (

        <BrowserRouter>

            <Routes>

                <Route path="/" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/profile" element={<ProfilePage/>}/>
                <Route path="/profile/:accountId" element={<ProfilePage/>}/>
                <Route path="/trips" element={<TripsPage/>}/>
                <Route path="/trips/:tripId" element={<TripDetailsPage/>}/>
                <Route path="/trips/:tripId/polls" element={<PollsPage/>}/>
                <Route path="/trips/:tripId/gallery" element={<GalleryPage/>}/>
                <Route path="/trips/:tripId/calendar" element={<CalendarPage/>}/>
                <Route path="/join/:tripId" element={<JoinTripPage/>}/>
                <Route path="/boards/:boardId" element={<BoardDetailPage/>}/>
                <Route path="*" element={<Navigate to="/" />} />

            </Routes>

        </BrowserRouter>

    )
}