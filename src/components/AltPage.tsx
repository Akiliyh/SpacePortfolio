import { Button, ContactForm, About } from "./index"
import { useMediaQuery } from 'react-responsive';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef } from "react"

type AltPageProps = {
  showAltPage: boolean,
  altPageType: string,
  toggleAltPage: (e: HTMLDivElement) => void;
};

const AltPage = ({ showAltPage, altPageType, toggleAltPage }: AltPageProps) => {

  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' });
  const altPageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prevAltPageType = useRef<string | null>(null);

  useGSAP(() => {
    if (prevAltPageType.current !== altPageType) {
      gsap.killTweensOf(contentRef.current);
      gsap.set(contentRef.current, { opacity: 0, yPercent: -10 });
    }

    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    if (showAltPage) {
      tl.to(contentRef.current, {
        opacity: 1,
        scaleX: 1,
        rotationX: 0,
        duration: 2,
        yPercent: 0,
      });
    } else {
      tl.to(contentRef.current, {
        opacity: 1,
        duration: 1,
        ease: "expo.in",
        yPercent: -10,
      });
    }

    prevAltPageType.current = altPageType;

  }, { dependencies: [showAltPage, altPageType] });

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from(altPageRef.current, {
      delay: isMobile ? 4 : 5,
      ease: "expo.out",
      opacity: 0,
    });
  });


  return (
    <div className="alt-page" ref={altPageRef}>
      <div className={"content " + altPageType} ref={contentRef}>
        {
          altPageType === "about" &&
          <About isMobile={isMobile} toggleAltPage={toggleAltPage}></About>
        }


        {
          altPageType === "contact" &&
          <ContactForm isMobile={isMobile}></ContactForm>
        }


      </div>
      <Button className={altPageType + " projects"} onClick={toggleAltPage} isProject={true}>Return back to projects</Button>
    </div>
  )
};

export default AltPage;
