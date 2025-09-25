import type { PropsWithChildren } from "react"
import { useRef, useState } from "react"
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { Project, Flag, InfoPanel } from "./index"
import projects from "../projects.json";

gsap.registerPlugin(useGSAP, Draggable, InertiaPlugin); // register the hook to avoid React version discrepancies 

const Canvas = ({ children }: PropsWithChildren) => {

    const backgroundRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [showFlag, setShowFlag] = useState(false);
    const [projectSelectedIndex, setProjectSelectedIndex] = useState(0);

    const [showInfoDiv, setShowInfoDiv] = useState(false);
    const [isInfoDivMounted, setIsInfoDivMounted] = useState(false);

    const CANVASSIZE = 1000000;
    const PROJECTWIDTH = 320;
    const PROJECTHEIGHT = 180;
    const SAFEZONESIZE = 200;

    // const projects: { x: number; y: number }[] = [];

    const { contextSafe } = useGSAP({ scope: containerRef });

    const randomIntFromInterval = ((min: number, max: number): number => { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min);
    })

    // for (let i = 0; i < PROJECTSAMOUNT; i++) {

    //     projects.push({ x: randomIntFromInterval(CANVASSIZE - 1000, CANVASSIZE + 1000), y: randomIntFromInterval(CANVASSIZE - 1000, CANVASSIZE + 1000) });

    // }

    const projectsRef = useRef<{ x: number; y: number }[]>([]);
    const safeLeft: number = CANVASSIZE + (window.innerWidth / 2) - SAFEZONESIZE - PROJECTWIDTH;
    const safeRight: number = CANVASSIZE + (window.innerWidth / 2) + SAFEZONESIZE;
    const safeTop: number = CANVASSIZE + (window.innerHeight / 2) - SAFEZONESIZE - PROJECTHEIGHT;
    const safeBottom: number = CANVASSIZE + (window.innerHeight / 2) + SAFEZONESIZE;

    const lowestXValue: number = CANVASSIZE - (window.innerWidth / 2) - SAFEZONESIZE;
    const lowestYValue: number = CANVASSIZE - (window.innerHeight / 2) - SAFEZONESIZE;
    const highestXValue: number = CANVASSIZE + (window.innerWidth / 2) + SAFEZONESIZE + PROJECTWIDTH;
    const highestYValue: number = CANVASSIZE + (window.innerHeight / 2) + SAFEZONESIZE + PROJECTHEIGHT;

    if (projectsRef.current.length === 0) {
        const randomIntFromInterval = (min: number, max: number) =>
            Math.floor(Math.random() * (max - min + 1) + min);

        const isOverlapping = (x: number, y: number, buffer: number) => {
            for (let i = 0; i < projectsRef.current.length; i++) {
                const p = projectsRef.current[i];

                const overlaps =
                    x < p.x + PROJECTWIDTH + buffer &&
                    x + PROJECTWIDTH + buffer > p.x &&
                    y < p.y + PROJECTHEIGHT + buffer &&
                    y + PROJECTHEIGHT + buffer > p.y;

                if (overlaps) {
                    return true; 
                }
            }

            return false;
        };

        for (let i = 0; i < projects.length; i++) {
            let newX: number = randomIntFromInterval(lowestXValue, highestXValue);
            let newY: number = randomIntFromInterval(lowestYValue, highestYValue);

            do {
                newX = randomIntFromInterval(lowestXValue, highestXValue);
                newY = randomIntFromInterval(lowestYValue, highestYValue);
            }
            while (
                (newX > safeLeft
                    && newX < safeRight
                    && newY > safeTop
                    && newY < safeBottom
                ) || isOverlapping(newX, newY, 10)
            )

            projectsRef.current.push({
                x: newX,
                y: newY,
            });
        }

        // CENTER OF THE SCENE

        // projectsRef.current.push({
        //         x: CANVASSIZE + (window.innerWidth / 2) - PROJECTWIDTH / 2,
        //         y: CANVASSIZE + (window.innerHeight / 2) - PROJECTHEIGHT / 2,
        //     });

        // projectsRef.current.push({
        //         x: CANVASSIZE + (window.innerWidth / 2),
        //         y: CANVASSIZE + (window.innerHeight / 2),
        //     });

        console.log(projectsRef.current);
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
                // console.log(this.x, this.y, window.innerHeight, window.innerWidth);

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
        gsap.to(backgroundRef.current, { x: -curProjectX, y: -curProjectY, duration: 1.5, ease: "power2.inOut" });
        if (showInfoDiv) {
            setShowInfoDiv(false);
        }
        else {
            setIsInfoDivMounted(true);
            setShowInfoDiv(true);
        }

        setProjectSelectedIndex(index);

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
                {projects.map((project, index) => (
                    <>
                        <Project key={index} project={project} coord={projectsRef.current[index]} index={index} handleClick={() => handleProjectClick(index)} projectWidth={PROJECTWIDTH} projectHeight={PROJECTHEIGHT}></Project>
                    </>
                ))}
                {children}
            </div>
            <Flag showFlag={showFlag} backgroundRef={backgroundRef}></Flag>

            {/*  */}
            {/* <div className="crosshair" style={{position: 'absolute', zIndex: '9999999', top: '50%', backgroundColor: 'blue', width: '10px', height: '10px', left: '50%', borderRadius: '50px'}}></div> */}

            {isInfoDivMounted &&
                <InfoPanel projectContent={projects[projectSelectedIndex]} showInfoDiv={showInfoDiv} closeProjectClick={closeProjectClick} unmountInfoDiv={unmountInfoDiv}></InfoPanel>
            }

        </div>
    )
};

export default Canvas;
