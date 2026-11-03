import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting automated database seeding...");

  // 1. Seed Admin User
  const username = process.env.ADMIN_USERNAME || "rohit";
  const rawPassword = process.env.ADMIN_PASSWORD || "rohitpassword123";
  const passwordHash = await bcrypt.hash(rawPassword, 10);

  const admin = await prisma.adminUser.upsert({
    where: { username },
    update: { passwordHash },
    create: {
      username,
      passwordHash,
    },
  });
  console.log(`✅ Admin user seeded: ${admin.username}`);

  // 2. Initial Site Configurations
  const headerData = {
    logoType: "image",
    logoText: "RB",
    logoImage: "/Images/rohitsign.png",
    navItems: [
      { label: "About", target: "#about", visible: true, order: 0 },
      { label: "Skills", target: "#skills", visible: true, order: 1 },
      { label: "Projects", target: "#projects", visible: true, order: 2 },
      { label: "Contact", target: "#contact", visible: true, order: 3 },
    ],
    ctaButton: {
      label: "Hire Me",
      target: "#contact",
      visible: true,
    },
  };

  const heroData = {
    badgeText: "Full Stack Engineer",
    greeting: "Hi, I'm",
    nameHighlight: "Rohit",
    nameSurname: "Bahuguna",
    bio: "I specialize in building full-stack web applications using the MERN stack. Focused on delivering robust backend architectures alongside highly optimized interfaces.",
    portraitImage: "/Images/rohitBahuguna.jpg",
    ctaProjects: {
      label: "Projects",
      target: "#projects",
    },
    ctaResume: {
      label: "Resume",
      url: "/resume",
      target: "_self",
    },
    socials: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/rohit--bahuguna", icon: "AiFillLinkedin" },
      { label: "GitHub", href: "https://github.com/rohit-bahuguna", icon: "AiFillGithub" },
      { label: "Instagram", href: "https://www.instagram.com/the_rohit_bahuguna", icon: "AiFillInstagram" },
    ],
  };

  const aboutData = {
    badgeText: "Profile",
    heading: "About Me",
    paragraphs: [
      "I am a Full Stack Developer focusing on building fast, reliable, and clean web portals. I maintain a strong interest in system architecture, clean interfaces, and optimal performance.",
      "With hands-on experience across both front-end and back-end integration, I build APIs, state logic, responsive styling, and database integrations.",
    ],
    stats: [
      { label: "Focus Tech", value: "MERN & Next.js" },
      { label: "Projects Done", value: "10+ Shipped" },
      { label: "Base Location", value: "India" },
    ],
    timelineBadge: "Journey",
    timelineHeading: "Timeline",
    journey: [
      {
        year: "2021",
        title: "Started Web Development",
        description: "Began learning Java, JavaScript, HTML, CSS, and programming fundamentals while building small projects and strengthening problem-solving skills.",
      },
      {
        year: "2022",
        title: "Full Stack Development",
        description: "Mastered React, Node.js, Express, MongoDB, Angular, and MySQL while developing complete web applications and exploring modern backend architecture.",
      },
      {
        year: "2023",
        title: "Professional Software Engineer",
        description: "Joined Rabblesoft as a Full Stack Engineer, delivering production-ready business applications using React, JavaScript, REST APIs, and database-driven architectures.",
      },
      {
        year: "2024",
        title: "Senior Full Stack Engineer",
        description: "Promoted at QBH Solution to Senior Software Engineer, leading development of scalable ERP modules with Angular, NestJS, TypeScript, MySQL, and enterprise-grade architectures.",
      },
      {
        year: "2025+",
        title: "Building Scalable Products",
        description: "Focused on Next.js, SEO-first applications, reusable architectures, CMS development, and high-performance full-stack products while expanding open-source projects and personal ventures.",
      },
    ],
  };

  const themeData = {
    primaryColor: "#573e60",
    presets: [
      { name: "Plum", value: "#573e60" },
      { name: "Terracotta", value: "#e2725b" },
      { name: "Yellow", value: "#facc15" },
      { name: "Emerald", value: "#10b981" },
      { name: "Rose", value: "#f43f5e" },
      { name: "Indigo", value: "#4f46e5" },
      { name: "Cyan", value: "#06b6d4" },
    ],
  };

  const contactData = {
    badgeText: "Contact",
    heading: "Let's Connect",
    subtitle: "Feel free to reach out for collaborations, job opportunities, or just a friendly chat.",
    contactInfo: [
      { label: "Call / WhatsApp", value: "+91 96279 44998", href: "tel:+919627944998", icon: "HiOutlinePhone" },
      { label: "Email Address", value: "contact@rohitbahuguna.online", href: "mailto:contact@rohitbahuguna.online", icon: "HiOutlineMail" },
      { label: "Base Location", value: "Uttarakhand, India", href: null, icon: "HiOutlineLocationMarker" },
    ],
    web3FormsAccessKey: "",
    socials: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/rohit--bahuguna", icon: "AiFillLinkedin" },
      { label: "GitHub", href: "https://github.com/rohit-bahuguna", icon: "AiFillGithub" },
      { label: "Instagram", href: "https://www.instagram.com/the_rohit_bahuguna", icon: "AiFillInstagram" },
    ],
  };

  const footerData = {
    logoImage: "/Images/rohitsign.png",
    copyrightText: "Rohit Bahuguna. All rights reserved.",
    socials: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/rohit--bahuguna", icon: "AiFillLinkedin" },
      { label: "GitHub", href: "https://github.com/rohit-bahuguna", icon: "AiFillGithub" },
      { label: "Instagram", href: "https://www.instagram.com/the_rohit_bahuguna", icon: "AiFillInstagram" },
    ],
  };

  const seoData = {
    metaTitle: "Rohit Bahuguna | Full Stack Developer",
    metaDescription: "Portfolio of Rohit Bahuguna — Full Stack Developer specialising in modern high-performance web applications, React, and Next.js.",
    keywords: "Rohit Bahuguna, Full Stack Developer, Next.js, React, TypeScript, Portfolio",
    canonicalUrl: "https://rohitbahuguna.online",
    ogImage: "/Images/rohitBahuguna.jpg",
    twitterHandle: "@the_rohit_bahuguna",
  };

  const configs = [
    { key: "header", data: headerData },
    { key: "hero", data: heroData },
    { key: "about", data: aboutData },
    { key: "theme", data: themeData },
    { key: "contact", data: contactData },
    { key: "footer", data: footerData },
    { key: "seo", data: seoData },
  ];

  for (const cfg of configs) {
    for (const state of ["live", "draft"]) {
      await prisma.siteConfig.upsert({
        where: { key_state: { key: cfg.key, state } },
        update: { data: JSON.stringify(cfg.data) },
        create: {
          key: cfg.key,
          state,
          data: JSON.stringify(cfg.data),
        },
      });
    }
  }
  console.log("✅ Site configs seeded for both live and draft states");

  // 3. Seed Projects
  const initialProjects = [
    {
      title: "RIVER VIEW HOMESTAY",
      description: "River View Homestay is a premium guest lodging application in Mukteshwar, Uttarakhand. The entire website is dynamically controlled through a custom admin Content Management System (CMS) supporting live room, gallery, food menu, and blog post operations.",
      tags: JSON.stringify(["Next.js", "Tailwind CSS", "CMS", "SEO"]),
      imageUrl: "/Images/riverview.png",
      githubUrl: "https://github.com/rohit-bahuguna",
      liveUrl: "https://river-view-homestay-dev-sigma.vercel.app/",
      featured: true,
      order: 0,
    },
    {
      title: "YOUR STORE",
      description: "Your Store is a groceries portal for every people out there. This shop is the one-stop solution for any grocery need, be it Fruits, Vegetables, Dairy, Bakery or Beverages. Your Store has it all.",
      tags: JSON.stringify(["React JS", "Tailwind CSS", "E-commerce", "Auth"]),
      imageUrl: "/Images/myStore.png",
      githubUrl: "https://github.com/rohit-bahuguna/your-store",
      liveUrl: "https://store.rohitbahuguna.online",
      featured: true,
      order: 1,
    },
    {
      title: "YOUR STORY",
      description: "Your Story is a social media platform inspired from Instagram to provide users the best of the platform. 'Share moments' - 'Connect' - 'Know the world'",
      tags: JSON.stringify(["React", "Redux", "Tailwind CSS", "Social"]),
      imageUrl: "/Images/yourstory.png",
      githubUrl: "https://github.com/rohit-bahuguna/your-story",
      liveUrl: "https://yourstory.rohitbahuguna.online",
      featured: true,
      order: 2,
    },
  ];

  // Clear existing default projects to avoid duplication on re-seed
  await prisma.project.deleteMany({});
  for (const p of initialProjects) {
    for (const state of ["live", "draft"]) {
      await prisma.project.create({
        data: {
          ...p,
          state,
        },
      });
    }
  }
  console.log(`✅ Seeded ${initialProjects.length} projects`);

  // 4. Seed Skills
  const initialSkills = [
    { name: "React", category: "Frontend", level: 90, order: 0 },
    { name: "Next.js", category: "Frontend", level: 90, order: 1 },
    { name: "Angular", category: "Frontend", level: 85, order: 2 },
    { name: "NestJS", category: "Backend", level: 85, order: 3 },
    { name: "JavaScript", category: "Frontend", level: 95, order: 4 },
    { name: "Node.js", category: "Backend", level: 90, order: 5 },
    { name: "MySQL", category: "Database", level: 85, order: 6 },
    { name: "MongoDB", category: "Database", level: 85, order: 7 },
    { name: "Express", category: "Backend", level: 90, order: 8 },
    { name: "Tailwind CSS", category: "Frontend", level: 95, order: 9 },
    { name: "Redux", category: "Frontend", level: 85, order: 10 },
    { name: "Java", category: "Backend", level: 75, order: 11 },
    { name: "Git", category: "Tools", level: 90, order: 12 },
    { name: "HTML5", category: "Frontend", level: 95, order: 13 },
    { name: "CSS3", category: "Frontend", level: 95, order: 14 },
  ];

  await prisma.skill.deleteMany({});
  for (const s of initialSkills) {
    for (const state of ["live", "draft"]) {
      await prisma.skill.create({
        data: {
          ...s,
          state,
        },
      });
    }
  }
  console.log(`✅ Seeded ${initialSkills.length} skills`);

  // 5. Seed Media Assets
  const initialMedia = [
    { name: "Profile Portrait", fileName: "rohitBahuguna.jpg", url: "/Images/rohitBahuguna.jpg", mimeType: "image/jpeg", sizeBytes: 150000 },
    { name: "River View Homestay", fileName: "riverview.png", url: "/Images/riverview.png", mimeType: "image/png", sizeBytes: 500000 },
    { name: "Your Store", fileName: "myStore.png", url: "/Images/myStore.png", mimeType: "image/png", sizeBytes: 500000 },
    { name: "Your Story", fileName: "yourstory.png", url: "/Images/yourstory.png", mimeType: "image/png", sizeBytes: 500000 },
    { name: "Signature Logo", fileName: "rohitsign.png", url: "/Images/rohitsign.png", mimeType: "image/png", sizeBytes: 80000 },
  ];

  await prisma.media.deleteMany({});
  for (const m of initialMedia) {
    await prisma.media.create({
      data: m,
    });
  }
  console.log(`✅ Seeded ${initialMedia.length} media records`);

  console.log("✨ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
