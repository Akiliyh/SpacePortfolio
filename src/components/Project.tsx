import { useEffect, useRef, useState } from "react"
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from "gsap/SplitText";
import { TfiArrowTopRight } from "react-icons/tfi";

gsap.registerPlugin(useGSAP, SplitText);

type ProjectProps = {
  project: { x: number; y: number };
  index: number;
  handleClick: Function;
  projectWidth: number;
  projectHeight: number;
};

const Project = ({ project, index, handleClick, projectHeight, projectWidth }: ProjectProps) => {

  const projectRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const hoverCircleRef = useRef<HTMLDivElement>(null);
  const moveCardX = useRef<(value: number) => void>(null);
  const moveCardY = useRef<(value: number) => void>(null);
  const moveCircleX = useRef<(value: number) => void>(null);
  const moveCircleY = useRef<(value: number) => void>(null);

  const titleSplitRef = useRef<SplitText>(null);
  const yearSplitRef = useRef<SplitText>(null);

  const { contextSafe } = useGSAP({ scope: projectRef });

  const handleMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const offsetCardX = e.clientX - (rect.left + rect.width / 2);
    const offsetCardY = e.clientY - (rect.top + rect.height / 2);


    if (moveCircleX.current && moveCircleY.current) {
      // counter the scale 1.5 effect
      moveCircleX.current(offsetCardX / 1.5);
      moveCircleY.current(offsetCardY / 1.5);
    }

    if (moveCardX.current && moveCardY.current) {
      moveCardX.current(gsap.utils.clamp(-30, 30, offsetCardX));
      moveCardY.current(gsap.utils.clamp(-30, 30, offsetCardY));
    }

    
  });

  const handleHoverEnter = contextSafe((mouseEl: React.MouseEvent<HTMLDivElement>) => {

    if (mouseEl.buttons > 0) { // if div is dragged (mouse buttons clicked) we don't apply any hover effect
      return;
    }

    const el = mouseEl.currentTarget;

    gsap.to(el, { scale: 1.5, duration: .6, ease: "power2.out" });
    gsap.to(hoverCircleRef.current, { scale: 1.5, autoAlpha: 1, duration: .6, ease: "power2.out" });

    if (titleSplitRef.current) {
      gsap.to(titleSplitRef.current.chars, {
        yPercent: 20,
        duration: 0.6,
        stagger: 0.01,
        ease: "expo.out"
      });
    }

    if (yearSplitRef.current) {
      gsap.to(yearSplitRef.current.chars, {
        yPercent: 20,
        duration: 0.6,
        // delay: 0.2,
        stagger: 0.01,
        ease: "expo.out"
      });
    }


    gsap.set(projectRef.current, {
        zIndex: 1
      });


  })

  const handleHoverLeave = contextSafe((mouseEl: React.MouseEvent<HTMLDivElement>) => {
    const el = mouseEl.currentTarget;
    gsap.to(el, { scale: 1, duration: .6, ease: "power2.out" });
    gsap.to(hoverCircleRef.current, { scale: 0, autoAlpha:0, duration: .6, ease: "power2.out" });
    // goes back to center
    if (moveCardX.current && moveCardY.current) {
      moveCardX.current(0);
      moveCardY.current(0);
    }

    if (titleSplitRef.current) {


      gsap.to(titleSplitRef.current.chars, {
        yPercent: 110,
        duration: 0.6,
        stagger: 0.01,
        ease: "expo.out"
      });
    }

    if (yearSplitRef.current) {


      gsap.to(yearSplitRef.current.chars, {
        yPercent: 150,
        duration: 0.6,
        stagger: 0.01,
        ease: "expo.out"
      });
    }

    gsap.set(projectRef.current, {
        zIndex: 0
      });
  })

  useGSAP(() => {

    titleSplitRef.current = new SplitText(titleRef.current, { type: "chars" });
    yearSplitRef.current = new SplitText(yearRef.current, { type: "chars" });

    if (hoverCircleRef.current) {
      gsap.set(hoverCircleRef.current, {
      autoAlpha: 0,
    });
    }

    gsap.set(titleSplitRef.current.chars, {
      yPercent: 110,
    });

    gsap.set(yearSplitRef.current.chars, {
      yPercent: 150,
    });

    moveCardX.current = gsap.quickTo(projectRef.current, "x", {
      duration: 3,
      ease: "power2.out",
    });
    moveCardY.current = gsap.quickTo(projectRef.current, "y", {
      duration: 3,
      ease: "power2.out",
    });

    moveCircleX.current = gsap.quickTo(hoverCircleRef.current, "x", {
      duration: .5,
      ease: "power2.out",
    });
    moveCircleY.current = gsap.quickTo(hoverCircleRef.current, "y", {
      duration: .5,
      ease: "power2.out",
    });



  }, { scope: projectRef }); // <-- scope is for selector text (optional)

  return (
    <div className="project-cards" ref={projectRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleHoverEnter}
      onMouseLeave={handleHoverLeave}
      onClick={handleClick}
      key={index}
      style={{
        position: "absolute",
        left: project.x,
        top: project.y,
        width: projectWidth,
        height: projectHeight,
        backgroundColor: "red",
      }}
    >
      <div className="project-title" ref={titleRef}>Title</div>
      <div className="year" ref={yearRef}>2025</div>
      <div className="hover-circle" ref={hoverCircleRef}>
        <TfiArrowTopRight color="black"/>
      </div>
    </div>
  )
};

export default Project;
