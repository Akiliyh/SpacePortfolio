/// <reference types="vite-plugin-svgr/client" />

import { useEffect, useRef, useState } from "react";
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SplitText } from "gsap/SplitText";
import logo from '../assets/GBRDrop.png';
import { useMediaQuery } from 'react-responsive';
import BurgerMenuIcon from '../assets/hammenu.svg?react';
import { Offcanvas } from "./index"

gsap.registerPlugin(SplitText);

type NavbarProps = {
  toggleAltPage: (e: HTMLDivElement) => void,
  showAltPage: boolean,
  altPageType: string
};

const Navbar = ({ toggleAltPage, showAltPage, altPageType }: NavbarProps) => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  const [isOffcanvasMenuOpen, setIsOffcanvasMenuOpen] = useState(false);

  const navbarRef = useRef<HTMLDivElement>(null);
  const navbarContainerRef = useRef<HTMLDivElement>(null);
  // Map of tab element -> its SplitText instances
  const splitMap = useRef<Map<HTMLDivElement, SplitText[]>>(new Map());

  const { contextSafe } = useGSAP({ scope: navbarRef });

  const handleHoverEnter = contextSafe((el: HTMLDivElement) => {
    gsap.to(el, { y: 0, duration: 0.1, ease: "expo.out" });

    const splits = splitMap.current.get(el);
    if (splits) {
      splits.forEach(split => {
        gsap.fromTo(
          split.chars,
          { yPercent: 100 },
          { yPercent: 0, duration: 0.6, stagger: 0.01, ease: "expo.out" }
        );
      });
    }
  });

  const handleHoverLeave = contextSafe((el: HTMLDivElement) => {
    gsap.to(el, { y: 0, duration: 0.1, ease: "expo.in" });

    const splits = splitMap.current.get(el);
    if (splits) {
      splits.forEach(split => {
        gsap.to(split.chars, {
          yPercent: 100,
          duration: 0.6,
          stagger: 0.01,
          ease: "expo.out"
        });
      });
    }
  });

  const handleClick = contextSafe((el: HTMLDivElement) => {
    toggleAltPage(el);
    const tabs = navbarRef.current?.querySelectorAll('.sub-tab');

    if (tabs) {

      if (!showAltPage) {
      for (let i = 0; i < tabs.length; i++) {
        if (tabs[i].classList != el.classList) {
          tabs[i].classList.remove("active");
          break;
        }

      }
    }

      for (let i = 0; i < tabs.length; i++) {
        if (tabs[i].classList != el.classList) {
          tabs[i].classList.remove("active");
          break;
        }

      }
    }

    for (let i = 0; i < el.classList.length; i++) {
      if (el.classList[i] == "active") {
        el.classList.remove("active");
        return;
      }

    }

    el.classList.add("active");
  });

  const handleBurgerClick = contextSafe((el: HTMLDivElement) => {
    console.log(el);
    if (isOffcanvasMenuOpen) {
      setIsOffcanvasMenuOpen(false);
    } else {
      setIsOffcanvasMenuOpen(true);
    }
  });

  useGSAP(() => {
    if (!navbarRef.current) return;

    const tabs = navbarRef.current.querySelectorAll('.sub-tab');
    tabs.forEach(tab => {
      const spans = tab.querySelectorAll('span');
      const splits: SplitText[] = [];

      spans.forEach(span => {
        const split = new SplitText(span, { type: 'chars' });
        gsap.set(split.chars, { yPercent: 100 });
        splits.push(split);
      });

      splitMap.current.set(tab as HTMLDivElement, splits);
    });
  }, { scope: navbarRef });

  useEffect(() => {
    setIsOffcanvasMenuOpen(false);
  }, [isMobile])

  // We remove tha active class if the show alt tab is closed
  useEffect(() => {
    const tabs = navbarRef.current?.querySelectorAll('.sub-tab');

    if (tabs) {

      if (!showAltPage) {
      for (let i = 0; i < tabs.length; i++) {
          tabs[i].classList.remove("active");
        }
      }
    }
  }, [showAltPage])


  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from(navbarContainerRef.current, {
      delay: isMobile ? 2 : 3,
      duration: 2,
      ease: "expo.out",
      rotationX: 90,
      transformOrigin: "50% 50% -160px",
    })
  });

  return (
    <div className="navbar-container" ref={navbarContainerRef}>
      <nav className="navbar" ref={navbarRef}>
        <div className="content">
          <h1 className="tag"><a href="/">GBR</a></h1>

          <div className="tabs">
            <>
              <div style={{ display: isMobile ? "none" : "block" }} className="about sub-tab" onClick={(e) => handleClick(e.currentTarget)} onMouseEnter={(e) => handleHoverEnter(e.currentTarget)}
                onMouseLeave={(e) => handleHoverLeave(e.currentTarget)}>
                <span>About</span>
                <span>About</span>
              </div>

              <div style={{ display: isMobile ? "none" : "block" }} className="contact sub-tab" onClick={(e) => handleClick(e.currentTarget)} onMouseEnter={(e) => handleHoverEnter(e.currentTarget)}
                onMouseLeave={(e) => handleHoverLeave(e.currentTarget)}>
                <span>Contact</span>
                <span>Contact</span>
              </div>
            </>
            <img src={logo} alt="" />
          </div>
        </div>
      </nav>

      {isMobile &&
        <>
          <div className={isOffcanvasMenuOpen ? "burger-icon-container active" : "burger-icon-container"} onClick={(e) => handleBurgerClick(e.currentTarget)}>
            <BurgerMenuIcon></BurgerMenuIcon>
          </div>


          <Offcanvas showAltPage={showAltPage} altPageType={altPageType} isOffcanvasMenuOpen={isOffcanvasMenuOpen} ></Offcanvas>
        </>

      }
    </div>
  );
};

export default Navbar;
