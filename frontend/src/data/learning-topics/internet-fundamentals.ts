/**
 * Learning hub — how the internet works (conceptual layer).
 */
import type { GuideSection } from "@/data/deployment-guide-sections";

export const INTERNET_SECTIONS: GuideSection[] = [
  {
    id: "big-picture",
    eyebrow: "Stack",
    title: "From app to wire — mental model",
    blocks: [
      {
        type: "callout",
        variant: "info",
        title: "Prerequisite",
        body:
          "The Start here tab defines DNS, HTTP basics, and localhost in slow English. Use this tab when you want a layer-by-layer picture of the stack.",
      },
      {
        type: "p",
        text:
          "When your browser loads a page, software stacks cooperate: your app speaks HTTP; the OS opens a TCP socket; IP routes packets across networks; Ethernet/Wi‑Fi/4G carries frames on the last hop. You usually work at HTTP — but knowing the layers below explains timeouts, DNS failures, and TLS errors.",
      },
      {
        type: "ul",
        items: [
          "Application — HTTP, DNS, SSH.",
          "Transport — TCP (reliable, ordered byte stream) or UDP (fire-and-forget, used by DNS queries, video, games).",
          "Network — IP addresses and routing between subnets.",
          "Link — physical medium and local delivery (MAC addresses on LANs).",
        ],
      },
    ],
  },
  {
    id: "dns",
    eyebrow: "Names",
    title: "DNS — names to addresses",
    blocks: [
      {
        type: "p",
        text:
          "DNS maps hostnames to records: A/AAAA (IP addresses), CNAME (alias), MX (mail), TXT (verification, email policy). Resolvers cache answers with a TTL; that's why DNS changes can take minutes to propagate.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "Debugging",
        body:
          "Commands like `dig example.com` or `nslookup` show which records the resolver returns — useful when a site works on one network but not another.",
      },
    ],
  },
  {
    id: "tcp-ip",
    eyebrow: "Packets",
    title: "TCP, ports, and NAT",
    blocks: [
      {
        type: "p",
        text:
          "TCP connects two endpoints identified by IP:port. Servers listen on well-known ports (443 for HTTPS). Outbound connections from home Wi‑Fi share the router's public IP — Network Address Translation (NAT) maps responses back to the right laptop.",
      },
      {
        type: "p",
        text:
          "UDP is simpler: no connection handshake. DNS lookups are often UDP; large responses may fall back to TCP.",
      },
    ],
  },
  {
    id: "cdn-edge",
    eyebrow: "Scale",
    title: "CDNs, edge, and latency",
    blocks: [
      {
        type: "p",
        text:
          "A CDN caches static assets closer to users so bytes travel fewer kilometers. TLS may terminate at the edge; your origin still runs the dynamic API. Latency is RTT (round-trip time) plus server work — put data near users for read-heavy or global apps.",
      },
    ],
  },
];
