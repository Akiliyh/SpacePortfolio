import type { PropsWithChildren } from "react"
import { useEffect, useRef, useState } from "react"
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { Project, Flag, InfoPanel } from "./index"

gsap.registerPlugin(useGSAP, Draggable, InertiaPlugin); // register the hook to avoid React version discrepancies 

const Canvas = ({ children }: PropsWithChildren) => {

    const backgroundRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [showFlag, setShowFlag] = useState(false);

    const [showInfoDiv, setShowInfoDiv] = useState(false);
    const [isInfoDivMounted, setIsInfoDivMounted] = useState(false);
    
    const CANVASSIZE = 1000000;
    const PROJECTSAMOUNT = 20;
    const PROJECTWIDTH = 320;
    const PROJECTHEIGHT = 160;

    // const projects: { x: number; y: number }[] = [];

    const { contextSafe } = useGSAP({ scope: containerRef });

    const randomIntFromInterval = ((min: number, max: number): number => { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min);
    })

    // for (let i = 0; i < PROJECTSAMOUNT; i++) {

    //     projects.push({ x: randomIntFromInterval(CANVASSIZE - 1000, CANVASSIZE + 1000), y: randomIntFromInterval(CANVASSIZE - 1000, CANVASSIZE + 1000) });

    // }

    const projectsRef = useRef<{ x: number; y: number }[]>([]);
    if (projectsRef.current.length === 0) {
        const randomIntFromInterval = (min: number, max: number) =>
            Math.floor(Math.random() * (max - min + 1) + min);

        for (let i = 0; i < PROJECTSAMOUNT; i++) {
            projectsRef.current.push({
                x: randomIntFromInterval(CANVASSIZE - 1000, CANVASSIZE + 1000),
                y: randomIntFromInterval(CANVASSIZE - 1000, CANVASSIZE + 1000),
            });
        }

        projectsRef.current.push({
                x: CANVASSIZE + (window.innerWidth / 2) - 320/2,
                y: CANVASSIZE + (window.innerHeight / 2) - 180/2,
            });
    }

    useGSAP(() => {
        Draggable.create(backgroundRef.current, {
            type: "x,y",
            inertia: true,
            dragResistance: 0.75,
            onDrag: function () {
                // if element goes too far then we display the flag icon
                if (Math.abs(this.x) > (window.innerWidth) || Math.abs(this.y) > (window.innerHeight)) {
                    setShowFlag(true);
                } else {
                    setShowFlag(false);
                }
                console.log(this.x, this.y, window.innerHeight, window.innerWidth);

            },
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    gsap.to(entry.target, { opacity: 1, scale: 1, rotate: 0, duration: 1, ease: "power2.inOut" });
                } else {
                    gsap.to(entry.target, { opacity: 0, scale: 0.6, rotate: randomIntFromInterval(-30, 30), duration: 1, ease: "power2.inOut" });
                }
            });
        }, { threshold: 0.5 });

        // attach observer to elements in the scope
        containerRef.current?.querySelectorAll('.project-cards').forEach(el => {
            observer.observe(el);
        });

        return () => {
            observer.disconnect();
        };


    }, { scope: containerRef }); // <-- scope is for selector text (optional)

    const handleProjectClick = contextSafe((index: number) => {

        // Putting the project on the left corner in view (TO CHANGE FOR MOBILE)

        const curProjectX = projectsRef.current[index].x - (1000000 + (window.innerWidth / 6) - PROJECTWIDTH / 2); // /6 cause we want it on the left side to be visible div is 33vw
        const curProjectY = projectsRef.current[index].y - (1000000 + (window.innerHeight / 2) - PROJECTHEIGHT / 2);

        console.log(curProjectX, curProjectY);
        gsap.to(backgroundRef.current, { x: -curProjectX, y: -curProjectY, duration: 2, ease: "expo.out" });
        if (showInfoDiv) {
            setShowInfoDiv(false);
        } 
        else {
            setIsInfoDivMounted(true);
            setShowInfoDiv(true);
        }
    
  });

  const closeProjectClick = contextSafe(() => {
            setShowInfoDiv(false);
  });

  const unmountInfoDiv = contextSafe(() => {
            setIsInfoDivMounted(true);
  });

    return (
        <div className="container" ref={containerRef}>

            <div ref={backgroundRef} className="backgroundCanvas">
                {projectsRef.current.map((project, index) => (
                    <Project key={index} project={project} index={index} handleClick={() => handleProjectClick(index)} projectWidth={PROJECTWIDTH} projectHeight={PROJECTHEIGHT}></Project>
                ))}
                {children}
            </div>
            <Flag showFlag={showFlag} backgroundRef={backgroundRef}></Flag>

            <div className="crosshair" style={{position: 'absolute', zIndex: '9999999', top: '50%', backgroundColor: 'blue', width: '10px', height: '10px', left: '50%', borderRadius: '50px'}}></div>

            {isInfoDivMounted && 
            <InfoPanel showInfoDiv={showInfoDiv} closeProjectClick={closeProjectClick} unmountInfoDiv={unmountInfoDiv}></InfoPanel>
            }

        </div>
    )
};

export default Canvas;
