import { MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '971045913307';
const WHATSAPP_MESSAGE = "Hi Zeemac Filters, I'd like to enquire about your filtration products";

export default function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
  return (
    <a href={href} className="whatsapp-fab" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">
      <MessageCircle className="w-7 h-7" />
    </a>
  );
}
