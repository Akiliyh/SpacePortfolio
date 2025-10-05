import { useEffect, useRef, useState } from 'react'
import './App.scss'
import { Intro, Navbar, Canvas, Title, AltPage } from './components';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap'
import { useMediaQuery } from 'react-responsive';




function App() {

  const appContentRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<HTMLDivElement>(null);
  const [showAltPage, setShowAltPage] = useState(false);
  const [isInfoOver, setIsInfoOver] = useState(false);
  const [altPageType, setAltPageType] = useState('');

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  // const { contextSafe } = useGSAP({ scope: appRef });

  const toggleAltPage = (e: HTMLDivElement) => {
    // get altPageType
    // console.log(e.classList[0]);


    if (altPageType != e.classList[0]) {
      setAltPageType(e.classList[0]);
    }


    if (showAltPage) {
      console.log(altPageType);
      console.log(e.classList[0]);
      if (altPageType == e.classList[0]) {
        setShowAltPage(false);
      }

    } else {
      setShowAltPage(true);
    }


  };

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from(appContentRef.current, {
      delay: isMobile ? 2 : 3,
      duration: 2,
      ease: "expo.out",
      yPercent: 100,
      opacity: 0,
      scaleX: 0.8,
      rotationX: 80,
      transformOrigin: "50% 100% -200px",
      onComplete: () => {
        setIsInfoOver(true);
      }
    })
  })

  useGSAP(() => {
    if (isInfoOver) {


      const tl = gsap.timeline();
      if (showAltPage) {
        tl.to(appContentRef.current, {
          duration: 2,
          ease: "expo.out",
          yPercent: 100,
          scaleX: 0.8,
          rotationX: 80,
          transformOrigin: "50% 100% -200px",
        })
      } else {
        tl.to(appContentRef.current, {
          duration: 2,
          ease: "expo.out",
          yPercent: 0,
          scaleX: 1,
          rotationX: 0
        })
      }
    }


  }, [showAltPage, isInfoOver])


  return (
    <div ref={appRef}>
      <Intro></Intro>
      <Navbar toggleAltPage={(e: HTMLDivElement) => toggleAltPage(e)} showAltPage={showAltPage} altPageType={altPageType}></Navbar>
      <div className="app-content" ref={appContentRef}>
        <Canvas>
          <Title></Title>
        </Canvas>
      </div>
      <AltPage toggleAltPage={(e: HTMLDivElement) => toggleAltPage(e)} showAltPage={showAltPage} altPageType={altPageType}></AltPage>
    </div>
  )
}

export default App
