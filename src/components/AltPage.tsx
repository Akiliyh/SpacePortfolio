import { Button } from "./index"
import { useMediaQuery } from 'react-responsive';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef } from "react"

const AltPage = () => {

    const isMobile = useMediaQuery({ query: '(max-width: 1024px)' });
    const altPageRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
    const tl = gsap.timeline();
    tl.from( altPageRef.current, {
      delay: isMobile ? 4 : 5,
      ease: "expo.out",
      yPercent: 100,
      opacity: 0,
      scaleX: 0.8,
      rotationX: 80,
      transformOrigin: "50% 100% -200px",
    })

    const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    gsap.to(entry.target, { opacity: 1, scale: 1, rotate: 0, duration: 1, ease: "power2.inOut" });
                } else {
                    gsap.to(entry.target, { opacity: 0, scale: 0.6, rotate: 10, duration: 1, ease: "power2.inOut" });
                }
            });
        }, { threshold: 0.5 });

        altPageRef.current?.querySelectorAll('.images').forEach(el => {
            observer.observe(el);
        });

        return () => {
            observer.disconnect();
        };
  })

    return (
        <div className="alt-page" ref={altPageRef}>
            <div className="content">
                {!isMobile &&
                    <div className="images"></div>
                }

                <div className="info">
                    <h1>Guillaume Boucher</h1>
                    {isMobile &&
                        <div className="images"></div>
                    }
                    <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque  euismod enim at est dictum maximus. Nunc in lorem nec diam consequat  euismod. Proin justo nibh, mattis id nulla eu, semper interdum quam.  Morbi non aliquet erat. Proin mattis, leo varius eleifend consectetur,  erat dolor bibendum nisl, condimentum dignissim ex magna quis dolor.  Curabitur convallis at orci ac maximus. Quisque ut metus diam. Sed  placerat orci sed libero luctus dapibus. Donec id scelerisque metus.  Nunc quis neque id magna ornare dapibus.</p>
                    <Button>Contact me</Button>
                </div>
            </div>
            <Button className="projects">Return back to projects</Button>
        </div>
    )
};

export default AltPage;
