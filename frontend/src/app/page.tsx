import { RoleBasedHomePageContent } from "@/components/role-based-home-content";

const waDigits = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") ?? "";

export default function HomePage() {
  return <RoleBasedHomePageContent whatsappDigits={waDigits} />;
}
