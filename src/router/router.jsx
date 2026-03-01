import { BrowserRouter, Routes, Route } from "react-router-dom"

import LoginPage from "../pages/LoginPage"
import RegisterPage from "../pages/RegisterPage"
import BoardPage from "../pages/BoardPage"

export default function Router() {

    return (

        <BrowserRouter>

            <Routes>

                <Route path="/" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/boards" element={<BoardPage/>}/>

            </Routes>

        </BrowserRouter>

    )
}