import { useState, useRef } from 'react'
import './App.css'
import { Intro, Navbar, Project, Canvas } from './components';





function App() {

  return (
    <>
    <Intro></Intro>
      <Canvas>
        <Navbar></Navbar>
        
      </Canvas>
    </>
  )
}

export default App
