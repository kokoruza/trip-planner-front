import Router from "./router/router"
import { AuthProvider } from "./auth/AuthContext"

export default function App() {

    return (

        <AuthProvider>

            <Router/>

        </AuthProvider>

    )
}