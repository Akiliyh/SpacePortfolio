import { useEffect, useRef, useState } from "react"
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import logo from '../assets/GBRDrop.png';
import { RxCross2 } from "react-icons/rx";
import { Button } from "./index"
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useMediaQuery } from 'react-responsive';
import React from "react";
import { iconMap } from "../technoIcons";

gsap.registerPlugin(ScrollToPlugin);

type InfoPanelProps = {
    closeProjectClick: (e?: React.SyntheticEvent) => void,
    showInfoDiv: boolean,
    unmountInfoDiv: () => void,
    projectContent: { title: string, paragraph: string, year: string, image: string, video: string, link: string, type: string, images: Array<string>, technos: Array<string> };
};

const InfoPanel = ({ closeProjectClick, showInfoDiv, unmountInfoDiv, projectContent }: InfoPanelProps) => {
    const infoDivRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const backgroundFallbackRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const hasInitRef = useRef(false);

    const [isVideoPlaying, setIsVideoPlaying] = useState(true);

    const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

    // we remove the tab possibilities when the div is not active

    useEffect(() => {
        const contentEl = containerRef.current;
        if (!contentEl) return;

        // we get all the focusable elemets
        const focusable = contentEl.querySelectorAll<HTMLElement>(
            'a[href], button, video, textarea, input, select, svg[tabindex], [tabindex]:not([tabindex="-1"])'
        );

        focusable.forEach((el) => {
            if (showInfoDiv) {
                el.setAttribute("tabindex", "0");
            } else {
                el.setAttribute("tabindex", "-1");
            }
        });
    }, [showInfoDiv]);

    useEffect(() => {
        setIsVideoPlaying(true);
    }, [projectContent.video])

    useEffect(() => {
        if (isVideoPlaying) {
            videoRef.current?.play().catch(() => { });
        } else {
            videoRef.current?.pause();
        }
    }, [isVideoPlaying, projectContent.video])

    const handleVideoClick = () => {
        if (isVideoPlaying) {
            setIsVideoPlaying(false);
        } else {
            setIsVideoPlaying(true);
        }
    };

    useGSAP(() => {

        if (!hasInitRef.current) {
            hasInitRef.current = true;
            if (!showInfoDiv) {
                gsap.set(infoDivRef.current, { y: "100vh", paddingTop: 0, paddingBottom: 0 });
                gsap.set(backgroundFallbackRef.current, { height: 0, autoAlpha: 0 });
                return;
            }
        }

        if (showInfoDiv) {
            gsap.to(infoDivRef.current, { y: "100vh", duration: .5, scrollTo: 0, ease: "expo.out" });
            gsap.to(infoDivRef.current, { y: 0, paddingTop: 0, paddingBottom: 10, duration: 1.5, ease: "expo.out" });
            gsap.set(backgroundFallbackRef.current, { height: "100vh" });
            gsap.to(backgroundFallbackRef.current, { autoAlpha: .2, y: 0, duration: 1.5, ease: "expo.out" });
        } else {
            gsap.to(infoDivRef.current, { y: "100vh", paddingTop: 0, paddingBottom: 0, duration: 1.5, ease: "expo.out", onComplete: () => { unmountInfoDiv(); } });
            gsap.to(backgroundFallbackRef.current, { autoAlpha: 0, duration: .5, ease: "expo.out" });
            gsap.set(backgroundFallbackRef.current, { height: 0, autoAlpha: 0, delay: .1 });
        }


    }, { dependencies: [showInfoDiv], scope: containerRef });

    return (
        <div ref={containerRef} className="info-container">
            <div className="background-fallback" onClick={closeProjectClick} ref={backgroundFallbackRef}></div>
            <div className="info" ref={infoDivRef} tabIndex={-1}>
                <div className="topbar">
                    <div className="logo">
                        <h1 className="tag">GBR</h1>
                        <img src={logo} alt="" />
                    </div>
                    <div className="cross">
                        <RxCross2 size={25} onClick={closeProjectClick} tabIndex={0} data-manual-tabindex="true"
                            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); closeProjectClick(e); } }} />
                    </div>
                </div>

                <div className="content">
                    {projectContent.video === "" ? null : !projectContent.video.endsWith("webp") ?
                        <video onClick={handleVideoClick} ref={videoRef} key={projectContent.video} className="video" autoPlay muted loop disablePictureInPicture>
                            <source src={"/video" + projectContent.video} type="video/mp4" />
                        </video>
                        :
                        <img src={"/img" + projectContent.video} className="video" alt="" />
                    }
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
                            {projectContent.images.filter(Boolean).length != 0 &&
                                <div className="row image-gallery">
                                    {projectContent.images.map((el, i) => (
                                        <img key={el + "-" + i} className={i.toString()} src={"/img" + el} alt="" loading="lazy" decoding="async" />
                                    ))}
                                </div>
                            }
                            <div className="row technologies">
                                <span>Technologies</span>
                                <div className="icons">
                                    {projectContent.technos.map((tech) => (
                                        <div key={tech}>{iconMap[tech]}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <Button href={projectContent.link} positionSticky={true}>{isMobile ? "" : "View Link"}</Button>
                    </div>
                </div>

            </div>
        </div>
    )
};

export default InfoPanel;
