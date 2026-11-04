import React from "react";
import Header from "@/app/components/Header";
import HeroSection from "@/app/components/HeroSection";
import Skills from "@/app/components/Skills";
import About from "@/app/components/About";
import Project from "@/app/components/project/Project";
import Contact from "@/app/components/contact/Contact";
import Footer from "@/app/components/Footer";
import AdminPreviewBanner from "@/app/components/AdminPreviewBanner";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export const revalidate = 3600; // Incremental Static Regeneration (1h default, invalidated on publish)

interface PageProps {
  searchParams: Promise<{ preview?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const isPreviewRequested = resolvedParams.preview === "true";
  
  // Verify admin session if preview mode is requested
  let isPreview = false;
  if (isPreviewRequested) {
    const session = await getAdminSession();
    if (session) {
      isPreview = true;
    }
  }

  const queryState = isPreview ? "draft" : "live";

  // Fetch all live or draft content concurrently
  const [configs, allProjects, skills] = await Promise.all([
    prisma.siteConfig.findMany({
      where: { state: queryState },
    }),
    prisma.project.findMany({
      where: { state: queryState },
      orderBy: { order: "asc" },
    }),
    prisma.skill.findMany({
      where: { state: queryState },
      orderBy: { order: "asc" },
    }),
  ]);

  // Only display projects marked as featured on the homepage (fall back to all if none are featured)
  const featuredProjects = allProjects.filter((p) => p.featured);
  const projects = featuredProjects.length > 0 ? featuredProjects : allProjects;

  // Convert array of configs to a lookup object
  const configMap: Record<string, any> = {};
  for (const cfg of configs) {
    try {
      configMap[cfg.key] = JSON.parse(cfg.data);
    } catch {
      configMap[cfg.key] = null;
    }
  }

  return (
    <>
      {isPreview && <AdminPreviewBanner />}
      <div className={isPreview ? "pt-11" : ""}>
        <Header data={configMap.header} isPreview={isPreview} />
        <main>
          <HeroSection data={configMap.hero} />
          <Skills skills={skills} />
          <About data={configMap.about} />
          <Project projects={projects} />
          <Contact data={configMap.contact} />
        </main>
        <Footer data={configMap.footer} navItems={configMap.header?.navItems} />
      </div>
    </>
  );
}
