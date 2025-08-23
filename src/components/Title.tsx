import { useRef, useState, useEffect } from "react"
import { useGSAP } from '@gsap/react';
import gsap from 'gsap'
import { SplitText } from "gsap/SplitText"

gsap.registerPlugin(useGSAP, SplitText);

const Title = () => {

    const phrases = ["Discover my universe", "Driven by creativity"];
    const [curPhraseIndex, setCurPhraseIndex] = useState(0);

    const textRef = useRef<HTMLHeadingElement>(null);
    const [position, setPosition] = useState({ left: 0, top: 0 });

    useEffect(() => {
        const elementHeight = textRef.current?.offsetHeight || 0;
        const centerX = 1000000 + window.innerWidth / 2;
        const centerY = 1000000 + window.innerHeight / 2 - elementHeight / 2;

        setPosition({ left: centerX, top: centerY });
    }, []);

    useGSAP(() => {
        const parentSplit = new SplitText(textRef.current, {
            type: "lines",
            linesClass: "split-parent",
        });

        const childSplit = new SplitText(textRef.current, { type: "chars" });

        const tl = gsap.timeline({ repeat: -1 });

        tl.from(childSplit.chars, {
            duration: 1,
            ease: "sine.inOut",
            yPercent: 100,
            opacity: 0,
            stagger: 0.04,
        })
            .to(childSplit.chars, {
                delay: 2,
            })
            .to(childSplit.chars, {
                duration: 1,
                ease: "sine.inOut",
                yPercent: 100,
                opacity: 0,
                stagger: 0.04,
            });

        return () => {
            parentSplit.revert();
            childSplit.revert();
        };
    }, { dependencies: [curPhraseIndex], scope: textRef });

    useEffect(() => {
        setTimeout(() => {
            setCurPhraseIndex((curPhraseIndex + 1) % phrases.length);
        }, 6000);
    }, [curPhraseIndex]);

    return (
        <h1 className="title" ref={textRef} style={{ left: position.left, top: position.top }}>
            {phrases[curPhraseIndex]}
        </h1>
    )
};

export default Title;
