import { Github, Linkedin, Instagram, Code2 } from "lucide-react"

const socialLinks = [
  {
    id: "github",
    label: "GitHub",
    username: "@nipunn-git",
    url: "https://github.com/nipunn-git",
    Icon: Github,
    color: "#ffffff",
    gradient: "from-gray-700 to-gray-900",
    description: "Check out my open source work",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    username: "nipun",
    url: "https://www.linkedin.com/in/nipun-712b2536b/",
    Icon: Linkedin,
    color: "#0A66C2",
    gradient: "from-blue-700 to-blue-900",
    description: "Let's connect professionally",
  },
  {
    id: "instagram",
    label: "Instagram",
    username: "@nipunndhiman",
    url: "https://www.instagram.com/nipunndhiman",
    Icon: Instagram,
    color: "#E1306C",
    gradient: "from-pink-600 to-purple-800",
    description: "Follow my creative journey",
  },
  {
    id: "leetcode",
    label: "LeetCode",
    username: "@nipunndhiman",
    url: "https://leetcode.com/u/nipunndhiman/",
    Icon: Code2,
    color: "#FFA116",
    gradient: "from-yellow-600 to-orange-800",
    description: "See my problem-solving skills",
  },
]

export default socialLinks
