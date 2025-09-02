import { useRef, type MouseEventHandler } from "react"
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import logo from '../assets/GBRDrop.png';
import { FaReact } from "react-icons/fa";
import { SiExpo } from "react-icons/si";

type InfoPanelProps = {
    closeProjectClick: MouseEventHandler,
    showInfoDiv: boolean,
    unmountInfoDiv: Function,
    projectContent: { title: string, paragraph: string, year: number, image: string, video: string, link: string, type: string };
};

const InfoPanel = ({ closeProjectClick, showInfoDiv, unmountInfoDiv, projectContent }: InfoPanelProps) => {
    const infoDivRef = useRef<HTMLDivElement>(null);
    const backgroundFallbackRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    console.log(projectContent);

    useGSAP(() => {

        if (showInfoDiv) {
            gsap.to(infoDivRef.current, { height: window.innerHeight - 20, y: 0, duration: 1.5, ease: "expo.out" });
            gsap.set(backgroundFallbackRef.current, { height: window.innerHeight });
            gsap.to(backgroundFallbackRef.current, { autoAlpha: .2, y: 0, duration: 1.5, ease: "expo.out" });
        } else {
            gsap.to(infoDivRef.current, { height: 0, duration: 1.5, ease: "expo.out", onComplete: () => { unmountInfoDiv } });
            gsap.to(backgroundFallbackRef.current, { autoAlpha: 0, duration: .5, ease: "expo.out" });
            gsap.set(backgroundFallbackRef.current, { height: 0, autoAlpha: 0, delay: .1 });
        }


    }, { dependencies: [showInfoDiv], scope: containerRef });

    return (
        <div ref={containerRef}>
            <div className="background-fallback" onClick={closeProjectClick} ref={backgroundFallbackRef}></div>
            <div className="info" ref={infoDivRef}>
                <div className="topbar">
                    <div className="logo">
                        <h1 className="tag">GBR</h1>
                        <img src={logo} alt="" />
                    </div>
                    <div className="cross"></div>
                </div>

                <div className="content">
                    {/* TODO ONCLICK PAUSE VIDEO */}
                    <video key={projectContent.video} className="video" autoPlay muted loop disablePictureInPicture>
                        <source src={"video" + projectContent.video} type="video/mp4" />
                    </video>
                    <div className="row">
                        <h2 className="title">{projectContent.title}</h2>
                        <h2 className="year">{projectContent.year}</h2>
                        <h2 className="type">{projectContent.type}</h2>
                        <a className="link" href={projectContent.link}></a>
                    </div>
                    <div className="row">
                        <p>{projectContent.paragraph}</p>
                    </div>
                    <div className="row">
                        <div className="icons">
                            <FaReact />
                            <SiExpo />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
};

export default InfoPanel;
