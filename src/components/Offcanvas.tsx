import { useRef } from "react";
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SplitText } from "gsap/SplitText"

gsap.registerPlugin(useGSAP, SplitText);

type OffcanvasProps = {
    isOffcanvasMenuOpen: boolean,
    showAltPage: boolean,
    altPageType: string,
};

const Offcanvas = ({ isOffcanvasMenuOpen, showAltPage, altPageType }: OffcanvasProps) => {
    const offCanvasRef = useRef<HTMLDivElement>(null);
    const aboutTitleRef = useRef<HTMLDivElement>(null);
    const contactTitleRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.to(offCanvasRef.current, {
            duration: 1,
            ease: "expo.out",
            x: !isOffcanvasMenuOpen ? "100%" : "0%"
        });

    }, { dependencies: [isOffcanvasMenuOpen] });

    
    useGSAP(() => {

        if (isOffcanvasMenuOpen) {
            
        
        const aboutSplit = new SplitText(aboutTitleRef.current, { type: "chars" });
        const contactSplit = new SplitText(contactTitleRef.current, { type: "chars" });

        gsap.from(aboutSplit.chars, {
            duration: 2,
            ease: "expo.out",
            yPercent: 100,
            opacity: 0,
            stagger: 0.04,
        })

        gsap.from(contactSplit.chars, {
            duration: 2,
            ease: "expo.out",
            yPercent: 100,
            opacity: 0,
            stagger: 0.04,
        })
        }


    }, { dependencies: [isOffcanvasMenuOpen], scope: offCanvasRef });

    return (
        <div className="off-canvas-menu" ref={offCanvasRef}>
            <div className="content">
                <div className={((altPageType === "about") && (showAltPage)) ? "active about sub-tab" : "about sub-tab"}>
                <span ref={aboutTitleRef}>ABOUT</span>
                </div>
                <div className={((altPageType === "contact") && (showAltPage)) ? "active contact sub-tab" : "contact sub-tab"}>
                <span ref={contactTitleRef}>CONTACT</span>
                </div>
            <div className="boxes">
                <div className="red"></div>
                <div className="green"></div>
                <div className="blue"></div>
            </div>
            </div>


            <div className="copyrights">
                <span>©2025 - Guillaume Boucher</span>
            </div>
        </div>
    )
};

export default Offcanvas;
