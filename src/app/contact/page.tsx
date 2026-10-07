"use client";

import { useState, useEffect } from "react";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Send,
  Check,
} from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getSiteUrl } from "@/lib/site-url";
import { fetchSettingsCached } from "@/lib/settings-cache";
import { defaultContactCopy } from "@/lib/site-copy";
import { normalizeBrazilianPhone } from "@/lib/phone";
import type { ContactPageCopy } from "@/types";

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
  pageCopy?: {
    contact?: Partial<ContactPageCopy>;
  };
}

/* Número de fallback, usado apenas se as configurações do site não carregarem. */
const FALLBACK_WHATSAPP = "5585997314093";

const baseUrl = getSiteUrl();

function buildWhatsAppUrl(number: string, message: string) {
  const digits = normalizeBrazilianPhone(number || FALLBACK_WHATSAPP);
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export default function ContactPage() {
  const [settings, setSettings] = useState<ContactSettings | null>(null);
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

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await fetchSettingsCached<ContactSettings>();
        setSettings(data ?? null);
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      /* Conversa imediata no WhatsApp, com o formulário já preenchido. */
      const message = [
        copy.whatsappGreeting,
        "",
        `*Nome:* ${formData.name}`,
        `*E-mail:* ${formData.email}`,
        formData.phone ? `*Telefone:* ${formData.phone}` : null,
        "",
        `*Mensagem:* ${formData.message}`,
      ]
        .filter(Boolean)
        .join("\n");

      const number =
        settings?.whatsappConfig?.number ||
        settings?.contactInfo?.whatsapp ||
        FALLBACK_WHATSAPP;

      setWaUrl(buildWhatsAppUrl(number, message));
      setIsSubmitted(true);
    } catch (err) {
      console.error("Erro ao enviar contato:", err);
      setError(
        copy.submitError
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbItems = [
    { name: "Início", url: baseUrl },
    { name: "Contato", url: `${baseUrl}/contato` },
  ];

  const contactInfo = settings?.contactInfo || {};
  const copy = { ...defaultContactCopy, ...settings?.pageCopy?.contact };
  const whatsappNumber =
    settings?.whatsappConfig?.number || contactInfo.whatsapp || FALLBACK_WHATSAPP;

  return (
    <main className="min-h-screen pt-24">
      <Header />

      <BreadcrumbJsonLd items={breadcrumbItems} />

      <div className="bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {copy.title}
          </h1>
          <p className="text-xl max-w-2xl">
            {copy.introduction}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {copy.detailsTitle}
            </h2>

            <div className="space-y-6">
              {contactInfo.phone && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="text-primary-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {copy.phoneLabel}
                    </h3>
                    <a className="text-gray-600 hover:text-primary-700" href={`tel:+${normalizeBrazilianPhone(contactInfo.phone)}`}>+{normalizeBrazilianPhone(contactInfo.phone)}</a>
                  </div>
                </div>
              )}

              {whatsappNumber && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {copy.whatsappLabel}
                    </h3>
                    <p className="text-gray-600">
                      {contactInfo.whatsapp || copy.whatsappFallback}
                    </p>
                    <a
                      href={buildWhatsAppUrl(
                        whatsappNumber,
                        "Olá! Vim pelo site da Transfer Fortaleza Tur e gostaria de mais informações."
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 font-medium inline-flex items-center gap-1 mt-2"
                    >
                      {copy.whatsappButton}
                    </a>
                  </div>
                </div>
              )}

              {contactInfo.email && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="text-primary-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{copy.emailLabel}</h3>
                    <p className="text-gray-600">{contactInfo.email}</p>
                  </div>
                </div>
              )}

              {contactInfo.address && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-primary-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {copy.addressLabel}
                    </h3>
                    <p className="text-gray-600">{contactInfo.address}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">
                {copy.hoursTitle}
              </h3>
              <p className="text-gray-600">
                {copy.weekdayHours}
                <br />
                {copy.saturdayHours}
                <br />
                {copy.sundayHours}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {copy.formTitle}
            </h2>

            {isSubmitted ? (
              <div className="space-y-5">
                <div className="flex items-center gap-3 text-green-700">
                  <span className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                    <Check size={20} />
                  </span>
                  <p className="font-semibold text-lg">
                    {copy.successGreeting} {formData.name}!
                  </p>
                </div>
                <p className="text-gray-600">
                  {copy.successInstructions}{" "}
                  <strong>{copy.successPopupHint}</strong>
                </p>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#1da851] text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle size={20} />
                  {copy.successButton}
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {copy.nameLabel}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder={copy.namePlaceholder}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {copy.emailFormLabel}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder={copy.emailPlaceholder}
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {copy.phoneFormLabel}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder={copy.phonePlaceholder}
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {copy.messageLabel}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    placeholder={copy.messagePlaceholder}
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
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>{copy.submittingButton}</>
                  ) : (
                    <>
                      <Send size={20} />
                      {copy.submitButton}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
