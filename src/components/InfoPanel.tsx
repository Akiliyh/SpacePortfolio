import { useEffect, useRef, useState, type MouseEventHandler } from "react"
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import logo from '../assets/GBRDrop.png';
import { FaReact } from "react-icons/fa";
import { SiExpo } from "react-icons/si";
import { RxCross2 } from "react-icons/rx";
import { Button } from "./index"
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useMediaQuery } from 'react-responsive';

gsap.registerPlugin(ScrollToPlugin);

type InfoPanelProps = {
    closeProjectClick: MouseEventHandler,
    showInfoDiv: boolean,
    unmountInfoDiv: Function,
    projectContent: { title: string, paragraph: string, year: string, image: string, video: string, link: string, type: string, images: Array<string> };
};

const InfoPanel = ({ closeProjectClick, showInfoDiv, unmountInfoDiv, projectContent }: InfoPanelProps) => {
    const infoDivRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const backgroundFallbackRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [isVideoPlaying, setIsVideoPlaying] = useState(true);

    const isMobile = useMediaQuery({ query: '(min-width: 767px)' });

    useEffect(() => {
        if (isVideoPlaying) {
            videoRef.current?.play();
        } else {
            videoRef.current?.pause();
        }

    }, [isVideoPlaying])

    useEffect(() => {
        if (isVideoPlaying) {
            videoRef.current?.play();
        } else {
            videoRef.current?.pause();
        }

    }, [unmountInfoDiv])

    const handleVideoClick = () => {
        if (isVideoPlaying) {
            setIsVideoPlaying(false);
        } else {
            setIsVideoPlaying(true);
        }
    };

    useGSAP(() => {

        if (showInfoDiv) {
            gsap.to(infoDivRef.current, { y: "100vh", duration: .5, scrollTo: 0, ease: "expo.out" });
            gsap.to(infoDivRef.current, { y: 0, paddingTop: 0, paddingBottom: 10, duration: 1.5, ease: "expo.out" });
            gsap.set(backgroundFallbackRef.current, { height: "100vh" });
            gsap.to(backgroundFallbackRef.current, { autoAlpha: .2, y: 0, duration: 1.5, ease: "expo.out" });
        } else {
            gsap.to(infoDivRef.current, { y: "100vh", paddingTop: 0, paddingBottom: 0, duration: 1.5, ease: "expo.out", onComplete: () => { unmountInfoDiv } });
            gsap.to(backgroundFallbackRef.current, { autoAlpha: 0, duration: .5, ease: "expo.out" });
            gsap.set(backgroundFallbackRef.current, { height: 0, autoAlpha: 0, delay: .1 });
        }


    }, { dependencies: [showInfoDiv], scope: containerRef });

    return (
        <div ref={containerRef} className="info-container">
            <div className="background-fallback" onClick={closeProjectClick} ref={backgroundFallbackRef}></div>
            <div className="info" ref={infoDivRef}>
                <div className="topbar">
                    <div className="logo">
                        <h1 className="tag">GBR</h1>
                        <img src={logo} alt="" />
                    </div>
                    <div className="cross" onClick={closeProjectClick}>
                        <RxCross2 size={25} />
                    </div>
                </div>

                <div className="content">
                    <video onClick={handleVideoClick} ref={videoRef} key={projectContent.video} className="video" autoPlay muted loop disablePictureInPicture>
                        <source src={"video" + projectContent.video} type="video/mp4" />
                    </video>
                    <div className="text-content">
                        <div>
                            <div className="row">
                                <h2 className="title">{projectContent.title}</h2>
                                <h2 className="type">{projectContent.type}</h2>
                                <h2 className="year">{projectContent.year}</h2>
                            </div>
                            <div className="row">
                                <p>{projectContent.paragraph}</p>
                            </div>
                            { projectContent.images.length != 0 &&
                            <div className="row image-gallery">
                                {projectContent.images.map((el, i) => (
                                    <img className={i.toString()} src={"img" + el} alt="" />
                                ))}
                            </div>
                            }
                            <div className="row technologies">
                                <span>Technologies</span>
                                <div className="icons">
                                    <FaReact size={30} />
                                    <SiExpo size={30} />
                                </div>
                            </div>
                        </div>
                        <Button href={projectContent.link} positionSticky={true}>{isMobile ? "View Link" : ""}</Button>
                    </div>
                </div>

            </div>
        </div>
    )
};

export default InfoPanel;
