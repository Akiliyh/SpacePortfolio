import { useState, useRef } from 'react'
import './App.css'
import { Intro, Navbar, Project, Canvas, Title } from './components';





function App() {

  return (
    <>
    <Intro></Intro>
    <Navbar></Navbar>
      <Canvas>
        <Title></Title>
      </Canvas>
    </>
  )
}

export default App
