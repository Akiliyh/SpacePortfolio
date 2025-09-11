import { useRef } from "react"
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from "gsap/SplitText";
import { TfiArrowTopRight } from "react-icons/tfi";

gsap.registerPlugin(useGSAP, SplitText);

type ProjectProps = {
  coord: { x: number; y: number };
  index: number;
  handleClick: (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => void;
  projectWidth: number;
  projectHeight: number;
  project: {title: string, year: number, image: string, video: string, videoPreview: string};
};

const Project = ({ coord, index, handleClick, projectHeight, projectWidth, project }: ProjectProps) => {

  const projectRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
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

    gsap.to(imageRef.current, {zIndex: 0, autoAlpha: 0});
    gsap.to(filterRef.current, { backdropFilter: "blur(20px)",  background: "linear-gradient(to top, rgba(0,0,0,1) 0%,  rgba(0,0,0,0) 60%)", duration: 0,  ease: "power2.out"});
    videoRef.current?.play();

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

    videoRef.current?.pause();
    gsap.to(imageRef.current, {zIndex: 2, autoAlpha: 1});

    gsap.to(filterRef.current, { backdropFilter: "blur(0px)", duration: 0,  background: "linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 70%)",  ease: "power2.out"});

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
      onTouchStart={handleClick}
      key={index}
      style={{
        position: "absolute",
        left: coord.x,
        top: coord.y,
        width: projectWidth,
        height: projectHeight,
        backgroundImage: "url(img" + project.image + ")",
        backgroundSize: "cover"
      }}
    >

      <img className="preview-image" ref={imageRef} src={"img" + project.image} alt=""/>

      <div className="filter" ref={filterRef}></div>
      {/* <div className="filter" ref={filterRef} style={{
    backdropFilter: "blur(800px)",
    WebkitBackdropFilter: "blur(800px)" // for Safari
  }}></div>
  <div className="filter" ref={filterRef} style={{
    backdropFilter: "blur(800px)",
    WebkitBackdropFilter: "blur(800px)" // for Safari
  }}></div> */}

      <video className="video" ref={videoRef} muted loop disablePictureInPicture>
        <source src={"video" + project.videoPreview} type="video/mp4" />
      </video>

      <div className="content">
      <div className="project-title" ref={titleRef}>
        {project.title}
        </div>
      <div className="year" ref={yearRef}>
        {project.year}
        </div>
        </div>
      <div className="hover-circle" ref={hoverCircleRef}>
        <TfiArrowTopRight color="black"/>
      </div>
    </div>
  )
};

export default Project;
