import { Button } from "./index"
import { useMediaQuery } from 'react-responsive';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef, useEffect } from "react"

type AltPageProps = {
  showAltPage: boolean,
  altPageType: string,
  toggleAltPage: (e: HTMLDivElement) => void;
};

const AltPage = ({ showAltPage, altPageType, toggleAltPage }: AltPageProps) => {

  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' });
  const altPageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(showAltPage);
  }, [showAltPage])

  useGSAP(() => {
    gsap.killTweensOf(altPageRef.current);

    gsap.set(altPageRef.current, { opacity: 0, yPercent: -10 });

    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    if (showAltPage) {
      tl.to(altPageRef.current, {
        opacity: 1,
        scaleX: 1,
        rotationX: 0,
        duration: 2,
        yPercent: 0,
      });
    } else {
      tl.to(altPageRef.current, {
        opacity: 0,
        duration: 1,
        ease: "expo.in",
        yPercent: -10,
      });
    }

  }, { dependencies: [showAltPage, altPageType] });



  return (
    <div className="alt-page" ref={altPageRef}>
      <div className="content">
      {
        altPageType === "about" &&
        <>
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
        </>
        }


        {
        altPageType === "contact" && 
        <>
        <div>Yes</div>
        </>
        }
      
        
      </div>
      <Button className={altPageType + " projects"} onClick={toggleAltPage}>Return back to projects</Button>
    </div>
  )
};

export default AltPage;
