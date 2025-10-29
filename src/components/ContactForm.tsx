import emailjs from '@emailjs/browser';
import { useRef, useState, useEffect } from "react"
import { IoMailOutline, IoLocationOutline } from "react-icons/io5";
import { FaLinkedinIn } from "react-icons/fa";
import { TbLoader2 } from "react-icons/tb";
import { Button } from "./index"

type ContactFormProps = {
  isMobile: boolean,
};

const ContactForm = ({ isMobile }: ContactFormProps) => {

  const formRef = useRef<HTMLFormElement>(null);

  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string | null }>({
    success: false,
    message: null,
  });

  useEffect(() => {
    if (status.message) {
      const showTimer = setTimeout(() => setShowAlert(true), 500); // fade in
      const hideTimer = setTimeout(() => setShowAlert(false), 5000); // fade out
      const clearTimer = setTimeout(() => {
        setStatus({ success: false, message: '' }); // remove alert from DOM
      }, 6000);

      return () => {
        clearTimeout(hideTimer);
        clearTimeout(clearTimer);
        clearTimeout(showTimer);
      };
    }
  }, [status.message]);

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
        console.log(status);
      });
    }

    // e.preventDefault();
    // setLoading(true);

    // setTimeout(() => {
    //   setStatus({ success: true, message: 'Message sent!' });
    //   // formRef.current?.reset();
    //   setLoading(false);
    // }, 1000);
  };

  return (
    <>
      <div className="about-text">
        <div className="text">
          <h1>Contact me!</h1>
          <p>As a future multimedia engineer I am eager to explore new horizons, those being related to UX/UI design, web design, motion design or game design. If you have a project or an idea to share with me, don't hesitate to contact me! Feel free to connect on LinkedIn! I am currently looking for an internship abroad in Europe for May until August 2026.</p>
        </div>

        {!isMobile &&
          <div className="about-icons">
            <div className="email">
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
        }
      </div>

      <form className="form" ref={formRef} onSubmit={sendEmail}>
        <div className="name">
          <div className="first-name">
            <label htmlFor="firstname">First name *</label>
            <input type="text" name="firstname" id="firstname" required />
          </div>
          <div className="last-name">
            <label htmlFor="lastname">Last name *</label>
            <input type="text" name="lastname" id="lastname" required />
          </div>
        </div>
        <div className="mail">
          <label htmlFor="mail">Email *</label>
          <input type="email" name="mail" id="mail" required />
        </div>

        <div className="message">
          <label htmlFor="message">Message *</label>
          <textarea name="message" rows={4} id="message" required></textarea>
        </div>

        {isMobile &&
          <div className="about-icons">
            <div className="email">
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
        }
        <div className="submit-container">
          <Button type={"submit"} disabled={loading}>
            {loading ?
              'Sending...'
              :
              'Submit'
            }</Button>
          {loading &&
            <TbLoader2 className="spinner" />
          }
        </div>

        {status.message && (
          <div className={(showAlert ? 'alert show-alert' : 'alert')}>
            {status.message}
          </div>
        )}
      </form>
    </>
  )
};

export default ContactForm;
