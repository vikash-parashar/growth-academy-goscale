export function buildWhatsAppLink(phoneDigits: string, name: string, experience: string) {
  const digits = phoneDigits.replace(/\D/g, "");
  if (!digits) return "";
  const text = encodeURIComponent(
    `Hi, I'm ${name}. I applied on Gopher Lab. Experience: ${experience}`,
  );
  return `https://wa.me/${digits}?text=${text}`;
}
