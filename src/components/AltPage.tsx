import { Button } from "./index"
import { useMediaQuery } from 'react-responsive';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef, useEffect, useState } from "react"
import { IoMailOutline, IoLocationOutline } from "react-icons/io5";
import { FaLinkedinIn } from "react-icons/fa";
import emailjs from '@emailjs/browser';

type AltPageProps = {
  showAltPage: boolean,
  altPageType: string,
  toggleAltPage: (e: HTMLDivElement) => void;
};

const AltPage = ({ showAltPage, altPageType, toggleAltPage }: AltPageProps) => {

  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' });
  const altPageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const prevAltPageType = useRef<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string | null }>({
  success: false,
  message: null,
  });

  const sendEmail = (e: any) => {
    e.preventDefault();
    setLoading(true);
    if (formRef.current) {

    // On envoie le formulaire à toi
    emailjs.sendForm(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_MESSAGE_TEMPLATE_ID,
      formRef.current,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    ).then(
      (result) => {
        console.log("Message sent to you:", result.text);

        // On envoie un accusé de réception
        emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_AUTO_REPLY_TEMPLATE_ID,
          {
            firstname: formRef.current?.firstname.valueOf,
            lastname: formRef.current?.lastname.valueOf,
            email: formRef.current?.mail.valueOf,
            message: formRef.current?.message.valueOf,
          },
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );
      },
      (error) => {
        console.error("Error sending:", error.text);
      }
    )
      .then(() => {
        setStatus({ success: true, message: 'Message envoyé avec succès !' });
        formRef.current?.reset();
      })
      .catch((error) => {
        setStatus({ success: false, message: "Échec de l'envoi. Réessayez plus tard." });
        console.error('EmailJS error:', error);
      })
      .finally(() => {
        setLoading(false);
      });

    // e.preventDefault();
    // setLoading(true);

    // setTimeout(() => {
    //   setStatus({ success: true, message: 'Message envoyé avec succès !' });
    //   formRef.current.reset();
    //   setLoading(false);
    // }, 1000);
    }
  };

  useGSAP(() => {
    if (prevAltPageType.current !== altPageType) {
      gsap.killTweensOf(contentRef.current);
      gsap.set(contentRef.current, { opacity: 0, yPercent: -10 });
    }

    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    if (showAltPage) {
      tl.to(contentRef.current, {
        opacity: 1,
        scaleX: 1,
        rotationX: 0,
        duration: 2,
        yPercent: 0,
      });
    } else {
      tl.to(contentRef.current, {
        opacity: 1,
        duration: 1,
        ease: "expo.in",
        yPercent: -10,
      });
    }

    prevAltPageType.current = altPageType;

  }, { dependencies: [showAltPage, altPageType] });

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from(altPageRef.current, {
      delay: isMobile ? 4 : 5,
      ease: "expo.out",
      opacity: 0,
    });
  });


  return (
    <div className="alt-page" ref={altPageRef}>
      <div className={"content " + altPageType} ref={contentRef}>
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
              <div className="about-text">
                <div className="text">
                  <h1>Contact me!</h1>
                  <p>Reprehenderit voluptates exercitationem reiciendis ipsam, libero facere ex sequi amet dicta quasi quas voluptatibus, quibusdam hic voluptatum culpa rerum fuga qui, esse eos. Quidem nihil rerum ipsa quis perspiciatis ullam impedit. Sunt minus cupiditate tempora quos in veniam consequuntur modi ipsam! Quod atque consequuntur dolorem inventore animi odit nulla cum sint, fugiat sequi voluptates voluptatem aperiam iusto placeat accusantium eligendi assumenda illo omnis nesciunt ut ducimus necessitatibus!</p>
                </div>
                <div className="about-icons">
                  <div className="mail">
                    <IoMailOutline />
                    <a href="mailto:guillaumeboucher.contact@gmail.com">
                      <span>guillaumebouch</span>
                      <span>er.contac</span>
                      <span>t@gmail.com</span>
                    </a>
                  </div>
                  <div className="linkedin">
                    <FaLinkedinIn />
                    <a href="https://www.linkedin.com/in/guillaume-boucher-628b01187/" target="_blank">Guillaume Boucher</a>
                  </div>
                  <div className="location">
                    <IoLocationOutline />
                    <span>Paris, France</span>
                  </div>
                </div>
              </div>

              <form className="form" ref={formRef} onSubmit={sendEmail}>
                <div className="name">
                  <div className="first-name">
                    <label htmlFor="firstname">First name *</label>
                    <input type="text" name="firstname" id="firstname" required/>
                  </div>
                  <div className="last-name">
                    <label htmlFor="lastname">Last name *</label>
                    <input type="text" name="lastname" id="lastname" required/>
                  </div>
                </div>
                <div className="mail">
                  <label htmlFor="mail">Email *</label>
                    <input type="email" name="mail" id="mail" required/>
                </div>

                <div className="message">
                  <label htmlFor="message">Message *</label>
                    <textarea name="message" rows={4} id="message" required></textarea>
                </div>

                <Button type={"submit"}>Submit</Button>
              </form>
          </>
        }


      </div>
      <Button className={altPageType + " projects"} onClick={toggleAltPage} isProject={true}>Return back to projects</Button>
    </div>
  )
};

export default AltPage;
