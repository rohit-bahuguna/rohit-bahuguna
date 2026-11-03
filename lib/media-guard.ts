import prisma from "@/lib/prisma";

export interface MediaReference {
  type: "project" | "skill" | "config";
  name: string;
  detail: string;
}

/**
 * Checks all database records to identify if a media URL is currently actively referenced.
 */
export async function checkMediaReferences(mediaUrl: string): Promise<MediaReference[]> {
  const references: MediaReference[] = [];

  // 1. Check Projects
  const projects = await prisma.project.findMany({
    where: { imageUrl: mediaUrl },
    select: { title: true, state: true },
  });
  for (const p of projects) {
    references.push({
      type: "project",
      name: `Project: ${p.title} (${p.state})`,
      detail: "Project thumbnail image",
    });
  }

  // 2. Check Skills
  const skills = await prisma.skill.findMany({
    where: { iconUrl: mediaUrl },
    select: { name: true, state: true },
  });
  for (const s of skills) {
    references.push({
      type: "skill",
      name: `Skill: ${s.name} (${s.state})`,
      detail: "Skill custom icon badge",
    });
  }

  // 3. Check Site Configurations
  const configs = await prisma.siteConfig.findMany();
  for (const cfg of configs) {
    try {
      const parsed = JSON.parse(cfg.data);
      if (cfg.key === "header" && parsed.logoImage === mediaUrl) {
        references.push({
          type: "config",
          name: `Header (${cfg.state})`,
          detail: "Website Logo Image",
        });
      }
      if (cfg.key === "hero") {
        if (parsed.portraitImage === mediaUrl) {
          references.push({
            type: "config",
            name: `Hero Section (${cfg.state})`,
            detail: "Hero Portrait Photo",
          });
        }
        if (parsed.ctaResume?.url === mediaUrl) {
          references.push({
            type: "config",
            name: `Hero Section (${cfg.state})`,
            detail: "Hero Resume Download Link",
          });
        }
      }
      if (cfg.key === "footer" && parsed.logoImage === mediaUrl) {
        references.push({
          type: "config",
          name: `Footer (${cfg.state})`,
          detail: "Footer Signature Logo",
        });
      }
    } catch {
      // ignore invalid json if any
    }
  }

  return references;
}
