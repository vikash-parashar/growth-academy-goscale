/** @type {import('next').NextConfig} */
const patterns = [
  { protocol: "http", hostname: "localhost", port: "8080", pathname: "/uploads/**" },
  { protocol: "https", hostname: "img.youtube.com", pathname: "/vi/**" },
];

try {
  const raw = process.env.NEXT_PUBLIC_API_URL;
  if (raw) {
    const u = new URL(raw);
    patterns.push({
      protocol: u.protocol.replace(":", ""),
      hostname: u.hostname,
      pathname: "/uploads/**",
      ...(u.port ? { port: u.port } : {}),
    });
  }
} catch {
  /* ignore */
}

const nextConfig = {
  images: {
    remotePatterns: patterns,
  },
};

export default nextConfig;
