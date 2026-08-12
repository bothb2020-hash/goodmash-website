export type AgentAction =
  | "fix-connection"
  | "create-ticket"
  | "contact-support"
  | "view-pricing";

export interface AgentReply {
  reply: string;
  actions?: AgentAction[];
}

const SLANG: Record<string, string> = {
  "mara": "but",
  "bro": "friend",
  "bru": "friend",
  "bra": "friend",
  "mkhulu": "big",
  "hayi": "no",
  "ngicela": "please",
  "ndicela": "please",
  "ngiyacela": "please",
  "ke kopa": "please",
  "bona": "see",
  "yini": "what",
  "ini": "what",
  "refuse go connect": "refuses to connect",
  "e refuse": "refuses",
  "kasi": "township",
  "yebo": "yes",
  "aikona": "no",
  "slaap": "sleep",
  "lekker": "nice",
  "sharp": "great",
  "sjoe": "wow",
  "eish": "oh no",
  "ake": "please",
  "sebenzisa": "use",
  "phinda": "again",
  "kushona": "is down",
  "kufile": "is dead",
  "stuck": "stuck",
};

const LANGUAGE_HINTS: { lang: string; words: string[] }[] = [
  { lang: "isiZulu", words: ["ngicela", "yini", "wena", "yebo", "hlale", "bona", "noma", "kanti", "sebenza"] },
  { lang: "isiXhosa", words: ["ndicela", "molo", "ngu", "hayi", "bona", "ukuza"] },
  { lang: "Afrikaans", words: ["asseblief", "baie", "dankie", "ja", "nee", "help", "moet", "kan"] },
  { lang: "Sepedi", words: ["dumela", "ke kopa", "thusa", "sephiri"] },
  { lang: "Setswana", words: ["dumela", "ke kopa", "thusa", "le fa"] },
  { lang: "Sesotho", words: ["dumela", "kopa", "thusa", "leha"] },
];

function normalize(text: string): string {
  let t = text.toLowerCase().trim();
  for (const [from, to] of Object.entries(SLANG)) {
    t = t.split(from).join(to);
  }
  return t.replace(/\s+/g, " ").trim();
}

function detectLanguages(text: string): string[] {
  const found: string[] = [];
  for (const hint of LANGUAGE_HINTS) {
    if (hint.words.some((w) => text.toLowerCase().includes(w))) {
      found.push(hint.lang);
    }
  }
  return found;
}

interface Rule {
  test: RegExp;
  reply: string;
  actions?: AgentAction[];
}

const RULES: Rule[] = [
  {
    test: /fix-connection|fix my connection|connection.*stuck|refus.*connect|can'?t connect|not connecting|no internet|won'?t work/i,
    reply:
      "I can run a safe diagnostic on your GoodMash account, membership, authorization and connection status. Tap the button and I'll walk through the steps. Please note: any fix shown here is a demonstration of the process, not a real action on your device.",
    actions: ["fix-connection"],
  },
  {
    test: /ticket|human|escalate|real person|support agent|help me now/i,
    reply:
      "I can't safely resolve this automatically on my own, so I'm happy to escalate your issue to GoodMash support. Tap the button and give me a short description so I can create a support ticket with only the information needed.",
    actions: ["create-ticket"],
  },
  {
    test: /vip/i,
    reply:
      "VIP is an optional enhanced group membership. It lets you stay associated with your existing group while participating in another group where permitted.\n\nVIP pricing:\n• R10 base monthly maintenance\n• R5 extra for each additional VIP group\n\nExample: GoodMash maintenance R10 + one additional VIP group R5 = R15 per month.\n\nWould you like to see the full pricing breakdown?",
    actions: ["view-pricing"],
  },
  {
    test: /vvip/i,
    reply:
      "VVIP is the more advanced multi-group option for users who need greater flexibility between multiple authorized groups.\n\nVVIP pricing:\n• R10 base monthly maintenance\n• R10 extra per VVIP group\n\nImportant: VVIP does not override group-owner authorization — owners still control who can join.\n\nWant the full pricing breakdown?",
    actions: ["view-pricing"],
  },
  {
    test: /price|cost|fee|how much|maintenance|r10|r5|r20|rand|money|pay/i,
    reply:
      "Every new GoodMash account gets 30 days free. After that, it's an App Monthly Maintenance Fee of R10 per month. This is an app/platform maintenance fee — it is NOT the price of mobile data.\n\nOptions:\n• Standard — R10/month\n• VIP — R10 base + R5 per additional VIP group\n• VVIP — R10 base + R10 per VVIP group\n\nYou can maintain yourself, your family group, selected members, sponsor another member, or set up rotating responsibility. Tap below for the full pricing page.",
    actions: ["view-pricing"],
  },
  {
    test: /ozow|payment provider|payfast|flash|payment|secure pay|checkout/i,
    reply:
      "Payments are securely processed through supported payment providers such as Ozow. Payment verification always happens through the GoodMash backend — no payment credentials are ever exposed on the website or app. Final amounts are always calculated by the backend. Tap below to see pricing and the checkout flow.",
    actions: ["view-pricing"],
  },
  {
    test: /group|family|student|friends|community|create.*group|join.*group/i,
    reply:
      "GoodMash groups are private and authorization-controlled. You can create or join groups like Family, Students, Friends, Community, or a custom group.\n\nA GoodMash account is separate from a GoodMash group — one account can participate in multiple groups where permitted, and the group owner approves every member. Owners control who joins, who can access connections, and who can be removed.",
  },
  {
    test: /how.*work|how.*connect|what is goodmash|what.*goodmash|how does/i,
    reply:
      "GoodMash.io is a connectivity platform that helps people create private networks and connect authorized members through participating users' existing Internet connectivity.\n\nIn simple terms: a connection owner approves authorized members, GoodMash securely establishes the authorized connection, and members use it according to their permissions and supported device capabilities. GoodMash is NOT a mobile network operator and does NOT sell mobile data bundles.",
  },
  {
    test: /security|safe|secure|private|encrypt|hack/i,
    reply:
      "GoodMash is designed around secure authentication, authorization, encrypted communications, private groups, controlled membership, connection authorization, session management, access revocation, payment verification, rate limiting, security monitoring and auditability. Our support team never asks for your passwords or payment credentials. Please see the Security page for the public principles.",
  },
  {
    test: /device|phone|android|iphone|ios|huawei|emui|samsung|xiaomi|oppo|vivo|realme|nokia|tecno|infinix|hisense|zte|motorola|oneplus|google|sony|redmi|poco/i,
    reply:
      "GoodMash.io targets Android, iPhone/iOS, and Huawei/EMUI device ecosystems. Actual features can vary according to operating-system and device capabilities. Operating systems may restrict background networking, VPN functionality, packet forwarding, battery usage, hotspot sharing or App Store capabilities — GoodMash adapts to those constraints. We only claim compatibility that has been technically verified.",
  },
  {
    test: /language|zulu|xhosa|afrikaans|sepedi|setswana|sesotho|swati|venda|tsonga|ndebele|speak|translate|slang|kasi/i,
    reply:
      "The GoodMash AI Agent is designed to understand English, isiZulu, isiXhosa, Afrikaans, Sepedi, Setswana, Sesotho, siSwati, Tshivenda, Xitsonga and isiNdebele — including mixed-language speech, South African slang, kasi language, Spitori and code-switching. You can speak to me naturally, for example: 'Bro my GoodMash e refuse go connect mara' — and I'll understand the meaning.",
  },
  {
    test: /voice|voice note|listen|speak/i,
    reply:
      "Voice support is planned for the GoodMash Agent. Eventually you'll be able to send voice notes and choose whether the agent replies in text or voice, in supported languages and on supported devices. This feature will be released once it has been technically verified.",
  },
  {
    test: /download|app store|play store|appgallery|install|get.*app/i,
    reply:
      "GoodMash will be distributed through Google Play, Huawei AppGallery, Apple App Store and this website's Download page. We will only activate official store links after the applications are approved and published — so we never show fake download buttons. Check the Download page for the latest status.",
  },
  {
    test: /contact|whatsapp|phone|email|call|tiktok|youtube|reach|talk to/i,
    reply:
      "You can reach GoodMash.io at:\n• WhatsApp / Calls: +27 69 331 3143\n• Email: teenage2023bt@gmail.com\n• TikTok: @teenage910\n• YouTube: DJTeenage-Virus\n\nFor anything I can't solve safely, I'll escalate to GoodMash support.",
    actions: ["contact-support"],
  },
  {
    test: /demo|preview|try|sample/i,
    reply:
      "You can explore a clearly-marked DEMO of GoodMash — account creation, sample family, groups, connection status, maintenance, VIP/VVIP and more. It's a preview only: it never pretends that a simulated connection is a real Internet tunnel. Check the Demo page from the footer.",
  },
  {
    test: /hello|hi|hey|sawubona|molo|dumela|howzit|how are you|good (day|morning|afternoon|evening)/i,
    reply:
      "Sawubona! Hello! I'm the GoodMash AI Agent — your 24/7 assistant for accounts, groups, connections, maintenance, payments, device support and troubleshooting. I'm an AI assistant, not a human employee. How can I help you today?",
  },
  {
    test: /thank|thanks|dankie|ngiyabonga|siyabonga|ngiyathokoza/i,
    reply:
      "Uyemukelwa — you're welcome! If you need anything else, I'm here 24/7.",
  },
];

function fallbackReply(text: string): AgentReply {
  const langs = detectLanguages(text);
  if (langs.length > 0) {
    return {
      reply: `I heard you in ${langs.join(" and ")} — I'm still learning, but I understand the intent and I'm designed to support all 11 South African official languages, South African slang and mixed-language messages.\n\nFor now, could you tell me in simple words what you need help with? For example: pricing, groups, connections, payments, devices, or escalating to support.`,
    };
  }
  return {
    reply:
      "I'm not 100% sure about that one yet — but I'm here to help with accounts, groups, connections, maintenance, payments, device compatibility, troubleshooting and support tickets.\n\nTry asking me about pricing, VIP/VVIP, how GoodMash works, or tap below to escalate to a human-style support ticket if you're stuck.",
    actions: ["create-ticket", "contact-support"],
  };
}

export function getAgentReply(rawMessage: string): AgentReply {
  const text = normalize(rawMessage);
  for (const rule of RULES) {
    if (rule.test.test(text)) {
      return { reply: rule.reply, actions: rule.actions };
    }
  }
  return fallbackReply(text);
}
