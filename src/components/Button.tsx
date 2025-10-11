import type { PropsWithChildren } from "react"
import { TfiArrowTopRight, TfiArrowDown } from "react-icons/tfi";
import { useRef } from "react"
import { useGSAP } from '@gsap/react';
import gsap from 'gsap'
import { SplitText } from "gsap/SplitText"

gsap.registerPlugin(useGSAP, SplitText);


type ButtonProps = PropsWithChildren<{
  href?: string;
  className?: string;
  positionSticky?: boolean;
  onClick?: (el: HTMLDivElement) => void;
  isProject?: boolean,
  type?: 'submit' | 'reset' | 'button' | undefined,
  disabled?: boolean,
}>;

const Button = ({ children, href, positionSticky, className = "", onClick, isProject, type = 'button', disabled }: ButtonProps) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });
  // Map of tab element -> its SplitText instances
  const splitMap = useRef<Map<HTMLDivElement, SplitText[]>>(new Map());

  const handleHoverEnter = contextSafe((el: HTMLDivElement) => {
    const tab = el.querySelector('.sub-tab') as HTMLDivElement | null;
    if (!tab) return;

    gsap.to(tab, { y: 0, duration: 0.1, ease: "expo.out" });

    const splits = splitMap.current.get(tab);
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
    const tab = el.querySelector('.sub-tab') as HTMLDivElement | null;
    if (!tab) return;

    gsap.to(tab, { y: 0, duration: 0.1, ease: "expo.in" });

    const splits = splitMap.current.get(tab);
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
    if (!containerRef.current) return;
    const tabs = containerRef.current.querySelectorAll('.sub-tab');
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
  }, { scope: containerRef });

  return (
    <div className={className + " button"} onClick={() => { if (containerRef.current && onClick) onClick(containerRef.current); }} ref={containerRef} >
      <div onMouseEnter={(e) => handleHoverEnter(e.currentTarget)} onMouseLeave={(e) => handleHoverLeave(e.currentTarget)} className={positionSticky ? "sticky" : ""}>
        {href ? <a href={'https://' + href} rel="noopener" target="_blank" ref={linkRef}>

          {children &&
            <div className="sub-tab" >
              <span>{children}</span>
              <span>{children}</span>
            </div>
          }

          <div ref={arrowRef} style={{ 'display': 'flex' }}>
            <TfiArrowTopRight size={20}></TfiArrowTopRight>
          </div>
        </a>
          : <button type={type} ref={buttonRef} disabled={disabled}>
            
            {children &&
              <div className="sub-tab">
                <span>{children}</span>
                <span>{children}</span>
              </div>
            }
            {isProject && <TfiArrowDown size={20}></TfiArrowDown>}
          </button>
        }
      </div>
    </div>
  )
};

export default Button;
