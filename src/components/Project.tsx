import { useEffect, useRef, useState } from "react"
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

type ProjectProps = {
  project: { x: number; y: number };
  index: number;
};

const Project = ({ project, index }: ProjectProps) => {

  const projectRef = useRef<HTMLDivElement>(null);
  const moveX = useRef<(value: number) => void>(null);
  const moveY = useRef<(value: number) => void>(null);

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
    gsap.to(el, { scale: 1.8, duration: .6, ease: "power2.out" });  
  })

  const handleHoverLeave = contextSafe((mouseEl: React.MouseEvent<HTMLDivElement>) => {
    const el = mouseEl.currentTarget;
    gsap.to(el, { scale: 1, duration: .6, ease: "power2.out" });
    // goes back to center
    if (moveX.current && moveY.current) {
      moveX.current(0);
      moveY.current(0);
    }
  })

  useGSAP(() => {

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
        width: 160,
        height: 90,
        backgroundColor: "red",
      }}
    />
  )
};

export default Project;
