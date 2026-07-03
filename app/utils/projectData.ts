import { IconType } from "react-icons";
import {
  SiCss,
  SiExpress,
  SiMongodb,
  SiReact,
  SiRedux,
  SiNodedotjs,
  SiTailwindcss,
  SiNextdotjs,
} from "react-icons/si";

export interface TechItem {
  title: string;
  Icon: IconType;
}

export interface Project {
  background: string;
  image: string;
  heading: string;
  tech: TechItem[];
  description: string;
  points: string[];
  githubUrl: string;
  liveUrl: string;
}

export const projects: Project[] = [
  {
    background: "red",
    image: "/Images/riverview.png",
    heading: "RIVER VIEW HOMESTAY",
    tech: [
      {
        title: "Next.js",
        Icon: SiNextdotjs,
      },
      {
        title: "Tailwind CSS",
        Icon: SiTailwindcss,
      },
    ],
    description:
      "River View Homestay is a premium guest lodging application in Mukteshwar, Uttarakhand. The entire website is dynamically controlled through a custom admin Content Management System (CMS) supporting live room, gallery, food menu, and blog post operations.",
    points: [
      "Custom-built admin CMS for full site control",
      "Dynamic room, blog, and gallery management",
      "Integrated WhatsApp inquiry booking flow",
      "Highly optimized Next.js SEO & performance",
    ],
    githubUrl: "https://github.com/rohit-bahuguna",
    liveUrl: "https://river-view-homestay-dev-sigma.vercel.app/",
  },
  {
    background: "red",
    image: "/Images/myStore.png",
    heading: "YOUR STORE",
    tech: [
      {
        title: "React JS",
        Icon: SiReact,
      },
      {
        title: "Tailwind CSS",
        Icon: SiTailwindcss,
      },
    ],
    description:
      "Your Store is a groceries portal for every people out there. This shop is the one-stop solution for any grocery need, be it Fruits, Vegetables, Dairy, Bakery or Beverages. Your Store has it all.",
    points: [
      "Product filter for easy access",
      "User authentication",
      "Cart Management",
      "Wishlist Management",
    ],
    githubUrl: "https://github.com/rohit-bahuguna/your-store",
    liveUrl: "https://store.rohitbahuguna.online",
  },
  {
    background: "red",
    image: "/Images/yourstory.png",
    heading: "YOUR STORY",
    tech: [
      {
        title: "React",
        Icon: SiReact,
      },
      {
        title: "Redux",
        Icon: SiRedux,
      },
      {
        title: "Tailwind CSS",
        Icon: SiTailwindcss,
      },
    ],
    description:
      "Your Story is a social media platform inspired from Instagram to provide users the best of the platform. 'Share moments' - 'Connect' - 'Know the world'",
    points: [
      "Post photo with caption",
      "Follow/Unfollow users",
      "Like and Comment post",
      "Great user experience",
    ],
    githubUrl: "https://github.com/rohit-bahuguna/your-story",
    liveUrl: "https://yourstory.rohitbahuguna.online",
  },
  
];
