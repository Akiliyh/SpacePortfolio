import { RxCross2 } from "react-icons/rx";
import { useRef } from "react";
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

type OffcanvasProps = {
    handleBurgerClick: (e: HTMLDivElement) => void,
    isOffcanvasMenuOpen: boolean;
};

const Offcanvas = ({ handleBurgerClick, isOffcanvasMenuOpen }: OffcanvasProps) => {
    const offCanvasRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.to(offCanvasRef.current, {
            duration: 1,
            ease: "expo.out",
            x: isOffcanvasMenuOpen ? "100%" : "0%"
        });
    }, { dependencies: [isOffcanvasMenuOpen] });

    return (
        <div className="off-canvas-menu" ref={offCanvasRef}>
            <div className="content">
                <span>ABOUT</span>
                <span>CONTACT</span>
            <div className="boxes">
                <div className="red"></div>
                <div className="green"></div>
                <div className="blue"></div>
            </div>
            </div>

            

            <div className="cross" onClick={(e) => handleBurgerClick(e.currentTarget)}>

                <RxCross2 size={25} color="black" />
            </div>

            <div className="copyrights">
                <span>©2025 - Guillaume Boucher</span>
            </div>
        </div>
    )
};

export default Offcanvas;
