import { useEffect, useRef, useState } from "react"
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, SplitText);

type ProjectProps = {
  project: { x: number; y: number };
  index: number;
};

const Project = ({ project, index }: ProjectProps) => {

  const projectRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const moveX = useRef<(value: number) => void>(null);
  const moveY = useRef<(value: number) => void>(null);

  const titleSplitRef = useRef<SplitText>(null);
  const yearSplitRef = useRef<SplitText>(null);

  const { contextSafe } = useGSAP({ scope: projectRef });

  const handleMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const offsetX = e.clientX - (rect.left + rect.width / 2);
    const offsetY = e.clientY - (rect.top + rect.height / 2);

    if (moveX.current && moveY.current) {
      moveX.current(gsap.utils.clamp(-30, 30, offsetX));
      moveY.current(gsap.utils.clamp(-30, 30, offsetY));
    }
  });

  const handleHoverEnter = contextSafe((mouseEl: React.MouseEvent<HTMLDivElement>) => {
    const el = mouseEl.currentTarget;
    gsap.to(el, { scale: 1.5, duration: .6, ease: "power2.out" });

    if (titleSplitRef.current) {
      gsap.to(titleSplitRef.current.chars, {
        yPercent: 20,
        duration: 0.6,
        stagger: 0.02,
        ease: "expo.out"
      });
    }

    if (yearSplitRef.current) {
      gsap.to(yearSplitRef.current.chars, {
        yPercent: 20,
        duration: 0.6,
        delay: 0.2,
        stagger: 0.02,
        ease: "expo.out"
      });
    }


  })

  const handleHoverLeave = contextSafe((mouseEl: React.MouseEvent<HTMLDivElement>) => {
    const el = mouseEl.currentTarget;
    gsap.to(el, { scale: 1, duration: .6, ease: "power2.out" });
    // goes back to center
    if (moveX.current && moveY.current) {
      moveX.current(0);
      moveY.current(0);
    }

    if (titleSplitRef.current) {


      gsap.to(titleSplitRef.current.chars, {
        yPercent: 110,
        duration: 0.6,
        stagger: 0.02,
        ease: "expo.out"
      });
    }

    if (yearSplitRef.current) {


      gsap.to(yearSplitRef.current.chars, {
        yPercent: 150,
        duration: 0.6,
        delay: 0.1,
        stagger: 0.02,
        ease: "expo.out"
      });
    }
  })

  useGSAP(() => {

    titleSplitRef.current = new SplitText(titleRef.current, { type: "chars" });
    yearSplitRef.current = new SplitText(yearRef.current, { type: "chars" });

    gsap.set(titleSplitRef.current.chars, {
      yPercent: 110,
    });

    gsap.set(yearSplitRef.current.chars, {
      yPercent: 150,
    });

    moveX.current = gsap.quickTo(projectRef.current, "x", {
      duration: 3,
      ease: "power2.out",
    });
    moveY.current = gsap.quickTo(projectRef.current, "y", {
      duration: 3,
      ease: "power2.out",
    });



  }, { scope: projectRef }); // <-- scope is for selector text (optional)

  return (
    <div className="project-cards" ref={projectRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleHoverEnter}
      onMouseLeave={handleHoverLeave}
      onClick={() => console.log('oui')}
      key={index}
      style={{
        position: "absolute",
        left: project.x,
        top: project.y,
        width: 320,
        height: 180,
        backgroundColor: "red",
      }}
    >
      <div className="project-title" ref={titleRef}>Title</div>
      <div className="year" ref={yearRef}>2025</div>
    </div>
  )
};

export default Project;
