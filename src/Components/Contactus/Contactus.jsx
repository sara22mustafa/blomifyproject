import React, { useRef, useState } from "react";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import {Helmet} from "react-helmet";
import emailjs from "@emailjs/browser";
import { SectionOne } from "./SectionOne";
import { SuccessToast } from "../Toasters/SuccessToast";
import FailTost from "../Toasters/FailTost";
import Loader from "../Loader/Loader";
export default function Contactus() {
  const socialMedia = [
    {
      icon: <FaFacebook />,
      refrance:
        "https://www.facebook.com/profile.php?id=61564176270981&mibextid=ZbWKwL",
      id: "1",
    },
    {
      icon: <FaInstagram />,
      refrance: "https://www.instagram.com/blo_omifyshop?igsh=anI3MW81cWpjNDd4",
      id: "2",
    },
    {
      icon: <FaWhatsapp />,
      refrance: "https://wa.link/jk7u72",
      id: "3",
    },
  ];

  const form = useRef();
  const [islloading, setisloading] = useState(false);
  const [openSuccesstoast, setopenSuccesstoast] = useState(false);
  const [openfailtoast, setopenfailtoast] = useState(false);
  const [emailError, setemailError] = useState("");
  const sendEmail = (e) => {
    e.preventDefault();
    setisloading(true);
    emailjs
      .sendForm("service_jz19c3c", "template_ksj8tha", form.current, {
        publicKey: "09jAQ3uxZuo4ocw6E",
      })
      .then(
        () => {
          setopenSuccesstoast(true);
          setisloading(false);
          e.target.reset();
          console.log("SUCCESS!");
        },
        (error) => {
          console.log("FAILED...", error.text);
          setopenfailtoast(true);
          setemailError(error.text);
          setisloading(false);
        }
      );
  };
  setTimeout(() => {
    if (openSuccesstoast) {
      setopenSuccesstoast(false);
    }
    if (openfailtoast) {
      setopenfailtoast(false);
    }
  }, 3000);
  return (
    <>
    <div className="mt-6 max-w-6xl max-lg:max-w-3xl mx-auto bg-dusty-mauve rounded-lg">
      <div className="grid lg:grid-cols-2 items-center gap-14 sm:p-8 p-4 font-[sans-serif]">
        {/* Get in toush Section */}
        <SectionOne socialICon={socialMedia} />
        {/* section Two Form */}
        <div className="bg-light-pink p-6 rounded-lg">
          <h2 className="font-bold text-white">Send Us Emial Now</h2>
          {/* Success Toast */}
          {openSuccesstoast ? (
            <SuccessToast message={"Email Sent Succsessfully"} />
          ) : (
            ""
          )}
          {/* Fail Toast */}
          {openfailtoast ? (
            <FailTost message={emailError} action={openfailtoast} />
          ) : (
            ""
          )}

          <form ref={form} onSubmit={sendEmail} className="mt-8 space-y-4">
            <input
              type="text"
              required
              placeholder="Name"
              name="user_name"
              className="w-full rounded-lg py-3 px-4 text-deep-burgundy text-sm border-none"
            />
            <input
              type="email"
              name="user_email"
              required
              placeholder="Email"
              className="w-full rounded-lg py-3 px-4 text-sm border border-transparent focus:border-deep-burgundy  text-deep-burgundy"
            />

            <input
              type="text"
              placeholder="Subject"
              required
              className="w-full rounded-lg py-3 px-4 text-sm border-none text-deep-burgundy"
            />
            <textarea
              placeholder="Message"
              name="message"
              rows={6}
              required
              className="w-full rounded-lg px-4 border-none text-sm pt-3 text-deep-burgundy"
              defaultValue={""}
            />
            {islloading ? (
              <>
                <button
                  type="submit"
                  className="text-white bg-deep-burgundy hover:bg-dusty-mauve tracking-wide rounded-lg text-sm px-4 py-3 flex items-center justify-center w-full !mt-6"
                >
                  <Loader height={20} width={20} />
                </button>
              </>
            ) : (
              <>
                <button
                  type="submit"
                  className="text-white bg-deep-burgundy hover:bg-dusty-mauve tracking-wide rounded-lg text-sm px-4 py-3 flex items-center justify-center w-full !mt-6"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16px"
                    height="16px"
                    fill="#fff"
                    className="mr-2"
                    viewBox="0 0 548.244 548.244"
                  >
                    <path
                      fillRule="evenodd"
                      d="M392.19 156.054 211.268 281.667 22.032 218.58C8.823 214.168-.076 201.775 0 187.852c.077-13.923 9.078-26.24 22.338-30.498L506.15 1.549c11.5-3.697 24.123-.663 32.666 7.88 8.542 8.543 11.577 21.165 7.879 32.666L390.89 525.906c-4.258 13.26-16.575 22.261-30.498 22.338-13.923.076-26.316-8.823-30.728-22.032l-63.393-190.153z"
                      clipRule="evenodd"
                      data-original="#000000"
                    />
                  </svg>
                  Send Message
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
    <Helmet>
    <title>Contact Us</title>
</Helmet>
</>
  );
}
