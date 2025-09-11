import { useRef } from "react";
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SplitText } from "gsap/SplitText";
import logo from '../assets/GBRDrop.png';

gsap.registerPlugin(SplitText);

type NavbarProps = {
  toggleAltPage: (e: HTMLDivElement) => void;
};

const Navbar = ({ toggleAltPage }: NavbarProps) => {
  const navbarRef = useRef<HTMLDivElement>(null);
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

  return (
    <nav className="navbar" ref={navbarRef}>
      <div className="content">
        <h1 className="tag">GBR</h1>
        <div className="tabs">
          <div className="about sub-tab" onClick={(e) => toggleAltPage(e.currentTarget)} onMouseEnter={(e) => handleHoverEnter(e.currentTarget)}
            onMouseLeave={(e) => handleHoverLeave(e.currentTarget)}>
            <span>About</span>
            <span>About</span>
          </div>

          <div className="contact sub-tab" onClick={(e) => toggleAltPage(e.currentTarget)} onMouseEnter={(e) => handleHoverEnter(e.currentTarget)}
            onMouseLeave={(e) => handleHoverLeave(e.currentTarget)}>
            <span>Contact</span>
            <span>Contact</span>
          </div>
          <img src={logo} alt="" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
