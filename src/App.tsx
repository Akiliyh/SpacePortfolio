import { useRef, useState, useEffect } from 'react'
import './App.scss'
import { Intro, Navbar, Canvas, Title, AltPage, InfoPanel } from './components';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap'
import { useMediaQuery } from 'react-responsive';
import projects from "./projects.json";


function App() {

  const appContentRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<HTMLDivElement>(null);

  const initialPath = window.location.pathname.replace("/", "");

  const isKnownAlt = initialPath === "about" || initialPath === "contact";

  const [showAltPage, setShowAltPage] = useState(isKnownAlt);
  const [isInfoOver, setIsInfoOver] = useState(false);
  const [altPageType, setAltPageType] = useState('');

  // Info Page elements
  const [isInfoDivMounted, setIsInfoDivMounted] = useState(false);
  const [showInfoDiv, setShowInfoDiv] = useState(false);
  type ProjectContent = { title: string; paragraph: string; year: string; image: string; video: string; link: string; type: string; images: Array<string>, technos: Array<string>, url: string };

  const [projectContent, setProjectContent] = useState<ProjectContent>({ title: "", paragraph: "", year: "0", image: "", video: "", link: "", type: "", images: [''], technos: [''], url: '' });

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  // const { contextSafe } = useGSAP({ scope: appRef });

  // make direct links work

  useEffect(() => {

    // we dynamically redirect to home if unknown

    const path = window.location.pathname.replace("/", "");

    if (path && path != "contact" && path != "about" && !path.startsWith("projects")) {
      window.location.replace("/");
    } else if (path && !path.startsWith("projects")) {
      setAltPageType(path);
      setShowAltPage(true);
      window.history.replaceState({ altPageType: path }, "", `/${path}`);
    }
  }, []);

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/projects/")) {
      const slug = path.replace("/projects/", "");
      const found = projects.find(p => p.url === `/projects/${slug}`);
      if (found) {
        console.log(found);
        setProjectContent(found);
        setIsInfoDivMounted(true);
        setTimeout(() => {
          setShowInfoDiv(true);
        }, 3000);

        window.history.replaceState({ projectContent: found }, "", path);
      }
    }
  }, []);

  // make back buttons work

  useEffect(() => {
  const handlePopState = (event: PopStateEvent) => {
    const state = event.state;

    if (!state) {
      setShowAltPage(false);
      setShowInfoDiv(false);
      return;
    }

    if (state.altPageType) {
      setAltPageType(state.altPageType);
      setShowAltPage(true);
    } else {
      setShowAltPage(false);
    }

    if (state.projectContent) {
      setProjectContent(state.projectContent);
      setIsInfoDivMounted(true);
      setShowInfoDiv(true);
    } else {
      setShowInfoDiv(false);
    }
  };

  window.addEventListener("popstate", handlePopState);
  return () => window.removeEventListener("popstate", handlePopState);
}, []);


  useEffect(() => {
    if (showInfoDiv)
      window.history.pushState({ projectContent: projectContent }, "", projectContent.url);
  }, [showInfoDiv]);

  const toggleAltPage = (e: HTMLDivElement) => {
    // get altPageType
    // console.log(e.classList[0]);
    const newType = e.classList[0];


    if (altPageType === newType) {
    setShowAltPage(false);
    window.history.pushState({}, "", "/");
  } else {
    setAltPageType(newType);
    setShowAltPage(true);
    window.history.pushState({ altPageType: newType }, "", `/${newType}`);
  }

    if (showAltPage) {
      console.log(altPageType);
      console.log(newType);
      if (altPageType == newType) {
        setShowAltPage(false);
        window.history.pushState({ altPageType: null }, "", "/");
      }

    } else {
      setShowAltPage(true);
      window.history.pushState({ altPageType: newType }, "", newType);
    }
  };

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from(appContentRef.current, {
      delay: isMobile ? 2 : (showAltPage ? 0 : 3),
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

    if (window.location.pathname.startsWith("/projects/")) {
      window.history.pushState({}, "", "/");
    }
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
          duration: isMobile ? 0 : 2,
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
      <AltPage toggleAltPage={(e: HTMLDivElement) => toggleAltPage(e)} showAltPage={showAltPage} altPageType={altPageType}></AltPage>
      <div className="app-content" ref={appContentRef}>
        <Canvas isInfoDivMountedState={[isInfoDivMounted, setIsInfoDivMounted]} showAltPage={showAltPage} showInfoDivState={[showInfoDiv, setShowInfoDiv]} projectContentState={[projectContent, setProjectContent]} >
          <Title></Title>
        </Canvas>
      </div>
      {isInfoDivMounted &&
        <InfoPanel projectContent={projectContent} showInfoDiv={showInfoDiv} closeProjectClick={closeProjectClick} unmountInfoDiv={unmountInfoDiv}></InfoPanel>
      }
    </div>
  )
}

export default App
