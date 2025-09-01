import { useRef, type MouseEventHandler } from "react"
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

type InfoPanelProps = {
    closeProjectClick: MouseEventHandler,
    showInfoDiv: boolean,
    unmountInfoDiv: Function
};

const InfoPanel = ({ closeProjectClick, showInfoDiv, unmountInfoDiv }: InfoPanelProps) => {
    const infoDivRef = useRef<HTMLDivElement>(null);
    const backgroundFallbackRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {

        if (showInfoDiv) {
            gsap.to(infoDivRef.current, { height: window.innerHeight, y: 0, duration: 1.5, ease: "expo.out" });
            gsap.set(backgroundFallbackRef.current, { height: window.innerHeight});
            gsap.to(backgroundFallbackRef.current, { autoAlpha: .2, y: 0, duration: 1.5, ease: "expo.out" });
        } else {
            gsap.to(infoDivRef.current, { height: 0, duration: 1.5, ease: "expo.out", onComplete: () => { unmountInfoDiv } });
            gsap.to(backgroundFallbackRef.current, { autoAlpha: 0, duration: .5, ease: "expo.out" });
            gsap.set(backgroundFallbackRef.current, { height: 0, autoAlpha: 0, delay: .1});
        }


    }, { dependencies: [showInfoDiv], scope: containerRef });

    return (
        <div ref={containerRef}>
            <div className="background-fallback" onClick={closeProjectClick} ref={backgroundFallbackRef}></div>
            <div className="info" ref={infoDivRef}></div>
        </div>
    )
};

export default InfoPanel;
