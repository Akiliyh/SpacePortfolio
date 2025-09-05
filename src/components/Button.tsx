import type { PropsWithChildren } from "react"
import { TfiArrowTopRight } from "react-icons/tfi";
import { useRef } from "react"
import { useGSAP } from '@gsap/react';
import gsap from 'gsap'
import { SplitText } from "gsap/SplitText"

gsap.registerPlugin(useGSAP, SplitText);


type ButtonProps = PropsWithChildren<{
    href: string;
}>;

const Button = ({ children, href }: ButtonProps) => {
    const linkRef = useRef<HTMLAnchorElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const linkSplitRef = useRef<SplitText>(null);
    const buttonSplitRef = useRef<SplitText>(null);

    useGSAP(() => {

    // linkSplitRef.current = new SplitText(linkRef.current, { type: "chars" });
    // buttonSplitRef.current = new SplitText(buttonRef.current, { type: "chars" });

    


  }); // <-- scope is for selector text (optional)

    return (
        <div className="button">
            {href ? <a href={'https://' + href} rel="noopener" target="_blank" ref={linkRef}>
                {children}
                <TfiArrowTopRight size={20}></TfiArrowTopRight>
            </a>
                : <button ref={buttonRef}>
                    {children}
                </button>
            }

        </div>
    )
};

export default Button;
