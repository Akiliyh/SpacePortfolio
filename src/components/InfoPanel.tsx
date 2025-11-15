import { useEffect, useRef, useState } from "react"
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import logo from '../assets/GBRDrop.png';
import { FaReact, FaLanguage } from "react-icons/fa";
import { TbBrandCpp } from "react-icons/tb";
import { SiExpo, SiP5Dotjs, SiUnity, SiGooglecardboard, SiSupabase, SiLatex, SiFigma, SiRive, SiMapbox, SiOpengl, SiNodedotjs, SiJavascript, SiAffinitydesigner, SiWordpress, SiBlender } from "react-icons/si";
import { RxCross2 } from "react-icons/rx";
import { Button } from "./index"
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useMediaQuery } from 'react-responsive';
import React from "react";

const iconMap: Record<string, React.ReactElement> = {
    React: <FaReact size={30} />,
    Expo: <SiExpo size={30} />,
    P5: <SiP5Dotjs size={30} />,
    Unity: <SiUnity size={30} />,
    Cardboard: <SiGooglecardboard size={30} />,
    Supabase: <SiSupabase size={30} />,
    Latex: <SiLatex size={30} />,
    Figma: <SiFigma size={30} />,
    Rive: <SiRive size={30} />,
    Mapbox: <SiMapbox size={30} />,
    OpenGL: <SiOpengl size={30} />,
    CPP: <TbBrandCpp size={30} />,
    NodeDotJs: <SiNodedotjs size={30} />,
    Javascript: <SiJavascript size={30} />,
    Language: <FaLanguage size={30} />,
    AffinityDesigner: <SiAffinitydesigner size={30} />,
    Wordpress: <SiWordpress size={30} />,
    Blender: <SiBlender size={30} />,
};

gsap.registerPlugin(ScrollToPlugin);

type InfoPanelProps = {
    closeProjectClick: (e?: React.SyntheticEvent) => void,
    showInfoDiv: boolean,
    unmountInfoDiv: Function,
    projectContent: { title: string, paragraph: string, year: string, image: string, video: string, link: string, type: string, images: Array<string>, technos: Array<string> };
};

const InfoPanel = ({ closeProjectClick, showInfoDiv, unmountInfoDiv, projectContent }: InfoPanelProps) => {
    const infoDivRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const backgroundFallbackRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [isVideoPlaying, setIsVideoPlaying] = useState(true);

    const isMobile = useMediaQuery({ query: '(min-width: 767px)' });

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
                    {!projectContent.video.endsWith("webp") ?
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
                            {projectContent.images.length != 0 &&
                                <div className="row image-gallery">
                                    {projectContent.images.map((el, i) => (
                                        <img className={i.toString()} src={"/img" + el} alt="" />
                                    ))}
                                </div>
                            }
                            <div className="row technologies">
                                <span>Technologies</span>
                                <div className="icons">
                                    {projectContent.technos.map((tech) => (
                                        <>{iconMap[tech]}</>
                                    ))}
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
