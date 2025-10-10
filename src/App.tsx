import { useRef, useState, useEffect } from 'react'
import './App.scss'
import { Intro, Navbar, Canvas, Title, AltPage, InfoPanel } from './components';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap'
import { useMediaQuery } from 'react-responsive';

function App() {

  const appContentRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<HTMLDivElement>(null);
  const [showAltPage, setShowAltPage] = useState(false);
  const [isInfoOver, setIsInfoOver] = useState(false);
  const [altPageType, setAltPageType] = useState('');

  // Info Page elements
  const [isInfoDivMounted, setIsInfoDivMounted] = useState(false);
  const [showInfoDiv, setShowInfoDiv] = useState(false);
  type ProjectContent = {  title: string;  paragraph: string;  year: number;  image: string;  video: string;  link: string;  type: string;};

  const [projectContent, setProjectContent] = useState<ProjectContent>({ title: "",  paragraph: "",  year: 0,  image: "",  video: "",  link: "",  type: ""});

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

  const closeProjectClick = (() => {
        setShowInfoDiv(false);
    });

  const unmountInfoDiv = (() => {
      setIsInfoDivMounted(true);
  });

  useEffect(() => {
    console.log(isInfoDivMounted);
  }, [isInfoDivMounted])

  useEffect(() => {
    console.log(projectContent);
  }, [projectContent])

  useEffect(() => {
    console.log(showInfoDiv);
  }, [showInfoDiv])

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
        <Canvas isInfoDivMountedState={[isInfoDivMounted, setIsInfoDivMounted]} showInfoDivState={[showInfoDiv, setShowInfoDiv]} projectContentState={[projectContent, setProjectContent]} >
          <Title></Title>
        </Canvas>
      </div>
      {isInfoDivMounted &&
        <InfoPanel projectContent={projectContent} showInfoDiv={showInfoDiv} closeProjectClick={closeProjectClick} unmountInfoDiv={unmountInfoDiv}></InfoPanel>
      }
      <AltPage toggleAltPage={(e: HTMLDivElement) => toggleAltPage(e)} showAltPage={showAltPage} altPageType={altPageType}></AltPage>
    </div>
  )
}

export default App
