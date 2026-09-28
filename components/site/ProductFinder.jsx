'use client';

import { useState } from 'react';
import Reveal from '@/components/site/Reveal';
import { Send } from 'lucide-react';

const WHATSAPP_NUMBER = '971045913307';

export default function ProductFinder() {
  const [form, setForm] = useState({
    name: '', company: '', email: '', phone: '',
    equipment: '', brand: '', partNumber: '', description: ''
  });

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const lines = [
      'New product requirement:',
      form.name && `Name: ${form.name}`,
      form.company && `Company: ${form.company}`,
      form.email && `Email: ${form.email}`,
      form.phone && `Phone: ${form.phone}`,
      form.equipment && `Equipment/Machine: ${form.equipment}`,
      form.brand && `Brand: ${form.brand}`,
      form.partNumber && `Part Number: ${form.partNumber}`,
      form.description && `Requirement: ${form.description}`
    ].filter(Boolean).join('\n');

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`, '_blank', 'noopener');
  }

  return (
    <section className="section-pad">
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        <Reveal as="div" className="finder-panel">
          <p className="eyebrow eyebrow-light">Looking for a Specific Filter?</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">Can&apos;t find the product you&apos;re looking for?</h2>
          <p className="text-[#C9DAF6] mt-3 max-w-lg">
            Send us the part number, brand, equipment model or filter details, and our team will help you identify the right product.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 grid sm:grid-cols-2 gap-5">
            <div>
              <label className="finder-label" htmlFor="finder-name">Name</label>
              <input id="finder-name" name="name" autoComplete="name" required className="finder-input" value={form.name} onChange={update('name')} placeholder="Your name" />
            </div>
            <div>
              <label className="finder-label" htmlFor="finder-company">Company</label>
              <input id="finder-company" name="company" autoComplete="organization" className="finder-input" value={form.company} onChange={update('company')} placeholder="Company name" />
            </div>
            <div>
              <label className="finder-label" htmlFor="finder-email">Email</label>
              <input id="finder-email" name="email" type="email" autoComplete="email" required className="finder-input" value={form.email} onChange={update('email')} placeholder="you@company.com" />
            </div>
            <div>
              <label className="finder-label" htmlFor="finder-phone">Phone / WhatsApp</label>
              <input id="finder-phone" name="phone" type="tel" autoComplete="tel" className="finder-input" value={form.phone} onChange={update('phone')} placeholder="+971 ..." />
            </div>
            <div>
              <label className="finder-label" htmlFor="finder-equipment">Equipment / Machine</label>
              <input id="finder-equipment" name="equipment" autoComplete="off" className="finder-input" value={form.equipment} onChange={update('equipment')} placeholder="e.g. Marine engine model" />
            </div>
            <div>
              <label className="finder-label" htmlFor="finder-brand">Brand</label>
              <input id="finder-brand" name="brand" autoComplete="off" className="finder-input" value={form.brand} onChange={update('brand')} placeholder="e.g. HYDAC" />
            </div>
            <div className="sm:col-span-2">
              <label className="finder-label" htmlFor="finder-part-number">Part Number</label>
              <input id="finder-part-number" name="partNumber" autoComplete="off" className="finder-input" value={form.partNumber} onChange={update('partNumber')} placeholder="If known" />
            </div>
            <div className="sm:col-span-2">
              <label className="finder-label" htmlFor="finder-description">Requirement Description</label>
              <textarea id="finder-description" name="description" autoComplete="off" rows={4} className="finder-input" value={form.description} onChange={update('description')} placeholder="Describe what you're looking for" />
            </div>

            <div className="sm:col-span-2">
              <button type="submit" className="btn-primary">
                Send Your Requirement <Send className="w-4 h-4" />
              </button>
              <p className="text-xs text-[#9FB4D9] mt-3">
                This opens WhatsApp with your details pre-filled so our team can respond directly. Image/PDF attachment support is coming with the full enquiry system.
              </p>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
