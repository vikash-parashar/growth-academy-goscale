/**
 * Learning hub — AWS essentials for application developers.
 */
import type { GuideSection } from "@/data/deployment-guide-sections";

export const AWS_SECTIONS: GuideSection[] = [
  {
    id: "global-primitives",
    eyebrow: "Map of the cloud",
    title: "Regions, AZs, and accounts",
    blocks: [
      {
        type: "p",
        text:
          "AWS is partitioned into Regions (e.g. `us-east-1`). Each Region has multiple isolated Availability Zones (data centres with fast links). Resources are regional except a few global ones (IAM, CloudFront, Route 53). Separate prod and sandbox with AWS accounts, not just tags.",
      },
    ],
  },
  {
    id: "iam",
    eyebrow: "Security baseline",
    title: "IAM — who can do what",
    blocks: [
      {
        type: "p",
        text:
          "IAM users, roles, and policies control API access. Prefer IAM roles for workloads (EC2 instance profile, Lambda execution role) over long-lived access keys on laptops. Principle of least privilege: grant only the actions and ARNs needed.",
      },
      {
        type: "callout",
        variant: "caution",
        title: "Keys",
        body:
          "If access keys leak, attackers can spin resources in your bill. Rotate keys, use SSO where possible, and enable MFA for human users.",
      },
    ],
  },
  {
    id: "compute-storage",
    eyebrow: "Building blocks",
    title: "EC2, Lambda, S3 — when to use which",
    blocks: [
      {
        type: "ul",
        items: [
          "EC2 — full VMs you manage (patching, scaling groups, load balancers). Good when you need specific OS packages or long-lived connections.",
          "Lambda — run code on events; no servers to patch; pay per invocation and duration; cold starts and timeouts matter.",
          "S3 — object storage for assets, backups, and static sites; versioning and lifecycle rules manage retention costs.",
        ],
      },
    ],
  },
  {
    id: "rds-vpc",
    eyebrow: "Data + network",
    title: "RDS, networking, and security groups",
    blocks: [
      {
        type: "p",
        text:
          "RDS (and Aurora) are managed relational databases — patching and backups delegated to AWS. A VPC is your private network; subnets can be public or private. Security groups are stateful firewalls attached to ENIs — allow inbound Postgres only from your app tier.",
      },
    ],
  },
  {
    id: "billing-ops",
    eyebrow: "Real world",
    title: "Cost alarms, CloudWatch, and support",
    blocks: [
      {
        type: "p",
        text:
          "Set billing alarms early. Use CloudWatch metrics and logs for latency, errors, and saturation. Tag resources (`env=prod`, `team=growth`) so cost reports are explainable. Read service quotas before launch day traffic spikes.",
      },
    ],
  },
];
