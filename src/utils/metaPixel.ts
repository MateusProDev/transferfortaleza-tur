// Meta Pixel Event Tracking Helper
// Documentation: https://developers.facebook.com/docs/meta-pixel/implementation

declare global {
  interface Window {
    fbq?: (action: string, eventName: string, parameters?: Record<string, any>) => void;
  }
}

export const metaPixelEvents = {
  // Quando alguém clica no WhatsApp ou formulário de contato
  contact: (params?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Contact', params);
    }
  },

  // Quando alguém envia um formulário de interesse em passeios
  lead: (params?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Lead', params);
    }
  },

  // Quando começa o processo de reserva
  initiateCheckout: (params?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'InitiateCheckout', params);
    }
  },

  // Quando uma reserva é concluída
  purchase: (value: number, currency: string = 'BRL', params?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Purchase', {
        value,
        currency,
        ...params
      });
    }
  },

  // Quando alguém pesquisa passeios/transfers
  search: (searchString: string, params?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Search', {
        search_string: searchString,
        ...params
      });
    }
  },

  // Quando alguém agenda um passeio
  schedule: (params?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Schedule', params);
    }
  },

  // Evento personalizado para tracking específico
  customEvent: (eventName: string, params?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', eventName, params);
    }
  }
};
