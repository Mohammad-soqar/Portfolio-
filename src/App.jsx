import './App.css'
import { HashRouter as Router, Routes, Route } from "react-router-dom"


import { Landing } from './pages/Landing'
//import { ProjectDetails } from './pages/ProjectDetails'

import { Navbar } from './components/Navbar'
import { Layout } from './components/Layout'



function App() {



  return (
    <Router>
      <Routes>
      
        <Route element={<Layout />}>
          <Route path='/' element={<Landing />} />
          {/* <Route path='/projectdetails' element={<ProjectDetails />} /> */}
        
        </Route>

      </Routes>
    </Router>
  )
}

export default App
