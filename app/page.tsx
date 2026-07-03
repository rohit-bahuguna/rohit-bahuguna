import React from "react";
import Header from "@/app/components/Header";
import HeroSection from "@/app/components/HeroSection";
import Skills from "@/app/components/Skills";
import About from "@/app/components/About";
import Project from "@/app/components/project/Project";
import Contact from "@/app/components/contact/Contact";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <Skills />
        <About />
        <Project />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
