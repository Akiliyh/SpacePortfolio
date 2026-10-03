import { Button } from "./index"
import picture from '../assets/CVpic.webp';

type AboutProps = {
  isMobile: boolean,
  toggleAltPage: (e: HTMLDivElement) => void;
};

const About = ({isMobile, toggleAltPage} : AboutProps) => {

    const handleClick = ((e: any) => {
        toggleAltPage(e);
    })

  return (
    <>
            {!isMobile &&
              <div className="images">
                <img src={picture} alt="A Selfie picture of Guillaume Boucher" />
              </div>
            }

            <div className="info">
              <h1>Guillaume Boucher</h1>
              {isMobile &&
                <div className="images">
                  <img src={picture} alt="A Selfie picture of Guillaume Boucher" />
                </div>
              }
              <p> My name is Guillaume Boucher, I am a French student currently in my final year of creative engineering in ESIEE Paris, France. I would consider myself as a creative and curious person. I love to challenge myself by creating new projects and ideas and to see how far they come alive. I am looking for a final year internship from February 2027 that would last for 6 months.</p>
              <Button className="contact" onClick={(e) => handleClick(e)}>Contact me</Button>
            </div>
          </>
  )
};

export default About;
