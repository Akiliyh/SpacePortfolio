import { useRef, useState } from 'react'
import './App.scss'
import { Intro, Navbar, Canvas, Title } from './components';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap'





function App() {

  const appContentRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<HTMLDivElement>(null);
  const [showAltPage, setShowAltPage] = useState(false);
  const [isInfoOver, setIsInfoOver] = useState(false);
  const [altPageType, setAltPageType] = useState('');

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
      delay: 3,
      duration: 2,
      ease: "expo.out",
      yPercent: 100,
      opacity: 0,
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
          yPercent: 80,
        })
      } else {
        tl.to(appContentRef.current, {
          duration: 2,
          ease: "expo.out",
          yPercent: 0,
        })
      }
    }


  }, [showAltPage, isInfoOver])


  return (
    <div ref={appRef}>
      <Intro></Intro>
      <div className="app-content" ref={appContentRef}>
        <Navbar toggleAltPage={(e: HTMLDivElement) => toggleAltPage(e)}></Navbar>
        <Canvas>
          <Title></Title>
        </Canvas>
      </div>
    </div>
  )
}

export default App
