import { useRef } from 'react'
import './App.css'
import { Intro, Navbar, Canvas, Title } from './components';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap'





function App() {

  const appContentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from(appContentRef.current, {
      delay: 3,
      duration: 2,
      ease: "expo.out",
      yPercent: 100,
      opacity: 0,
    })
  })


  return (
    <>
      <Intro></Intro>
      <div className="app-content" ref={appContentRef}>
        <Navbar></Navbar>
        <Canvas>
          <Title></Title>
        </Canvas>
      </div>
    </>
  )
}

export default App
