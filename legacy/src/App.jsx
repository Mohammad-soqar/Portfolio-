import './App.css'
import { HashRouter as Router, Routes, Route } from "react-router-dom"
import { Landing } from './pages/Landing'
import { Navbar } from './components/Navbar'
import { Layout } from './components/Layout'
import { ProjectDetails } from './pages/ProjectDetails'



function App() {



  return (
    <Router>
      <Routes>
        <Route path="/project/:id" Component={ProjectDetails} />

        <Route element={<Layout />}>
          <Route path='/' element={<Landing />} />


        </Route>
      </Routes>
    </Router>
  )
}

export default App
