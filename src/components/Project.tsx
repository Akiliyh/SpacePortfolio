import { useEffect, useRef, useState } from "react"
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from "gsap/SplitText";
import { TfiArrowTopRight } from "react-icons/tfi";
import { useMediaQuery } from 'react-responsive';

gsap.registerPlugin(useGSAP, SplitText);

type ProjectProps = {
  coord: { x: number; y: number };
  index: number;
  handleClick: (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void;
  projectWidth: number;
  projectHeight: number;
  project: { title: string, year: string, image: string, video: string, videoPreview: string, images: Array<string> };
  randomIntFromInterval: Function;
  showAltPage : boolean,
};

const Project = ({ coord, index, handleClick, projectHeight, projectWidth, project, randomIntFromInterval, showAltPage }: ProjectProps) => {

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

  const [isDragging, setIsDragging] = useState(false);
  const [projectClasses, setProjectClasses] = useState('project-title');
  const touchStartRef = useRef({ x: 0, y: 0 });
  // we store the starting point of touch

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  // we remove the tab possibilities when the div is not active

    useEffect(() => {
        const contentEl = projectRef.current;
        if (!contentEl) return;

        // we get all the focusable elemets
        const focusable = contentEl.querySelectorAll<HTMLElement>(
            'a[href], button, video, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );

        focusable.forEach((el) => {
            if (el.getAttribute("data-manual-tabindex") === "true") return;

            if (showAltPage) {
                el.setAttribute("tabindex", "0");
            } else {
                el.setAttribute("tabindex", "-1");
            }
        });
    }, [showAltPage]);

  const handleTouchStart = (e: any) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    setIsDragging(false);
  };

  const handleTouchMove = (e: any) => {
    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - touchStartRef.current.x);
    const dy = Math.abs(touch.clientY - touchStartRef.current.y);
    // we take difference to see if the element is dragged or not

    if (dx > 10 || dy > 10) {
      setIsDragging(true);
    }

    handleMouseMove(e);
  };

  const handleTouchEnd = (e: any) => {
    if (!isDragging) {
      handleClick(e);
    }
    setIsDragging(false);
  };


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

  const handleHoverEnter = contextSafe((event: React.MouseEvent<HTMLDivElement> | React.FocusEvent<HTMLDivElement>) => {

    if ("buttons" in event && event.buttons > 0) return; // if div is dragged (mouse buttons clicked) we don't apply any hover effect

    gsap.to(imageRef.current, { zIndex: 0, autoAlpha: 0 });
    gsap.to(filterRef.current, { backdropFilter: "blur(20px)", background: "linear-gradient(to top, rgba(0,0,0,1) 0%,  rgba(0,0,0,0) 60%)", duration: 0, ease: "power2.out" });
    videoRef.current?.play();

    const el = event.currentTarget;

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

  const handleHoverLeave = contextSafe((event: React.MouseEvent<HTMLDivElement> | React.FocusEvent<HTMLDivElement>) => {

    videoRef.current?.pause();
    gsap.to(imageRef.current, { zIndex: 2, autoAlpha: 1 });

    gsap.to(filterRef.current, { backdropFilter: "blur(0px)", duration: 0, background: "linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 70%)", ease: "power2.out" });

    const el = event.currentTarget;
    gsap.to(el, { scale: 1, duration: .6, ease: "power2.out" });
    gsap.to(hoverCircleRef.current, { scale: 0, autoAlpha: 0, duration: .6, ease: "power2.out" });
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
    gsap.from(projectRef.current, { opacity: 0, scale: 0.6, rotate: randomIntFromInterval(-30, 30), duration: 1, ease: "power2.inOut" });
    gsap.to(projectRef.current, { opacity: 1, scale: 1, rotate: 0, duration: 1, ease: "power2.inOut" });
  }, { scope: projectRef }); // <-- scope is for selector text (optional)

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

  // we add classes base on title length to better style it
  useEffect(() => {
    if (project.title.length > 13) {
      setProjectClasses('project-title very-long');
    } else if(project.title.length > 8) {
      setProjectClasses('project-title long');
    }
  }, [])

  return (
    <div className="project-cards" ref={projectRef}
      title={project.title + " " + project.year}
      tabIndex={0}
      data-manual-tabindex="true"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleHoverEnter}
      onMouseLeave={handleHoverLeave}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onFocus={handleHoverEnter}  
      onBlur={handleHoverLeave}

      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleClick(e); }}}
      key={index}
      style={{
        position: "absolute",
        left: coord.x,
        top: coord.y,
        width: projectWidth,
        height: projectHeight,
        backgroundImage: "url(/img" + project.image + ")",
        backgroundSize: "cover"
      }}
    >

      <img className="preview-image" ref={imageRef} src={"/img" + project.image} alt="" />

      <div className="filter" ref={filterRef}></div>
      {/* <div className="filter" ref={filterRef} style={{
    backdropFilter: "blur(800px)",
    WebkitBackdropFilter: "blur(800px)" // for Safari
  }}></div>
  <div className="filter" ref={filterRef} style={{
    backdropFilter: "blur(800px)",
    WebkitBackdropFilter: "blur(800px)" // for Safari
  }}></div> */}

      {!isMobile &&
        <>
          <video tabIndex={-1} className="video" preload="none" ref={videoRef} muted loop disablePictureInPicture>
            <source src={"/video" + project.videoPreview} type="video/mp4" />
          </video>


          <div className="content">
            <div className={projectClasses} ref={titleRef}>
              {project.title}
            </div>
            <div className="year" ref={yearRef}>
              {project.year}
            </div>
          </div>

          <div className="hover-circle" ref={hoverCircleRef}>
            <TfiArrowTopRight color="black" />
          </div>
        </>
      }
    </div>
  )
};

export default Project;
