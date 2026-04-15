import { ConnectPageContent } from "@/components/connect/connect-page-content";

const waDigits = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") ?? "";

export default function ConnectPage() {
  return <ConnectPageContent whatsappDigits={waDigits} />;
}
