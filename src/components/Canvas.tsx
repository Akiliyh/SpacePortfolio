import type { PropsWithChildren } from "react"
import { useRef } from "react"
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";

gsap.registerPlugin(useGSAP, Draggable, InertiaPlugin); // register the hook to avoid React version discrepancies 

const Canvas = ({ children }: PropsWithChildren) => {

    const backgroundRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const CANVASSIZE = 1000000;
    const PROJECTSAMOUNT = 20;

    const projects: { x: number; y: number }[] = [];

    function randomIntFromInterval(min: number, max: number): number { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    for (let i = 0; i < PROJECTSAMOUNT; i++) {

        projects.push({ x: randomIntFromInterval(CANVASSIZE - 1000, CANVASSIZE + 1000), y: randomIntFromInterval(CANVASSIZE - 1000, CANVASSIZE + 1000) });

    }

    useGSAP(() => {
        // gsap code here...
        gsap.to('.box', { x: 360 }); // <-- automatically reverted
        Draggable.create(backgroundRef.current, {
            type: "x,y",
            inertia: true,
            dragResistance: 0.75
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    gsap.to(entry.target, { opacity: 1, scale: 1, rotate: 90, duration: 0.4, ease: "power2.inOut" });
                } else {
                    gsap.to(entry.target, { opacity: 0.1, scale: 0.8, rotate: randomIntFromInterval(60, 120), duration: 0.4, ease: "power2.inOut" });
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

    return (
        <div className="container" ref={containerRef}>

            <div ref={backgroundRef} className="backgroundCanvas">
                <div className="box"></div>
                {projects.map((project, index) => (
                    <div className="project-cards"
                        key={index}
                        style={{
                            position: "absolute",
                            left: project.x,
                            top: project.y,
                            width: 50,
                            height: 50,
                            backgroundColor: "red",
                        }}
                    />
                ))}
                {children}
            </div>
        </div>
    )
};

export default Canvas;
