import { Routes,Route } from "react-router"
import LandingPage from "./pages/LandingPage"
import UserProvider from "./context/UserContext"
import DashBoard from "./pages/DashBoard"
const App=()=>{
  return (
    <UserProvider>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path="/dashboard" element={<DashBoard />} />
      </Routes>
    </UserProvider>
  
  )
}
export default App