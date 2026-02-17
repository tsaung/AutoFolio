import { cn } from "@/lib/utils";
import { IconType } from "react-icons";
import { Code2 } from "lucide-react";
import {
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
  SiGo,
  SiRust,
  SiCplusplus,
  SiC,
  SiKotlin,
  SiSwift,
  SiDart,
  SiFlutter,
  SiPhp,
  SiRuby,
  SiHtml5,
  SiCss3,
  SiSass,
  SiTailwindcss,
  SiBootstrap,
  SiVuedotjs,
  SiAngular,
  SiSvelte,
  SiAstro,
  SiVite,
  SiWebpack,
  SiExpress,
  SiNestjs,
  SiFastapi,
  SiDjango,
  SiFlask,
  SiSpringboot,
  SiRubyonrails,
  SiLaravel,
  SiPostgresql,
  SiMysql,
  SiMongodb,
  SiRedis,
  SiSqlite,
  SiSupabase,
  SiFirebase,
  SiPrisma,
  SiDocker,
  SiKubernetes,
  SiAmazonwebservices,
  SiGooglecloud,
  SiVercel,
  SiNetlify,
  SiGit,
  SiGithub,
  SiGitlab,
  SiLinux,
  SiFigma,
  SiGraphql,
  SiApollographql,
  SiElectron,
  SiTauri,
  SiThreedotjs,
  SiOpenai,
  SiTensorflow,
  SiPytorch,
  SiNumpy,
  SiPandas,
  SiJest,
  SiVitest,
  SiCypress,
  SiStorybook,
  SiNpm,
  SiPnpm,
  SiYarn,
  SiBun,
  SiDeno,
  SiNginx,
  SiApache,
  SiElixir,
  SiHaskell,
  SiScala,
  SiLua,
  SiPerl,
  SiR,
  SiJulia,
  SiSolidity,
  SiWeb3Dotjs,
  SiUnity,
  SiUnrealengine,
  SiBlender,
  SiWordpress,
  SiShopify,
  SiStripe,
  SiTwilio,
  SiRabbitmq,
  SiApachekafka,
  SiGrafana,
  SiPrometheus,
  SiJenkins,
  SiGithubactions,
  SiCircleci,
  SiTerraform,
  SiAnsible,
  SiPostman,
  SiInsomnia,
  SiSwagger,
  SiMarkdown,
  SiNotion,
  SiJira,
  SiSlack,
  SiDiscord,
} from "react-icons/si";

// ─── Icon Registry ───────────────────────────────────────────────────────────
// Maps normalized keywords → { icon, color }.
// Multiple aliases point to the same entry so fuzzy matching "just works".

interface IconEntry {
  icon: IconType;
  color: string; // brand hex color
}

const ICON_MAP: Record<string, IconEntry> = {
  // ── Languages ──
  javascript: { icon: SiJavascript, color: "#F7DF1E" },
  js: { icon: SiJavascript, color: "#F7DF1E" },
  typescript: { icon: SiTypescript, color: "#3178C6" },
  ts: { icon: SiTypescript, color: "#3178C6" },
  python: { icon: SiPython, color: "#3776AB" },
  go: { icon: SiGo, color: "#00ADD8" },
  golang: { icon: SiGo, color: "#00ADD8" },
  rust: { icon: SiRust, color: "#000000" },
  "c++": { icon: SiCplusplus, color: "#00599C" },
  cpp: { icon: SiCplusplus, color: "#00599C" },
  c: { icon: SiC, color: "#A8B9CC" },
  kotlin: { icon: SiKotlin, color: "#7F52FF" },
  swift: { icon: SiSwift, color: "#F05138" },
  dart: { icon: SiDart, color: "#0175C2" },
  php: { icon: SiPhp, color: "#777BB4" },
  ruby: { icon: SiRuby, color: "#CC342D" },
  elixir: { icon: SiElixir, color: "#4B275F" },
  haskell: { icon: SiHaskell, color: "#5D4F85" },
  scala: { icon: SiScala, color: "#DC322F" },
  lua: { icon: SiLua, color: "#2C2D72" },
  perl: { icon: SiPerl, color: "#39457E" },
  r: { icon: SiR, color: "#276DC3" },
  julia: { icon: SiJulia, color: "#9558B2" },
  solidity: { icon: SiSolidity, color: "#363636" },

  // ── Frontend Frameworks ──
  react: { icon: SiReact, color: "#61DAFB" },
  reactjs: { icon: SiReact, color: "#61DAFB" },
  "react.js": { icon: SiReact, color: "#61DAFB" },
  "react native": { icon: SiReact, color: "#61DAFB" },
  next: { icon: SiNextdotjs, color: "#3d3d3dff" },
  nextjs: { icon: SiNextdotjs, color: "#3d3d3dff" },
  "next.js": { icon: SiNextdotjs, color: "#3d3d3dff" },
  vue: { icon: SiVuedotjs, color: "#4FC08D" },
  vuejs: { icon: SiVuedotjs, color: "#4FC08D" },
  "vue.js": { icon: SiVuedotjs, color: "#4FC08D" },
  angular: { icon: SiAngular, color: "#DD0031" },
  svelte: { icon: SiSvelte, color: "#FF3E00" },
  astro: { icon: SiAstro, color: "#BC52EE" },
  flutter: { icon: SiFlutter, color: "#02569B" },
  electron: { icon: SiElectron, color: "#47848F" },
  tauri: { icon: SiTauri, color: "#FFC131" },

  // ── Styling ──
  html: { icon: SiHtml5, color: "#E34F26" },
  html5: { icon: SiHtml5, color: "#E34F26" },
  css: { icon: SiCss3, color: "#1572B6" },
  css3: { icon: SiCss3, color: "#1572B6" },
  sass: { icon: SiSass, color: "#CC6699" },
  scss: { icon: SiSass, color: "#CC6699" },
  tailwind: { icon: SiTailwindcss, color: "#06B6D4" },
  tailwindcss: { icon: SiTailwindcss, color: "#06B6D4" },
  bootstrap: { icon: SiBootstrap, color: "#7952B3" },

  // ── Backend Frameworks ──
  node: { icon: SiNodedotjs, color: "#339933" },
  nodejs: { icon: SiNodedotjs, color: "#339933" },
  "node.js": { icon: SiNodedotjs, color: "#339933" },
  express: { icon: SiExpress, color: "#000000" },
  expressjs: { icon: SiExpress, color: "#000000" },
  "express.js": { icon: SiExpress, color: "#000000" },
  nest: { icon: SiNestjs, color: "#E0234E" },
  nestjs: { icon: SiNestjs, color: "#E0234E" },
  "nest.js": { icon: SiNestjs, color: "#E0234E" },
  fastapi: { icon: SiFastapi, color: "#009688" },
  django: { icon: SiDjango, color: "#092E20" },
  flask: { icon: SiFlask, color: "#000000" },
  spring: { icon: SiSpringboot, color: "#6DB33F" },
  "spring boot": { icon: SiSpringboot, color: "#6DB33F" },
  rails: { icon: SiRubyonrails, color: "#CC0000" },
  "ruby on rails": { icon: SiRubyonrails, color: "#CC0000" },
  laravel: { icon: SiLaravel, color: "#FF2D20" },
  deno: { icon: SiDeno, color: "#000000" },
  bun: { icon: SiBun, color: "#FBF0DF" },

  // ── Databases ──
  postgresql: { icon: SiPostgresql, color: "#4169E1" },
  postgres: { icon: SiPostgresql, color: "#4169E1" },
  mysql: { icon: SiMysql, color: "#4479A1" },
  mongodb: { icon: SiMongodb, color: "#47A248" },
  mongo: { icon: SiMongodb, color: "#47A248" },
  redis: { icon: SiRedis, color: "#DC382D" },
  sqlite: { icon: SiSqlite, color: "#003B57" },
  supabase: { icon: SiSupabase, color: "#3FCF8E" },
  firebase: { icon: SiFirebase, color: "#FFCA28" },
  prisma: { icon: SiPrisma, color: "#2D3748" },

  // ── DevOps / Cloud ──
  docker: { icon: SiDocker, color: "#2496ED" },
  kubernetes: { icon: SiKubernetes, color: "#326CE5" },
  k8s: { icon: SiKubernetes, color: "#326CE5" },
  aws: { icon: SiAmazonwebservices, color: "#232F3E" },
  "amazon web services": { icon: SiAmazonwebservices, color: "#232F3E" },
  gcp: { icon: SiGooglecloud, color: "#4285F4" },
  "google cloud": { icon: SiGooglecloud, color: "#4285F4" },

  vercel: { icon: SiVercel, color: "#000000" },
  netlify: { icon: SiNetlify, color: "#00C7B7" },
  nginx: { icon: SiNginx, color: "#009639" },
  apache: { icon: SiApache, color: "#D22128" },
  terraform: { icon: SiTerraform, color: "#7B42BC" },
  ansible: { icon: SiAnsible, color: "#EE0000" },
  jenkins: { icon: SiJenkins, color: "#D24939" },
  "github actions": { icon: SiGithubactions, color: "#2088FF" },
  circleci: { icon: SiCircleci, color: "#343434" },

  // ── Tools ──
  git: { icon: SiGit, color: "#F05032" },
  github: { icon: SiGithub, color: "#181717" },
  gitlab: { icon: SiGitlab, color: "#FC6D26" },
  linux: { icon: SiLinux, color: "#FCC624" },
  figma: { icon: SiFigma, color: "#F24E1E" },
  vite: { icon: SiVite, color: "#646CFF" },
  webpack: { icon: SiWebpack, color: "#8DD6F9" },
  graphql: { icon: SiGraphql, color: "#E10098" },
  apollo: { icon: SiApollographql, color: "#311C87" },
  postman: { icon: SiPostman, color: "#FF6C37" },
  insomnia: { icon: SiInsomnia, color: "#4000BF" },
  swagger: { icon: SiSwagger, color: "#85EA2D" },
  npm: { icon: SiNpm, color: "#CB3837" },
  pnpm: { icon: SiPnpm, color: "#F69220" },
  yarn: { icon: SiYarn, color: "#2C8EBB" },
  storybook: { icon: SiStorybook, color: "#FF4785" },
  notion: { icon: SiNotion, color: "#000000" },
  jira: { icon: SiJira, color: "#0052CC" },
  slack: { icon: SiSlack, color: "#4A154B" },
  discord: { icon: SiDiscord, color: "#5865F2" },
  markdown: { icon: SiMarkdown, color: "#000000" },

  // ── Testing ──
  jest: { icon: SiJest, color: "#C21325" },
  vitest: { icon: SiVitest, color: "#6E9F18" },

  cypress: { icon: SiCypress, color: "#17202C" },

  // ── AI / ML ──
  openai: { icon: SiOpenai, color: "#412991" },
  tensorflow: { icon: SiTensorflow, color: "#FF6F00" },
  pytorch: { icon: SiPytorch, color: "#EE4C2C" },
  numpy: { icon: SiNumpy, color: "#013243" },
  pandas: { icon: SiPandas, color: "#150458" },

  // ── 3D / Game ──
  "three.js": { icon: SiThreedotjs, color: "#000000" },
  threejs: { icon: SiThreedotjs, color: "#000000" },
  unity: { icon: SiUnity, color: "#000000" },
  unreal: { icon: SiUnrealengine, color: "#0E1128" },
  blender: { icon: SiBlender, color: "#F5792A" },

  // ── Services ──
  web3: { icon: SiWeb3Dotjs, color: "#F16822" },
  wordpress: { icon: SiWordpress, color: "#21759B" },
  shopify: { icon: SiShopify, color: "#7AB55C" },
  stripe: { icon: SiStripe, color: "#008CDD" },
  twilio: { icon: SiTwilio, color: "#F22F46" },
  rabbitmq: { icon: SiRabbitmq, color: "#FF6600" },
  kafka: { icon: SiApachekafka, color: "#231F20" },
  grafana: { icon: SiGrafana, color: "#F46800" },
  prometheus: { icon: SiPrometheus, color: "#E6522C" },
};

// ─── Lookup ──────────────────────────────────────────────────────────────────

function findIcon(name: string): IconEntry | null {
  const normalized = name.toLowerCase().trim();

  // 1. Exact match
  if (ICON_MAP[normalized]) return ICON_MAP[normalized];

  // 2. Strip dots, spaces, dashes → try again
  const stripped = normalized.replace(/[\s.\-_]/g, "");
  if (ICON_MAP[stripped]) return ICON_MAP[stripped];

  // 3. Substring match (e.g. "React Native" → contains "react")
  for (const [key, entry] of Object.entries(ICON_MAP)) {
    if (normalized.includes(key) || key.includes(stripped)) {
      return entry;
    }
  }

  return null;
}

// ─── Component ───────────────────────────────────────────────────────────────

interface TechIconProps {
  name: string;
  className?: string;
  showColor?: boolean; // true = brand color, false = inherit
}

export function TechIcon({ name, className, showColor = true }: TechIconProps) {
  const entry = findIcon(name);

  if (!entry) {
    // Fallback: generic code icon
    return <Code2 className={cn("text-muted-foreground", className)} />;
  }

  const Icon = entry.icon;
  return (
    <Icon
      className={className}
      style={showColor ? { color: entry.color } : undefined}
    />
  );
}
