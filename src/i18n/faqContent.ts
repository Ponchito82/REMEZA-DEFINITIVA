import type { Language } from "../types/app";

/**
 * Contenido de "Preguntas frecuentes". Sale de Remeza_Preguntas_Frecuentes.docx;
 * el ingles es traduccion de ese mismo documento.
 */

export type FaqQuestion = {
  question: string;
  /** Parrafo de respuesta. Si trae `items`, va antes de la lista. */
  answer: string;
  items?: string[];
};

export type FaqSection = {
  key: string;
  title: string;
  questions: FaqQuestion[];
};

export type FaqFee = { concept: string; cost: string };

export type FaqContent = {
  title: string;
  intro: string;
  sections: FaqSection[];
  feesTitle: string;
  feesIntro: string;
  fees: FaqFee[];
  feesNote: string;
  moreTitle: string;
  moreSubtitle: string;
  /** Texto antes del enlace y texto del enlace, van en una sola frase */
  termsPrompt: string;
  termsLink: string;
};

/** Datos de contacto del documento. */
export const FAQ_CONTACT = {
  email: "hola@remeza.app",
  phone: "+1 (773) 263-1785",
  website: "remeza.app",
} as const;

/**
 * A donde lleva el enlace de Terminos y Condiciones. Es el sitio de Remeza:
 * cambiar por la direccion exacta de la pagina cuando exista.
 */
export const TERMS_URL = "https://remeza.app";

const es: FaqContent = {
  title: "Preguntas frecuentes",
  intro:
    "Aquí respondemos las dudas más comunes sobre tu cuenta Remeza, tu tarjeta de débito y tus envíos de dinero a México. Si no encuentras tu respuesta, escríbenos a hola@remeza.app o llámanos al +1 (773) 263-1785: te atendemos en español.",
  sections: [
    {
      key: "about",
      title: "Sobre Remeza",
      questions: [
        {
          question: "¿Qué es Remeza?",
          answer:
            "Remeza es una aplicación de tecnología financiera (fintech) creada para la comunidad migrante. Con una sola app puedes abrir una cuenta digital, recibir tu pago, tener una tarjeta de débito VISA® y enviar dinero a México de forma rápida, segura y a bajo costo.",
        },
        {
          question: "¿Remeza es un banco?",
          answer:
            "No. Remeza es una empresa de tecnología financiera, no un banco. Los servicios bancarios, la custodia de tu dinero y la emisión de la tarjeta VISA® los realizan instituciones financieras aliadas y reguladas en Estados Unidos. Remeza te da la aplicación y el servicio.",
        },
        {
          question: "¿Qué necesito para abrir mi cuenta?",
          answer:
            "Solo necesitas ser mayor de 18 años, un teléfono celular y una identificación válida. Aceptamos identificación extranjera (por ejemplo, matrícula consular o pasaporte). Te pediremos tu nombre, dirección, fecha de nacimiento, correo y teléfono. El número de Seguro Social es opcional.",
        },
        {
          question: "¿Me revisan el crédito?",
          answer:
            "No. No hacemos revisión de crédito ni consultamos tu historial crediticio. Abrir tu cuenta no afecta tu score.",
        },
        {
          question: "¿Cuánto tarda la apertura?",
          answer:
            "Minutos. Todo el proceso es desde tu celular: descargas la app, tomas foto de tu identificación, verificamos tus datos y tu cuenta queda lista. Recibes tu tarjeta virtual de inmediato y tu tarjeta física llega por correo.",
        },
      ],
    },
    {
      key: "transfers",
      title: "Envíos de dinero a México",
      questions: [
        {
          question: "¿Cuánto cuesta enviar dinero a México?",
          answer:
            "Cobramos una tarifa fija y transparente de $2.99 dólares por envío, más un margen de 2% sobre el tipo de cambio del mercado. En un envío de $400 dólares, eso es aproximadamente $10.99 dólares en total: por debajo de lo que suelen cobrar Western Union o MoneyGram por el mismo envío.",
        },
        {
          question: "¿Qué tipo de cambio recibo?",
          answer:
            "Antes de confirmar tu envío, la app te muestra exactamente cuántos pesos va a recibir tu familiar. No hay sorpresas ni cargos escondidos: el tipo de cambio y la comisión se ven en la misma pantalla. El tipo de cambio se actualiza según el mercado, así que puede variar de un día a otro.",
        },
        {
          question: "¿Cuánto tarda en llegar el dinero?",
          answer:
            "La mayoría de los envíos llegan el mismo día. El tiempo exacto depende del banco receptor en México y de su horario de operación.",
        },
        {
          question: "¿Cómo recibe el dinero mi familiar en México?",
          answer:
            "Puedes enviar directamente a una cuenta bancaria en México o a la tarjeta Remeza de tu familiar, para que disponga del dinero en efectivo en cajeros o lo use en comercios.",
        },
        {
          question: "¿Hay un envío exprés?",
          answer:
            "Sí. Si necesitas prioridad, puedes agregar el servicio exprés por $1.00 dólar adicional por envío.",
        },
        {
          question: "¿Hay límites en los montos que puedo enviar?",
          answer:
            "Sí. Por regulación existen límites por transacción, por día y por mes, que dependen del nivel de verificación de tu cuenta. Puedes consultar tus límites vigentes dentro de la app, en la sección de tu perfil.",
        },
      ],
    },
    {
      key: "card",
      title: "Tarjeta de débito Remeza VISA®",
      questions: [
        {
          question: "¿Cómo obtengo mi tarjeta y cuánto cuesta?",
          answer:
            "Tu tarjeta virtual se activa al abrir la cuenta. La tarjeta física tiene un costo único de emisión de $6.99 dólares y llega a tu domicilio. Tiene chip EMV, pago sin contacto (contactless) y funciona con billeteras móviles.",
        },
        {
          question: "¿Dónde puedo usar la tarjeta?",
          answer:
            "En cualquier comercio o cajero que acepte VISA®, en Estados Unidos, en México y en el resto del mundo, tanto en tiendas físicas como en compras por internet. Tienes acceso a más de 30,000 cajeros de la red MoneyPass sin recargo del cajero.",
        },
        {
          question: "¿Puedo recibir mi pago de nómina en la tarjeta?",
          answer:
            "Sí. Puedes configurar tu depósito directo con tu empleador y recibir tu sueldo en tu cuenta Remeza, normalmente antes que con un cheque tradicional. Tu empleador también puede depositar por transferencia ACH o wire.",
        },
        {
          question: "¿Cómo pongo dinero en mi cuenta?",
          answer: "Puedes fondear tu cuenta de estas formas:",
          items: [
            "Depósito directo de tu nómina.",
            "Transferencia ACH desde otro banco.",
            "Transferencia de banco a tarjeta o de tarjeta a tarjeta.",
            "Efectivo en comercios de la red GreenDot (esos comercios cobran su propia tarifa, que no fija Remeza).",
          ],
        },
        {
          question: "¿Hay compras que la tarjeta no permite?",
          answer:
            "Sí. Por política del programa, la tarjeta no puede usarse en apuestas y juegos de azar ni en servicios para adultos.",
        },
        {
          question: "¿Cuánto dura mi tarjeta y qué hago si la pierdo?",
          answer:
            "La tarjeta tiene una vigencia de 3 años. Si se pierde o te la roban, bloquéala de inmediato desde la app y solicita el reemplazo; la reposición cuesta $5.00 dólares.",
        },
      ],
    },
    {
      key: "security",
      title: "Seguridad y soporte",
      questions: [
        {
          question: "¿Mi dinero está seguro?",
          answer:
            "Sí. Tus fondos se mantienen en cuentas de instituciones financieras aliadas en Estados Unidos y están protegidos conforme a la normativa aplicable. Además, tu cuenta con verificación de identidad, monitoreo de fraude y la posibilidad de bloquear tu tarjeta al instante desde la app.",
        },
        {
          question: "¿Qué hago si veo un cargo que no reconozco?",
          answer:
            "Bloquea tu tarjeta desde la app y contáctanos de inmediato a hola@remeza.app o al +1 (773) 263-1785. Investigamos el caso y te acompañamos en el proceso de reclamación.",
        },
        {
          question: "¿Remeza me va a pedir mi contraseña o mi NIP?",
          answer:
            "Nunca. Ningún empleado de Remeza te pedirá tu contraseña, tu NIP ni los códigos de verificación que llegan a tu teléfono. Si alguien te los pide diciendo que es de Remeza, es un fraude: no compartas nada y repórtalo.",
        },
        {
          question: "¿En qué idioma me atienden y en qué horario?",
          answer:
            "En español, los 7 días de la semana. Puedes escribirnos por el chat de la app, por correo a hola@remeza.app, por WhatsApp o llamarnos al +1 (773) 263-1785.",
        },
        {
          question: "¿Puedo ganar dinero recomendando Remeza?",
          answer:
            "Sí. Por cada persona que invites y abra su cuenta con tu código, recibes un bono de $5.00 dólares. Si tienes un negocio o presencia en tu comunidad, pregúntanos por nuestro programa de afiliados, con comisiones recurrentes.",
        },
      ],
    },
  ],
  feesTitle: "Resumen de comisiones",
  feesIntro: "Todas las comisiones se muestran en la app antes de que confirmes cualquier operación.",
  fees: [
    { concept: "Envío de dinero a México (tarifa fija)", cost: "$2.99 por envío" },
    { concept: "Margen sobre el tipo de cambio", cost: "2% del monto" },
    { concept: "Envío exprés (opcional)", cost: "$1.00 por envío" },
    { concept: "Emisión de tarjeta física", cost: "$6.99 (una sola vez)" },
    { concept: "Cuota mensual de la cuenta (cuenta activa)", cost: "$3.00 al mes" },
    { concept: "Cuota mensual (cuenta sin actividad)", cost: "$1.25 al mes" },
    { concept: "Retiro en cajero automático", cost: "$2.00 por retiro" },
    { concept: "Reposición de tarjeta", cost: "$5.00" },
    { concept: "Compras internacionales", cost: "1.5% de la compra" },
    { concept: "Procesamiento de depósito", cost: "$2.99 por depósito" },
    { concept: "Inactividad (después de 12 meses sin uso)", cost: "$3.00 al mes" },
  ],
  feesNote:
    "Las comisiones pueden cambiar con previo aviso. La versión vigente siempre está disponible en la app y en remeza.app.",
  moreTitle: "¿Tienes otra pregunta?",
  moreSubtitle: "Escríbenos o llámanos, te atendemos en español.",
  termsPrompt: "Si quieres saber más por favor consulta nuestros ",
  termsLink: "Términos y Condiciones",
};

const en: FaqContent = {
  title: "Frequently asked questions",
  intro:
    "Here we answer the most common questions about your Remeza account, your debit card and your money transfers to Mexico. If you can't find your answer, write to us at hola@remeza.app or call +1 (773) 263-1785: we assist you in Spanish.",
  sections: [
    {
      key: "about",
      title: "About Remeza",
      questions: [
        {
          question: "What is Remeza?",
          answer:
            "Remeza is a financial technology (fintech) app created for the migrant community. With a single app you can open a digital account, receive your pay, have a VISA® debit card and send money to Mexico quickly, safely and at a low cost.",
        },
        {
          question: "Is Remeza a bank?",
          answer:
            "No. Remeza is a financial technology company, not a bank. Banking services, custody of your money and the issuing of the VISA® card are provided by partner financial institutions regulated in the United States. Remeza gives you the app and the service.",
        },
        {
          question: "What do I need to open my account?",
          answer:
            "You only need to be over 18, have a mobile phone and a valid ID. We accept foreign IDs (for example, a consular ID or a passport). We will ask for your name, address, date of birth, email and phone number. A Social Security number is optional.",
        },
        {
          question: "Do you check my credit?",
          answer:
            "No. We don't run credit checks or look at your credit history. Opening your account does not affect your score.",
        },
        {
          question: "How long does it take to open an account?",
          answer:
            "Minutes. The whole process is done from your phone: you download the app, take a photo of your ID, we verify your information and your account is ready. You get your virtual card right away and your physical card arrives by mail.",
        },
      ],
    },
    {
      key: "transfers",
      title: "Money transfers to Mexico",
      questions: [
        {
          question: "How much does it cost to send money to Mexico?",
          answer:
            "We charge a flat, transparent fee of $2.99 per transfer, plus a 2% margin over the market exchange rate. On a $400 transfer, that is roughly $10.99 in total: below what Western Union or MoneyGram usually charge for the same transfer.",
        },
        {
          question: "What exchange rate do I get?",
          answer:
            "Before you confirm your transfer, the app shows exactly how many pesos your family member will receive. There are no surprises or hidden charges: the exchange rate and the fee appear on the same screen. The exchange rate follows the market, so it can change from one day to the next.",
        },
        {
          question: "How long does the money take to arrive?",
          answer:
            "Most transfers arrive the same day. The exact time depends on the receiving bank in Mexico and its operating hours.",
        },
        {
          question: "How does my family member receive the money in Mexico?",
          answer:
            "You can send directly to a bank account in Mexico or to your family member's Remeza card, so they can withdraw cash at ATMs or use it in stores.",
        },
        {
          question: "Is there an express transfer?",
          answer: "Yes. If you need priority, you can add the express service for $1.00 extra per transfer.",
        },
        {
          question: "Are there limits on the amounts I can send?",
          answer:
            "Yes. By regulation there are limits per transaction, per day and per month, depending on your account's verification level. You can check your current limits in the app, in your profile section.",
        },
      ],
    },
    {
      key: "card",
      title: "Remeza VISA® debit card",
      questions: [
        {
          question: "How do I get my card and how much does it cost?",
          answer:
            "Your virtual card is activated when you open the account. The physical card has a one-time issuing fee of $6.99 and is delivered to your home. It has an EMV chip, contactless payment and works with mobile wallets.",
        },
        {
          question: "Where can I use the card?",
          answer:
            "At any store or ATM that accepts VISA®, in the United States, in Mexico and around the world, both in physical stores and for online purchases. You have access to more than 30,000 MoneyPass network ATMs with no ATM surcharge.",
        },
        {
          question: "Can I receive my payroll on the card?",
          answer:
            "Yes. You can set up direct deposit with your employer and receive your salary in your Remeza account, usually earlier than with a traditional check. Your employer can also deposit by ACH or wire transfer.",
        },
        {
          question: "How do I add money to my account?",
          answer: "You can fund your account in these ways:",
          items: [
            "Direct deposit of your payroll.",
            "ACH transfer from another bank.",
            "Bank-to-card or card-to-card transfer.",
            "Cash at GreenDot network stores (those stores charge their own fee, which Remeza does not set).",
          ],
        },
        {
          question: "Are there purchases the card doesn't allow?",
          answer:
            "Yes. By program policy, the card cannot be used for betting and gambling or for adult services.",
        },
        {
          question: "How long does my card last and what if I lose it?",
          answer:
            "The card is valid for 3 years. If it is lost or stolen, block it immediately from the app and request a replacement; the replacement costs $5.00.",
        },
      ],
    },
    {
      key: "security",
      title: "Security and support",
      questions: [
        {
          question: "Is my money safe?",
          answer:
            "Yes. Your funds are held in accounts at partner financial institutions in the United States and are protected under applicable regulations. Your account also has identity verification, fraud monitoring and the ability to block your card instantly from the app.",
        },
        {
          question: "What do I do if I see a charge I don't recognize?",
          answer:
            "Block your card from the app and contact us right away at hola@remeza.app or +1 (773) 263-1785. We investigate the case and support you through the claim process.",
        },
        {
          question: "Will Remeza ask for my password or PIN?",
          answer:
            "Never. No Remeza employee will ask for your password, your PIN or the verification codes sent to your phone. If someone asks for them claiming to be from Remeza, it is a scam: don't share anything and report it.",
        },
        {
          question: "What language and hours do you offer support in?",
          answer:
            "In Spanish, 7 days a week. You can write to us through the in-app chat, by email at hola@remeza.app, by WhatsApp or call us at +1 (773) 263-1785.",
        },
        {
          question: "Can I earn money by recommending Remeza?",
          answer:
            "Yes. For every person you invite who opens an account with your code, you get a $5.00 bonus. If you have a business or a presence in your community, ask us about our affiliate program, with recurring commissions.",
        },
      ],
    },
  ],
  feesTitle: "Fee summary",
  feesIntro: "All fees are shown in the app before you confirm any operation.",
  fees: [
    { concept: "Money transfer to Mexico (flat fee)", cost: "$2.99 per transfer" },
    { concept: "Margin over the exchange rate", cost: "2% of the amount" },
    { concept: "Express transfer (optional)", cost: "$1.00 per transfer" },
    { concept: "Physical card issuing", cost: "$6.99 (one time)" },
    { concept: "Monthly account fee (active account)", cost: "$3.00 per month" },
    { concept: "Monthly fee (inactive account)", cost: "$1.25 per month" },
    { concept: "ATM withdrawal", cost: "$2.00 per withdrawal" },
    { concept: "Card replacement", cost: "$5.00" },
    { concept: "International purchases", cost: "1.5% of the purchase" },
    { concept: "Deposit processing", cost: "$2.99 per deposit" },
    { concept: "Inactivity (after 12 months without use)", cost: "$3.00 per month" },
  ],
  feesNote:
    "Fees may change with prior notice. The current version is always available in the app and at remeza.app.",
  moreTitle: "Have another question?",
  moreSubtitle: "Write to us or call us, we assist you in Spanish.",
  termsPrompt: "If you want to know more, please read our ",
  termsLink: "Terms and Conditions",
};

export const FAQ_CONTENT: Record<Language, FaqContent> = { es, en };
