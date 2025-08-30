import type { PropsWithChildren } from "react"
import { useEffect, useRef, useState } from "react"
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { IoFlag } from "react-icons/io5";
import { Project } from "./index"

gsap.registerPlugin(useGSAP, Draggable, InertiaPlugin); // register the hook to avoid React version discrepancies 

const Canvas = ({ children }: PropsWithChildren) => {

    const backgroundRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [showFlag, setShowFlag] = useState(false);
    const CANVASSIZE = 1000000;
    const PROJECTSAMOUNT = 20;

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
    }

    useGSAP(() => {
        // // gsap code here...
        // gsap.to('.box', { x: 360 }); // <-- automatically reverted
        Draggable.create(backgroundRef.current, {
            type: "x,y",
            inertia: true,
            dragResistance: 0.75,
            onDrag: function () {
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

    useGSAP(() => {

        if (showFlag) {
            gsap.to(buttonRef.current, { autoAlpha: 1, y: 0, duration: 1.5, ease: "expo.out" });
        } else {
            gsap.to(buttonRef.current, { autoAlpha: 0, y: 20, duration: .5, ease: "expo.in" });
        }


    }, { dependencies: [showFlag], scope: containerRef }); // <-- scope is for selector text (optional)

    useEffect(() => {

    }, []);

    return (
        <div className="container" ref={containerRef}>

            <div ref={backgroundRef} className="backgroundCanvas">
                {projectsRef.current.map((project, index) => (
                    <Project key={index} project={project} index={index}></Project>
                ))}
                {children}
            </div>
            <button className="center-button" title="Return back to origin" ref={buttonRef} onClick={() => {
                gsap.to(backgroundRef.current, { x: 0, y: 0, duration: 2, ease: "power2.inOut" });
                gsap.to(buttonRef.current, { autoAlpha: 0, y: 20, duration: .5, ease: "power2.inOut" });
            }}>
                <svg width="0em" height="0em">
                    <linearGradient id="icon-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
                        <stop stopColor="#9DAEF2" offset="0%" />
                        <stop stopColor="#9BF0AF" offset="50%" />
                        <stop stopColor="#F4A5A7" offset="100%" />
                    </linearGradient>
                </svg>

                <IoFlag style={{ fill: "url(#icon-gradient)" }} />

            </button>
        </div>
    )
};

export default Canvas;
