import { useRef, useState, useEffect } from 'react'
import './App.scss'
import { Intro, Navbar, Canvas, Title, AltPage, InfoPanel } from './components';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap'
import { useMediaQuery } from 'react-responsive';
import allProjects from "./projects.json";

const projects = allProjects.filter(p => !(p as { hidden?: boolean }).hidden); // "hidden": true in projects.json skips a project


function App() {

  const appContentRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<HTMLDivElement>(null);

  const initialPath = window.location.pathname.replace("/", "");

  const isKnownAlt = initialPath === "about" || initialPath === "contact" || initialPath === "projects";

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

    if (path && path != "contact" && path != "about" && path != "projects" && !path.startsWith("projects")) {
      window.location.replace("/");
    } else if (path && (path == "contact" || path == "about" || path == "projects")) {
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
    // only push when the URL is different, so back/forward (popstate) doesn't add new entries
    if (showInfoDiv && window.location.pathname !== projectContent.url)
      window.history.pushState({ projectContent: projectContent }, "", projectContent.url);
  }, [showInfoDiv, projectContent]);

  const toggleAltPage = (e: HTMLDivElement) => {
    const newType = e.classList[0];

    if (showAltPage && altPageType === newType) {
      // same tab clicked again (or "return to projects"): close the alt page
      setShowAltPage(false);
      window.history.pushState({}, "", "/");
    } else {
      // open the tab, or switch from one alt page to the other
      setAltPageType(newType);
      setShowAltPage(true);
      window.history.pushState({ altPageType: newType }, "", "/" + newType);
    }
  };

  // click on a line of the projects list: we go back to the canvas with the project panel open
  const openProjectFromList = (url: string) => {
    const found = projects.find(p => p.url === url);
    if (!found) return;

    setProjectContent(found);
    setIsInfoDivMounted(true);
    setShowInfoDiv(true);
    setShowAltPage(false);
    window.history.pushState({ projectContent: found }, "", found.url);
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
      gsap.killTweensOf(appContentRef.current);
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


  }, {dependencies : [showAltPage, isInfoOver]} )


  return (
    <div ref={appRef}>
      <Intro></Intro>
      <Navbar toggleAltPage={(e: HTMLDivElement) => toggleAltPage(e)} showAltPage={showAltPage} altPageType={altPageType}></Navbar>
      <AltPage toggleAltPage={(e: HTMLDivElement) => toggleAltPage(e)} showAltPage={showAltPage} altPageType={altPageType}
        projects={projects} currentUrl={projectContent.url} showInfoDiv={showInfoDiv} openProject={openProjectFromList}></AltPage>
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
