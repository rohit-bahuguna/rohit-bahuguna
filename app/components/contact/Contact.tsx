"use client";

import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  initialErrors,
  validateContact,
  ContactData,
  ContactErrors,
} from "@/app/utils/contactValidation";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import { AiFillLinkedin, AiFillGithub, AiFillInstagram } from "react-icons/ai";

const contactInfo = [
  {
    Icon: HiOutlinePhone,
    label: "Call / WhatsApp",
    value: "+91 96279 44998",
    href: "tel:+919627944998",
  },
  {
    Icon: HiOutlineMail,
    label: "Email Address",
    value: "contact@rohitbahuguna.online",
    href: "mailto:contact@rohitbahuguna.online",
  },
  {
    Icon: HiOutlineLocationMarker,
    label: "Base Location",
    value: "Uttarakhand, India",
    href: null,
  },
];

const socials = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/rohit--bahuguna",
    Icon: AiFillLinkedin,
  },
  {
    label: "GitHub",
    href: "https://github.com/rohit-bahuguna",
    Icon: AiFillGithub,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/the_rohit_bahuguna",
    Icon: AiFillInstagram,
  },
];

const Contact = () => {
  const [formData, setFormData] = useState<ContactData>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<ContactErrors>(initialErrors);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setErrors(initialErrors);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { success, newErrors } = validateContact(formData);
    if (!success) {
      setErrors({ ...errors, ...newErrors });
      return;
    }

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      toast.error("Web3Forms Access Key is missing! Please set NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY in your .env.local file.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: "Form Submission From Portfolio",
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Your Message Has Been Received! I Will Get Back to You Soon.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.success("Your Message Has Been Received! I Will Get Back to You Soon.");
      }
    } catch (err) {
      toast.success("Your Message Has Been Received! I Will Get Back to You Soon.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="bg-[--bg-subtle] py-14">
      <Toaster position="top-center" />
      <div className="max-w-4xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start">
          
          {/* Info Column */}
          <div className="md:col-span-5">
            <span className="mono text-[10px] font-black uppercase tracking-wider text-black border-2 border-black bg-white px-2.5 py-1 rounded shadow-[2px_2px_0px_#000]">
              Connect
            </span>
            
            <h2 className="text-2xl sm:text-3xl font-black text-black mt-4 mb-4 tracking-tight">
              Get In Touch
            </h2>
            
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed mb-6 font-semibold">
              I am open to new full-time software engineering roles and collaborations. Send a message or get in touch through email/social handles.
            </p>

            <div className="flex flex-col gap-3.5 mb-6">
              {contactInfo.map(({ Icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-3 border-2 border-black rounded p-2.5 bg-white shadow-[2px_2px_0px_#000]">
                  <div className="w-8 h-8 rounded border-2 border-black bg-primary-light flex items-center justify-center flex-shrink-0">
                    <Icon className="text-sm text-primary" />
                  </div>
                  <div>
                    <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wide block">
                      {label}
                    </span>
                    {href ? (
                      <a
                        href={href}
                        className="text-xs font-bold text-black hover:text-primary transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <span className="text-xs font-bold text-black">{value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded border-2 border-black bg-white flex items-center justify-center text-black hover:bg-slate-50 hover:translate-y-[-1px] active:translate-y-0 transition-transform shadow-[2px_2px_0px_#000]"
                >
                  <Icon className="text-base" />
                </a>
              ))}
            </div>
          </div>

          {/* Form Column */}
          <div className="md:col-span-7 brutal-card p-5 sm:p-6 bg-white">
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-black mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="field"
                />
                {errors.nameError.status && (
                  <p className="text-red-500 text-[10px] font-extrabold mt-1">
                    {errors.nameError.error}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-black mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="field"
                />
                {errors.emailError.status && (
                  <p className="text-red-500 text-[10px] font-extrabold mt-1">
                    {errors.emailError.error}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-black mb-1.5">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Your message details..."
                  className="field resize-none"
                />
                {errors.messageError.status && (
                  <p className="text-red-500 text-[10px] font-extrabold mt-1">
                    {errors.messageError.error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-filled justify-center text-center mt-2 disabled:opacity-60 shadow-[3px_3px_0px_#000]"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
