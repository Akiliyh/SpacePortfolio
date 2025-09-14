import { useRef } from "react"
import { useGSAP } from '@gsap/react';
import gsap from 'gsap'
import { SplitText } from "gsap/SplitText";
import logo from '../assets/GBRDrop.png';
import { useMediaQuery } from 'react-responsive';

gsap.registerPlugin(useGSAP, SplitText);

const Intro = () => {

  const titleRef = useRef<HTMLDivElement>(null);
  const introContainerRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const spaceRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLImageElement>(null);

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  useGSAP(() => {
    const parentSplit = new SplitText(titleRef.current, {
      type: "lines",
      linesClass: "split-parent",
      reduceWhiteSpace: false
    });

    const childSplit = new SplitText(titleRef.current, { type: "chars", reduceWhiteSpace: false });

    let initials = childSplit.chars.filter(el =>
      ["G", "B", "R"].includes(el.textContent || "")
    );

    const allOtherLetters = childSplit.chars.filter(
      el => !["G", "B", "R"].includes(el.textContent || "")
    );

    const capitalR = childSplit.chars.filter(
      el => ["R"].includes(el.textContent || "")
    );

    const tl = gsap.timeline();

    tl.add('start')

    // INITIALS APPEARANCE
    tl.from(initials, {
      duration: 2,
      ease: "expo.out",
      yPercent: 100,
      opacity: 0,
      stagger: 0.4,
    }, 'start')

    // DEBUG HOLD ANIMATION
    // .to(initials, {
    //   delay: 500
    // }, 'start')    


    // BALL ANIMATION
    tl.from(ballRef.current, {
      duration: 1.5,
      ease: "expo.out",
      yPercent: 150,
      delay: 1.4
    }, 'start')
    // .to(ballRef.current, {
    //   duration: 2,
    //   ease: "power4.out",
    //   x: "40vw"
    // }, 'start+=1.8')

    if (!isMobile) {
      // we remove the ball animation on mobile

      tl.to(ballRef.current, {
        duration: 4,
        ease: "power3.out",
        rotation: 360,
        transformOrigin: "center center"
      }, 'start+=1.8')
        .to(ballRef.current, {
          duration: 4,
          ease: "power3.out",
          xPercent: (30 * Math.PI) * 100 / 30 // we calculate its circonference and have a realistic distance of which it can travel to for one spin (360 deg)
        }, 'start+=1.8')

    }

    // SET WIDTH
    tl.set(allOtherLetters, {
      xPercent: -100,
      width: 0,
    }, 'start')
      .set(spaceRef.current, {
        xPercent: -100,
        width: 0,
      }, 'start')

    if (!isMobile) {
      // we remove the appearance of other letters as this is just isn't responsive

      // GIVE PROPER WIDTH
      tl.to(allOtherLetters, {
        width: "auto",
        delay: 1.8,
        xPercent: 0,
        opacity: 1,
        duration: 1,
        ease: 'expo.out'
      }, 'start')
        .to(spaceRef.current, {
          width: "auto",
          delay: 1.8,
          xPercent: 0,
          opacity: 1,
          duration: 1,
          ease: 'expo.out'
        }, 'start')

      // MAKE R DISAPPEAR
      tl.to(capitalR, {
        width: 0,
        delay: 1.8,
        xPercent: 0,
        opacity: 1,
        duration: 1,
        ease: 'expo.out'
      }, 'start')
    }

    // END ANIMATION
    tl.add('finish', !isMobile ? "start+=2.8" : "start+=1.8")
    // WE WANT THE FINISH ANIMATION TO BE FIXED IN TIME ALWAYS 2.8s after start
    tl.to(introContainerRef.current, {
      rotationX: 100,
      transformOrigin: "50% 50% -160px",
      opacity: 0,
      duration: 0.8,
      ease: "expo.inOut",
      stagger: 0.25
    }, 'finish')
      .to(introRef.current, {
        yPercent: -100,
        duration: 0.8,
        ease: "expo.inOut"
      }, 'finish');

    return () => {
      parentSplit.revert();
      childSplit.revert();
    };
  }, { scope: titleRef })

  return (
    <div className="intro" ref={introRef}>
      <div ref={introContainerRef} className="intro-container">
        <div ref={titleRef} className="intro-title">
          Guillaume&nbsp;BoucherR
          {/* <div ref={spaceRef}/> */}

        </div>
        <img src={logo} alt="" ref={ballRef} />
      </div>
    </div>
  )
};

export default Intro;
