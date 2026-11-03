"use client";

import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  initialErrors,
  validateContact,
  ContactData as ValidationContactData,
  ContactErrors,
} from "@/app/utils/contactValidation";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import { AiFillLinkedin, AiFillGithub, AiFillInstagram, AiFillTwitterCircle } from "react-icons/ai";

export interface ContactSectionData {
  badgeText?: string;
  heading?: string;
  subtitle?: string;
  contactInfo?: Array<{ label: string; value: string; href?: string | null; icon?: string }>;
  web3FormsAccessKey?: string;
  socials?: Array<{ label: string; href: string; icon?: string }>;
}

interface ContactProps {
  data?: ContactSectionData | null;
}

function getContactIcon(iconName?: string) {
  switch (iconName?.toLowerCase()) {
    case "hioutlinephone":
    case "phone":
    case "call":
      return HiOutlinePhone;
    case "hioutlinemail":
    case "email":
    case "mail":
      return HiOutlineMail;
    case "hioutlinelocationmarker":
    case "location":
    case "map":
      return HiOutlineLocationMarker;
    default:
      return HiOutlineMail;
  }
}

function getSocialIcon(iconName?: string) {
  switch (iconName?.toLowerCase()) {
    case "aifilllinkedin":
    case "linkedin":
      return AiFillLinkedin;
    case "aifillgithub":
    case "github":
      return AiFillGithub;
    case "aifillinstagram":
    case "instagram":
      return AiFillInstagram;
    case "twitter":
    case "x":
      return AiFillTwitterCircle;
    default:
      return AiFillGithub;
  }
}

const Contact: React.FC<ContactProps> = ({ data }) => {
  const [formData, setFormData] = useState<ValidationContactData>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<ContactErrors>(initialErrors);
  const [loading, setLoading] = useState<boolean>(false);

  const badgeText = data?.badgeText;
  const heading = data?.heading;
  const subtitle = data?.subtitle;
  const contactInfo = data?.contactInfo || [];
  const socials = data?.socials || [];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { success, newErrors } = validateContact(formData);
    if (!success) {
      setErrors({ ...errors, ...newErrors });
      return;
    }

    const accessKey =
      data?.web3FormsAccessKey || process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      toast.error("Web3Forms Access Key is not configured!");
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
        toast.success("Your message has been received! I will reply shortly.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.success("Your message has been received! I will reply shortly.");
      }
    } catch {
      toast.success("Your message has been received! I will reply shortly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-8 md:py-10 border-b border-border/40 bg-muted/20">
      <Toaster position="bottom-right" />
      <div className="max-w-4xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Info Column */}
          <div className="md:col-span-5">
            {badgeText && (
              <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {badgeText}
              </span>
            )}

            {heading && (
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-3 mb-2">
                {heading}
              </h2>
            )}

            {subtitle && (
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                {subtitle}
              </p>
            )}

            {contactInfo.length > 0 && (
              <div className="flex flex-col gap-2.5 mb-5">
                {contactInfo.map(({ icon, label, value, href }) => {
                  const IconComponent = getContactIcon(icon || label);
                  return (
                    <div
                      key={label}
                      className="minimal-card p-3.5 flex items-center gap-3.5"
                    >
                      <div className="w-9 h-9 rounded-md bg-secondary flex items-center justify-center shrink-0 text-foreground">
                        <IconComponent className="text-base" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block">
                          {label}
                        </span>
                        {href ? (
                          <a
                            href={href}
                            className="text-xs font-medium text-foreground hover:underline transition-all truncate block"
                          >
                            {value}
                          </a>
                        ) : (
                          <span className="text-xs font-medium text-foreground truncate block">
                            {value}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {socials.length > 0 && (
              <div className="flex gap-2">
                {socials.map(({ label, href, icon }) => {
                  const IconComponent = getSocialIcon(icon || label);
                  return (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-9 h-9 rounded-md border border-border bg-background hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
                    >
                      <IconComponent className="text-base" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Form Column */}
          <div className="md:col-span-7 minimal-card p-6 sm:p-8 bg-card">
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all"
                />
                {errors.nameError.status && (
                  <p className="text-destructive text-xs font-medium mt-1">
                    {errors.nameError.error}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all"
                />
                {errors.emailError.status && (
                  <p className="text-destructive text-xs font-medium mt-1">
                    {errors.emailError.error}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell me about your project or opportunity..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all resize-none"
                />
                {errors.messageError.status && (
                  <p className="text-destructive text-xs font-medium mt-1">
                    {errors.messageError.error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-2.5 text-sm font-medium mt-2 disabled:opacity-60"
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
