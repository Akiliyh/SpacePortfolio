import type { PropsWithChildren } from "react"
import { TfiArrowTopRight } from "react-icons/tfi";
import { useRef } from "react"
import { useGSAP } from '@gsap/react';
import gsap from 'gsap'
import { SplitText } from "gsap/SplitText"

gsap.registerPlugin(useGSAP, SplitText);


type ButtonProps = PropsWithChildren<{
    href: string;
    positionSticky: boolean;
}>;

const Button = ({ children, href, positionSticky }: ButtonProps) => {
    const linkRef = useRef<HTMLAnchorElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const arrowRef = useRef<HTMLDivElement>(null);

    // const linkSplitRef = useRef<SplitText>(null);
    // const buttonSplitRef = useRef<SplitText>(null);

    useGSAP(() => {

    // linkSplitRef.current = new SplitText(linkRef.current, { type: "chars" });
    // buttonSplitRef.current = new SplitText(buttonRef.current, { type: "chars" });

    


  }); // <-- scope is for selector text (optional)

    return (
        <div className="button">
            {href ? <a href={'https://' + href} rel="noopener" target="_blank" ref={linkRef} className={positionSticky ? "sticky" : ""}>
                {children}
                <div ref={arrowRef} style={{'display': 'flex'}}>
                <TfiArrowTopRight size={20}></TfiArrowTopRight>
                </div>
            </a>
                : <button ref={buttonRef}>
                    {children}
                </button>
            }

        </div>
    )
};

export default Button;
