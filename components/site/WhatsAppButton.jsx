import { MessageCircle } from 'lucide-react';
import { whatsappUrl } from '@/lib/contact';

const WHATSAPP_MESSAGE = "Hi Zeemac Filters, I'd like to enquire about your filtration products";

export default function WhatsAppButton({ number }) {
  return (
    <a
      href={whatsappUrl(number, WHATSAPP_MESSAGE)}
      className="whatsapp-fab"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
}
