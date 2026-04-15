import { HomePageContent } from "@/components/home-page-content";

const waDigits = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") ?? "";

export default function HomePage() {
  return <HomePageContent whatsappDigits={waDigits} />;
}
