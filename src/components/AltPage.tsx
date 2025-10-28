import { Button, ContactForm, About } from "./index"
import { useMediaQuery } from 'react-responsive';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef, useEffect } from "react"
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

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

  useEffect(() => {
    const contentEl = altPageRef.current;
    if (!contentEl) return;

    // we get "normal tabbable" elements
    const focusable = contentEl.querySelectorAll<HTMLElement>(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );

    focusable.forEach((el) => {
      if (showAltPage) {
        el.removeAttribute("tabindex");
      } else {
        el.setAttribute("tabindex", "-1");
      }
    });
  }, [showAltPage]);

  const handleClick = ((el: any) => {
    toggleAltPage(el);

    // scroll up top not to see the mess
    // to fix later
    gsap.to(window, { duration: 1, scrollTo: 0, ease: "expo.out" });
  });

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
      <Button className={altPageType + " projects"} onClick={handleClick} isProject={true}>{!isMobile && "Return back to projects"}</Button>
    </div>
  )
};

export default AltPage;
