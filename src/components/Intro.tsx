import { useRef } from "react"
import { useGSAP } from '@gsap/react';
import gsap from 'gsap'
import { SplitText } from "gsap/SplitText";
import logo from '../assets/GBRDrop.png';

gsap.registerPlugin(useGSAP, SplitText);

const Intro = () => {

  const titleRef = useRef<HTMLDivElement>(null);
  const introContainerRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const spaceRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const parentSplit = new SplitText(titleRef.current, {
      type: "lines",
      linesClass: "split-parent",
      reduceWhiteSpace:false
    });

    const childSplit = new SplitText(titleRef.current, { type: "chars", reduceWhiteSpace:false});

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
    
      .from(initials, {
        duration: 2,
        ease: "expo.out",
        yPercent: 100,
        opacity: 0,
        stagger: 0.4,
      }, 'start')
      // .to(initials, {
      //   delay: 5
      // })
      .to(allOtherLetters, {
        xPercent: -100,
        width: 0,
        duration: 0,
      }, 'start')
      .to(allOtherLetters, {
        width: "auto",
        delay: 1.8,
        xPercent: 0,
        opacity: 1,
        duration: 1,
        ease: 'expo.out'
      }, 'start')
    .to(spaceRef.current, {
        xPercent: -100,
        width: 0,
        duration: 0,
      }, 'start')
      .to(spaceRef.current, {
        width: "auto",
        delay: 1.8,
        xPercent: 0,
        opacity: 1,
        duration: 1,
        ease: 'expo.out'
      }, 'start')
      .to(capitalR, {
        width: 0,
        delay: 1.8,
        xPercent: 0,
        opacity: 1,
        duration: 1,
        ease: 'expo.out'
      }, 'start')
      .add('finish')
      .to(introContainerRef.current, {
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
        <img src={logo} alt="" />
      </div>
    </div>
  )
};

export default Intro;
