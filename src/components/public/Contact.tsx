"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send, MessageCircle, Check } from "lucide-react";
import { metaPixelEvents } from "@/utils/metaPixel";
import { fetchSettingsCached } from "@/lib/settings-cache";
import { parseLeadTrackingFromStorage } from "@/lib/tracking/capture";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

interface ContactSettings {
  contactInfo?: {
    phone?: string;
    email?: string;
    whatsapp?: string;
    address?: string;
  };
  whatsappConfig?: {
    number?: string;
    defaultMessage?: string;
  };
}

/* Número de fallback, usado apenas se as configurações do site não carregarem. */
const FALLBACK_WHATSAPP = "5585997314093";

function buildWhatsAppUrl(number: string, message: string) {
  const digits = (number || FALLBACK_WHATSAPP).replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [waUrl, setWaUrl] = useState("");
  const [error, setError] = useState("");
  const [settings, setSettings] = useState<ContactSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await fetchSettingsCached<ContactSettings>();
        setSettings(data ?? null);
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, []);

  const contactInfo = settings?.contactInfo || {};
  const whatsappNumber = settings?.whatsappConfig?.number || FALLBACK_WHATSAPP;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    metaPixelEvents.lead({
      content_name: "Contact Form",
      content_category: "Contact",
    });

    try {
      /* O lead é registrado no Firestore via /api/track, que já trata
         o evento enviou_mensagem. Se o tracking não existir, o contato
         segue pelo WhatsApp de qualquer forma. */
      const tracking = parseLeadTrackingFromStorage();

      const observacao = [
        `Nome: ${formData.name}`,
        `E-mail: ${formData.email}`,
        formData.phone ? `Telefone: ${formData.phone}` : null,
        `Mensagem: ${formData.message}`,
      ]
        .filter(Boolean)
        .join(" | ");

      if (tracking?.code) {
        await fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          keepalive: true,
          body: JSON.stringify({
            event: "enviou_mensagem",
            code: tracking.code,
            gclid: tracking.gclid || null,
            utms: tracking.utms || {},
            landingPage: window.location.pathname,
            userAgent: navigator.userAgent,
            observacao,
          }),
        }).catch(() => undefined);
      }

      /* Conversa imediata no WhatsApp, já com tudo o que foi preenchido. */
      const message = [
        "Olá! Vim pelo site da Passeio Legal e gostaria de falar com vocês.",
        "",
        `*Nome:* ${formData.name}`,
        `*E-mail:* ${formData.email}`,
        formData.phone ? `*Telefone:* ${formData.phone}` : null,
        "",
        `*Mensagem:* ${formData.message}`,
      ]
        .filter(Boolean)
        .join("\n");

      setWaUrl(buildWhatsAppUrl(whatsappNumber, message));
      setIsSubmitted(true);
    } catch (err) {
      console.error("Erro ao enviar contato:", err);
      setError(
        "Não foi possível enviar agora. Fale com a gente pelo WhatsApp enquanto isso."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-14 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Entre em Contato
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Estamos aqui para ajudar você a planejar sua próxima aventura
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-12">
          {/* Contact Info */}
          <div className="space-y-8">
            {contactInfo.phone && (
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="text-primary-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Telefone</h3>
                  <p className="text-gray-600">{contactInfo.phone}</p>
                </div>
              </div>
            )}

            {contactInfo.email && (
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="text-primary-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">E-mail</h3>
                  <p className="text-gray-600">{contactInfo.email}</p>
                </div>
              </div>
            )}

            {contactInfo.whatsapp && (
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="text-primary-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">WhatsApp</h3>
                  <p className="text-gray-600">{contactInfo.whatsapp}</p>
                </div>
              </div>
            )}

            {contactInfo.address && (
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-primary-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Endereço</h3>
                  <p className="text-gray-600">{contactInfo.address}</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              {isSubmitted ? (
                <div className="space-y-5">
                  <div className="flex items-center gap-3 text-green-700">
                    <span className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                      <Check size={20} />
                    </span>
                    <p className="font-semibold text-lg">
                      Recebemos seus dados, {formData.name}!
                    </p>
                  </div>
                  <p className="text-gray-600">
                    Falta um passo: toque no botão abaixo para abrir o WhatsApp
                    com sua mensagem já preenchida.{" "}
                    <strong>
                      Se a janela não abrir sozinha, o botão resolve.
                    </strong>
                  </p>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#1da851] text-white font-semibold px-8 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={20} />
                    Abrir conversa no WhatsApp
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Seu nome"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      E-mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Telefone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="(85) 99999-9999"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Mensagem
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      placeholder="Como podemos ajudar?"
                    />
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold px-8 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Send size={20} />
                    <span>
                      {isSubmitting ? "Enviando..." : "Enviar e abrir o WhatsApp"}
                    </span>
                  </button>
                </form>
              )}
            </div>

            {/* Map */}
            <div className="w-full h-80 rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps?q=Avenida+Oceano+Atlantico+683+-+Porto+das+Dunas,+Aquiraz+-+CE,+61700-000&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Passeio Legal - Localização"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
