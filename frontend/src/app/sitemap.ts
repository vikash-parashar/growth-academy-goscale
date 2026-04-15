import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const paths = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/story", priority: 0.85, changeFrequency: "monthly" as const },
    { path: "/proof", priority: 0.85, changeFrequency: "monthly" as const },
    { path: "/eligibility", priority: 0.92, changeFrequency: "monthly" as const },
    { path: "/apply", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/mock-test", priority: 0.75, changeFrequency: "monthly" as const },
    { path: "/career-comparison", priority: 0.72, changeFrequency: "monthly" as const },
    { path: "/book", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/pay", priority: 0.65, changeFrequency: "monthly" as const },
    { path: "/changelog", priority: 0.5, changeFrequency: "weekly" as const },
    { path: "/program", priority: 0.78, changeFrequency: "monthly" as const },
    { path: "/content", priority: 0.77, changeFrequency: "weekly" as const },
    { path: "/content/deployment", priority: 0.64, changeFrequency: "monthly" as const },
    { path: "/learning", priority: 0.72, changeFrequency: "weekly" as const },
    { path: "/learning/start-here", priority: 0.73, changeFrequency: "weekly" as const },
    { path: "/learning/go-basics", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/learning/go-advanced", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/learning/go-quality", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/learning/http", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/learning/internet", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/learning/docker", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/learning/cicd", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/learning/aws", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/connect", priority: 0.76, changeFrequency: "monthly" as const },
    { path: "/terms", priority: 0.55, changeFrequency: "monthly" as const },
    { path: "/founder", priority: 0.76, changeFrequency: "monthly" as const },
    { path: "/podcast", priority: 0.74, changeFrequency: "monthly" as const },
    { path: "/pricing", priority: 0.68, changeFrequency: "monthly" as const },
    { path: "/jobs", priority: 0.7, changeFrequency: "daily" as const },
  ];
  const now = new Date();
  return paths.map(({ path, priority, changeFrequency }) => ({
    url: path === "" ? base : `${base}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
