import { IoFlag } from "react-icons/io5";
import { useRef } from "react"
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

type FlagsProps = {
  backgroundRef: React.RefObject<HTMLDivElement | null>;
  showFlag: boolean;
};

const Flag = ({ backgroundRef, showFlag }: FlagsProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useGSAP(() => {

    if (showFlag) {
      gsap.to(buttonRef.current, { autoAlpha: 1, y: 0, duration: 1.5, ease: "expo.out" });
    } else {
      gsap.to(buttonRef.current, { autoAlpha: 0, y: 20, duration: .5, ease: "expo.in" });
    }


  }, { dependencies: [showFlag], scope: buttonRef }); // <-- scope is for selector text (optional)

  return (
    <button tabIndex={0} className="center-button" title="Return back to origin" ref={buttonRef} onClick={() => {
      if (backgroundRef) {
        gsap.to(backgroundRef.current, { x: 0, y: 0, duration: 2, ease: "power2.inOut" });
      }
      
      gsap.to(buttonRef.current, { autoAlpha: 0, y: 20, duration: .5, ease: "power2.inOut" });
    }}>
      <svg width="0em" height="0em">
        <linearGradient id="icon-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop stopColor="#9DAEF2" offset="0%" />
          <stop stopColor="#9BF0AF" offset="50%" />
          <stop stopColor="#F4A5A7" offset="100%" />
        </linearGradient>
      </svg>

      <IoFlag style={{ fill: "url(#icon-gradient)" }} />

    </button>
  )
};

export default Flag;
