import { Route, Routes } from "react-router-dom"
import SystemUpdate from "./SystemUpdate"
import HumanVerification from "./HumanVerification"
import EmergencyApp from "./EmergencyPop"

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HumanVerification/>}/>
        <Route path="/system-update" element={<SystemUpdate/>}/>
        <Route path="/secure" element={<EmergencyApp/>}/>

      </Routes>
    </div>
  )
}
export default App 