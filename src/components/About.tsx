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
              <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque  euismod enim at est dictum maximus. Nunc in lorem nec diam consequat  euismod. Proin justo nibh, mattis id nulla eu, semper interdum quam.  Morbi non aliquet erat. Proin mattis, leo varius eleifend consectetur,  erat dolor bibendum nisl, condimentum dignissim ex magna quis dolor.  Curabitur convallis at orci ac maximus. Quisque ut metus diam. Sed  placerat orci sed libero luctus dapibus. Donec id scelerisque metus.  Nunc quis neque id magna ornare dapibus.</p>
              <Button className="contact" onClick={(e) => handleClick(e)}>Contact me</Button>
            </div>
          </>
  )
};

export default About;
