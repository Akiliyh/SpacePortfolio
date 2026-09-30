import { useRef, useState, useEffect } from "react"
import { useGSAP } from '@gsap/react';
import gsap from 'gsap'
import { SplitText } from "gsap/SplitText"

gsap.registerPlugin(useGSAP, SplitText);

const PHRASES = ["Discover my universe", "Driven by creativity"];

const Title = () => {

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

        parentSplit.lines.forEach((line) => {
            (line as HTMLElement).tabIndex = -1;
        });

        const childSplit = new SplitText(textRef.current, { type: "chars", overwrite: false });

        const tl = gsap.timeline({
            onComplete: () => setCurPhraseIndex((prev) => (prev + 1) % PHRASES.length),
        });

        tl.from(childSplit.chars, {
            duration: 1,
            ease: "sine.inOut",
            yPercent: 100,
            opacity: 0,
            stagger: 0.04,
        })
            .to(childSplit.chars, {
                duration: 1,
                ease: "sine.inOut",
                yPercent: 100,
                opacity: 0,
                stagger: 0.04,
            }, "+=2"); // 2s pause before the chars go out

        return () => {
            parentSplit.revert();
            childSplit.revert();
        };
    }, { dependencies: [curPhraseIndex], scope: textRef });

    return (
        <h1 key={curPhraseIndex} tabIndex={-1} className="title" ref={textRef} style={{ left: position.left, top: position.top }}>
            {PHRASES[curPhraseIndex]}
        </h1>
    )
};

export default Title;
