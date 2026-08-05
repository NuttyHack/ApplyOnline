/**
 * SKAVS brain — rule-based conversation engine with Zulu support.
 * SKAVS = Smart Knowledge Agent for Verified Student-applications
 *
 * Architecture: state-machine conversations with scripted responses.
 * AI upgrade: when OPENAI_API_KEY becomes available, swap getResponse()
 * to call the LLM — all other logic stays the same.
 */

export type Language = "en" | "zu";

export type SkavsMessage = {
  id: string;
  role: "skavs" | "user";
  content: string;
  timestamp: Date;
  actions?: SkavsAction[];
};

export type SkavsAction = {
  label: string;
  value: string;
  icon?: string;
};

export type SkavsState = {
  stage: SkavsStage;
  language: Language;
  waitingForField?: string;
  extractedFields?: Record<string, string>;
  currentStep?: number;
};

export type SkavsStage =
  | "greeting"
  | "menu"
  | "explain_process"
  | "explain_step"
  | "doc_upload"
  | "doc_verify"
  | "apply_for_user"
  | "subject_help"
  | "track_help"
  | "idle";

// ─── TRANSLATIONS ───────────────────────────────────────────────────────────

const T = {
  greeting: {
    en: `👋 **Sawubona! I'm SKAVS** — your personal admissions assistant at Hoye Secondary School.

I can help you:
• 📋 **Understand** the application process step by step
• 📄 **Auto-fill** your form from uploaded documents
• 🎓 **Choose** the right subjects for your goals
• 🔍 **Track** your application status
• 🗣️ **Speak Zulu** — ngikhona ukusiza ngesiZulu!

What would you like help with?`,
    zu: `👋 **Sawubona! NginguSKAVS** — umsizi wakho wokufaka isicelo esikoleni iHoye Secondary School.

Ngingakusiza:
• 📋 **Ukuqonda** inqubo yokufaka isicelo
• 📄 **Ukugcwalisa** ifomu lakho kusuka kumakhadi owethule
• 🎓 **Ukukhetha** izifundo ezifanele izinjongo zakho
• 🔍 **Ukulandelela** isicelo sakho
• 🗣️ Ngiyakhuluma isiZulu!

Ufuna usizo ngani?`,
  },

  menu_actions: {
    en: [
      { label: "📋 Explain the process", value: "explain" },
      { label: "📄 Apply with my documents", value: "upload_doc" },
      { label: "🎓 Help choosing subjects", value: "subjects" },
      { label: "🔍 Track my application", value: "track" },
      { label: "🇿🇦 Khuluma isiZulu", value: "switch_zu" },
    ],
    zu: [
      { label: "📋 Chaza inqubo", value: "explain" },
      { label: "📄 Faka isicelo ngamadokhumenti", value: "upload_doc" },
      { label: "🎓 Usizo lokukhetha izifundo", value: "subjects" },
      { label: "🔍 Landelela isicelo sami", value: "track" },
      { label: "🇬🇧 Switch to English", value: "switch_en" },
    ],
  },

  process_overview: {
    en: `📋 **The Application Process — 5 Steps**

Here's exactly what you'll go through:

**Step 1 — Learner Information** 🧑
Your personal details: name, ID number, date of birth, home address, and family background. Have your ID or birth certificate ready.

**Step 2 — Academic Details** 📚
Your previous school, grades achieved, the stream you want (Science or Humanities), and any extra-curricular activities.

**Step 3 — Medical & Support** 🏥
Any medical conditions, allergies, or special support needs. This helps us prepare for you — be honest and complete.

**Step 4 — Parent / Guardian** 👨‍👩‍👧
Your parent or guardian's contact details, employment, and their declaration of support.

**Step 5 — Submit & Declaration** ✅
Upload your supporting documents (ID copy, birth certificate, school report) and digitally declare that all information is accurate.

After submission you receive a **Reference Number** (e.g. HSS-2027-AB3K7F) to track your application.

Which step would you like me to explain in more detail?`,
    zu: `📋 **Inqubo Yokufaka Isicelo — Izinyathelo Eziyi-5**

Nanku okuzodlula kukho:

**Isinyathelo 1 — Ulwazi Lomfundi** 🧑
Imininingwane yakho: igama, inombolo ye-ID, usuku lokuzalwa, ikheli lasekhaya, nolwazi lomndeni. Lungisa i-ID noma incwadi yokuzalwa.

**Isinyathelo 2 — Ulwazi Lwemfundo** 📚
Isikole sakho esidlule, amanqamu awuzuze, indlela ofuna ukuya ngayo (Science noma Humanities), nezinye izinto ozenzayo ngaphandle kwesikole.

**Isinyathelo 3 — Ezempilo Nokusekelwa** 🏥
Noma yiziphi izimo ezempilo, ukuxhashazwa, noma izidingo ezikhethekile. Siphendule ngokuqondile — lokhu kusiza ukusilungiselela.

**Isinyathelo 4 — Umzali / Umgcini** 👨‍👩‍👧
Imininingwane yabazali noma umgcini: ikheli, umsebenzi, nezinombolo zokuxhumana.

**Isinyathelo 5 — Thumela Isicelo** ✅
Layisha amadokhumenti (ikhophi ye-ID, incwadi yokuzalwa, irekhodi lesikole) uphinde uvume ukuthi lonke ulwazi luchanile.

Ngemuva kokuthumela uzothola **Inombolo Yesicelo** (isb. HSS-2027-AB3K7F) yokullandela isicelo sakho.

Isiphi isinyathelo ofuna ngichaze ngokuningiliziwe?`,
  },

  step_details: {
    en: [
      {
        step: 1,
        title: "Learner Information",
        tips: [
          "Your **ID number** (13 digits) is on your South African ID card or smart card.",
          "If you don't have an ID yet, use your **Birth Certificate number** — you'll add the ID number later.",
          "Your **date of birth** must match your ID exactly.",
          "List your **home language** honestly — it affects your language stream.",
          "Fill in the address where you actually live, not a postal address.",
        ],
      },
      {
        step: 2,
        title: "Academic Details",
        tips: [
          "Select the **grade you are applying for** — typically Grade 8 for new entrants.",
          "The **stream** (Science or Humanities) determines which electives you'll take. Visit our Yearbook to compare.",
          "List all extra-curricular activities — sports, leadership, community work all count.",
          "If you have a **discipline history**, declare it honestly. Undisclosed history can disqualify an application.",
          "Your **motivation** paragraph should be specific — why Hoye, not just any school?",
        ],
      },
      {
        step: 3,
        title: "Medical & Support",
        tips: [
          "This section is **confidential** and only seen by the school nurse and relevant staff.",
          "Declare allergies, chronic medication, or any physical/learning conditions.",
          "If you need learning support (e.g. extra time in exams) — note it here so we can arrange it from day one.",
          "Emergency contact must be someone other than a parent if both parents are unavailable.",
        ],
      },
      {
        step: 4,
        title: "Parent / Guardian",
        tips: [
          "At least **one guardian's** full details are required.",
          "Employment details help the school understand family context for support programmes.",
          "The guardian's signature (digital confirmation) is legally required before submission.",
          "If a learner is a child-headed household, contact the school directly before applying.",
        ],
      },
      {
        step: 5,
        title: "Submit & Declaration",
        tips: [
          "Upload clear, unblurred scans or photos of: **ID / birth certificate**, **latest school report**, **proof of residence** (utility bill).",
          "Maximum file size: 5 MB per document. Accepted formats: PDF, JPG, PNG.",
          "Once submitted, you cannot edit your application — review everything carefully.",
          "You'll receive your **reference number** by email and on screen immediately.",
          "Processing takes 5–10 business days. Track your status using your reference number.",
        ],
      },
    ],
    zu: [
      {
        step: 1,
        title: "Ulwazi Lomfundi",
        tips: [
          "**Inombolo ye-ID** yakho (izinombolo eziyi-13) ikule khadi yakho ye-ID.",
          "Uma ungakatholi i-ID, sebenzisa **inombolo yesitifikethi sokuzalwa** — uzongeza inombolo ye-ID kamuva.",
          "**Usuku lokuzalwa** kumelwe kufanane ne-ID yakho ngokwedlulela.",
          "Bhala **ulimi lwakho lwasekhaya** ngokuqondile — lokhu kuthinta uhlelo lwezilimi zakho.",
          "Gcwalisa ikheli lapho uhlala khona ngempela, hhayi ikheli lokuphosa izincwadi.",
        ],
      },
      {
        step: 2,
        title: "Ulwazi Lwemfundo",
        tips: [
          "Khetha **ibanga ofaka kulo isicelo** — ngokuvamile ibanga 8 kubafundi abasha.",
          "**Indlela** (Science noma Humanities) ixoxela ukuthi uzothatha izifundo zini. Vakashela iYearbook yethu ukuze uqhathanise.",
          "Bhala zonke izinto ozenzayo ngaphandle kwesikole — ezemidlalo, ubuholi, nomsebenzi womphakathi kuyabalwa.",
          "Uma unalo **umlando wezinhlawulo**, wukuqinisekisa ngokuqondile. Umlando ongaqinisekiswa ungawucanula isicelo.",
          "Indima yakho **yesizathu** mayibe eqondile — kungani iHoye, hhayi nje noma yisikole sipi na?",
        ],
      },
      {
        step: 3,
        title: "Ezempilo Nokusekelwa",
        tips: [
          "Lesi sigaba siyimfihlo — sibonwa uhlavane lwesikole nabasebenzi abahlangene.",
          "Tshela ngama-allergy, imithi yensuku zonke, noma noma yiziphi izimo zomzimba nokukhula.",
          "Uma udinga usizo ekufundeni (isb. isikhathi esengeziwe ekuvivinyweni) — bhala lapha ukuze silungisele kusukela osukwini lokuqala.",
          "Umuntu ongaxhumana naye ezimweni eziphuthumayo kufanele angabi umzali uma bobabili abazali behluleka ukufinyelela.",
        ],
      },
      {
        step: 4,
        title: "Umzali / Umgcini",
        tips: [
          "Imininingwane egcwele ya **mgcini oyedwa** okungenani iyadingeka.",
          "Ulwazi lomsebenzi lusiza isikole siqonde isimo somndeni wezinhlelo zokusekelwa.",
          "Ukusayina komgcini (ukuqinisekiswa kwedijithali) kudingeka ngokomthetho ngaphambi kokuthumela.",
          "Uma umfundi ephila ekhaya eliphethwe ingane, xhumana nesikole ngokuqondile ngaphambi kokufaka isicelo.",
        ],
      },
      {
        step: 5,
        title: "Thumela Isicelo",
        tips: [
          "Layisha izithombe ezikhanyayo noma ama-scan: **i-ID / isitifikethi sokuzalwa**, **irekhodi lesikole lakamuva**, **ubufakazi bokuhlala** (irisidi yezidingo).",
          "Isilinganiso esiphezulu: i-MB eyi-5 ngamadokhumenti. Amafomethi amukelwa: i-PDF, JPG, PNG.",
          "Ngemuva kokuthumela, awukwazi ukuguqula isicelo sakho — hlola konke ngokucophelela.",
          "Uzothola **inombolo yesicelo** nge-imeyili nesikrini ngokushesha.",
          "Ukucutshungulwa kuthatha izinsuku eziphakathi kuka-5 no-10 zomsebenzi. Landelela isimo sakho usebenzisa inombolo yesicelo.",
        ],
      },
    ],
  },

  subject_help: {
    en: `🎓 **Choosing Your Subjects**

At Hoye Secondary School you choose your pathway in **Grade 10**. Before that (Grades 8–9) all subjects are compulsory.

**The Two Streams:**

🔬 **Science Stream (recommended for: Medicine, Engineering, Sciences)**
- Mathematics (compulsory for this stream)
- Physical Sciences
- Life Sciences
- + 1 elective of your choice

📚 **Humanities Stream (recommended for: Law, Commerce, Arts, Social Sciences)**
- Mathematics OR Mathematical Literacy
- History OR Geography
- Accounting OR Business Studies OR Economics
- + 1 elective of your choice

**Key advice:**
• If you want to study **Medicine, Engineering, or any Sciences** at university → you MUST take Mathematics + Physical Sciences in Grade 10.
• **Accounting** is the most demanding commerce subject but also the most rewarding — only choose it if you genuinely enjoy numbers.
• **Mathematical Literacy** closes some university doors — research requirements for your intended degree first.

Visit our **📚 Yearbook** for full subject descriptions, prerequisites, and career pathways for every subject in Grades 8–12.`,
    zu: `🎓 **Ukukhetha Izifundo Zakho**

EHoye Secondary School ukukhetha indlela yakho kwenzeka e**Ibandeni 10**. Ngaphambi kwaloko (Amabanga 8–9) izifundo zonke ziyanqotshwa.

**Izindlela Ezimbili:**

🔬 **Indlela Yesayensi (iyalelwa: Ubugqili, Ubunjiniyela, Izayensi)**
- Mathematics (iyanqotshwa kule ndlela)
- Physical Sciences
- Life Sciences
- + isifundo esisodwa esikhetha sona

📚 **Indlela Yezifundo ZeNtu (iyalelwa: Umthetho, Ubuhwebo, Ubuciko, Izayensi Zentlalontle)**
- Mathematics NOMA Mathematical Literacy
- History NOMA Geography
- Accounting NOMA Business Studies NOMA Economics
- + isifundo esisodwa esikhetha sona

**Iseluleko esibalulekile:**
• Uma ufuna ukufunda **Ubugqili, Ubunjiniyela, noma Izayensi** eNyuvesi → KUMELWE uthatha Mathematics + Physical Sciences ebandeni lika-10.
• **Accounting** yisifundo esinzima kakhulu sebuhwebo kodwa sinika umklomelo omkhulu — sikikhele uma uthanda izinombolo ngempela.
• **Mathematical Literacy** ivala ezinye izicabha zeNyuvesi — phenyisisa izidingo zemfundo oyihlosile kuqala.

Vakashela **📚 iYearbook** yethu ukuze uthole izincazelo ezigcwele zazo zonke izifundo, izidingo, nezindlela zo-career kuwo wonke amabanga 8–12.`,
  },

  track_help: {
    en: `🔍 **Tracking Your Application**

Once you've submitted your application, you'll have a **Reference Number** (format: HSS-2027-XXXXXX).

**How to track:**
1. Go to the home page
2. Click **"Track My Application"**
3. Enter your Reference Number (or your email + surname)
4. See your real-time application status

**Status meanings:**
• 🟡 **Submitted** — We've received your application and it's queued for review
• 🔵 **Under Review** — Admissions is actively reviewing your documents
• 🟢 **Conditionally Accepted** — Great news! See the conditions in your status page
• 🔴 **Documents Required** — We need additional documents from you
• ✅ **Fully Accepted** — Welcome to Hoye! Check your email for next steps
• ❌ **Unsuccessful** — Space is limited; you may re-apply for the next intake

Don't have your reference number? Use the **"Recover Reference"** option with your email and surname.`,
    zu: `🔍 **Ukulandelela Isicelo Sakho**

Uma usuthumele isicelo sakho, uzoba ne **Nombolo Yesicelo** (ifomethi: HSS-2027-XXXXXX).

**Indlela yokullandelela:**
1. Iya ekhasini lasekhaya
2. Chofoza **"Landelela Isicelo Sami"**
3. Faka Inombolo Yakho Yesicelo (noma imeyili + isibongo)
4. Bona isimo sesicelo sakho ngesikhathi sangempela

**Izincazelo zezimo:**
• 🟡 **Ithumelwe** — Samukelile isicelo sakho futhi silinde ukubuyekezwa
• 🔵 **Iyabhekwa** — Ukubhaliswa kuyaxoxa ngomsebenzi ngemadokhumenti akho
• 🟢 **Yamukelwa Ngokuzimisela** — Izindaba ezimnandi! Bona izimiso ekhasini lakho
• 🔴 **Amadokhumenti Adingekayo** — Sidinga amadokhumenti engeziwe kuwe
• ✅ **Yamukelwa Ngokugcwele** — Wamukelekile eHoye! Hlola imeyili yakho
• ❌ **Ayiphumelelanga** — Indawo ilinganiselwa; ungafaka isicelo ekufikeni okulandelayo

Awunayo inombolo yesicelo sakho? Sebenzisa inketho ethi **"Thola Inombolo"** nge-imeyili yakho nesibongo.`,
  },

  doc_upload_prompt: {
    en: `📄 **Apply with Your Documents**

Upload your documents and I'll extract your information automatically — saving you time on the form!

**I can read:**
• 📋 South African ID / Smart ID (PDF scan)
• 📋 Birth Certificate (PDF scan)
• 📋 School Report / Academic Transcript (PDF)

**What I'll fill in:**
- Full name, ID number, date of birth, gender
- Address details (where visible)
- Previous school name and results

**After extraction:**
You'll see every field I found — you verify each one before it goes into the form. Nothing is saved until you confirm.

👇 Use the **📎 Upload Document** button below to get started.`,
    zu: `📄 **Faka Isicelo Ngamadokhumenti Akho**

Layisha amadokhumenti akho futhi ngizokhucula ulwazi lwakho ngokuzenzakalela — kukukhulula isikhathi ekugcwaliseni ifomu!

**Okungafundwa yimi:**
• 📋 I-ID YaseNingizimu Afrika / Smart ID (i-PDF scan)
• 📋 Isitifikethi Sokuzalwa (i-PDF scan)
• 📋 Irekhodi Lesikole / Ucwaningo Lwemfundo (i-PDF)

**Okuzogcwaliswa yimi:**
- Igama eligcwele, inombolo ye-ID, usuku lokuzalwa, ubulili
- Imininingwane yekheli (uma ibonakala)
- Igama lesikole elidlule namanqamu

**Ngemuva kokukhucula:**
Uzobona wonke amasimu engawathola — uqinisekisa ngayedwa ngaphambi kokufaka eformeni. Akukho okugcinwayo uze uqinisekise.

👇 Sebenzisa inkinobho ethi **📎 Layisha Idokhumenti** ezansi ukuqala.`,
  },

  confirm_fields: {
    en: (count: number) =>
      `✅ I found **${count} field${count !== 1 ? "s" : ""}** in your document. Please review each one — green means I'm confident, yellow means double-check, red means I'm guessing.

Tap any field to edit it before it fills the form. Ready to apply the data?`,
    zu: (count: number) =>
      `✅ Ngithole **amasimu angu-${count}** kumadokhumenti akho. Sicela ubuyekeze ngalinye — luhlaza kukholekile, phuzi kusho hlola kabusha, bomvu kusho ngicabanga.

Thepha noma iliphi ilengu ukuze uliguqule ngaphambi kokugcwalisa ifomu. Ukulungele ukufaka idatha?`,
  },

  missing_field: {
    en: (field: string) => `I noticed your document didn't contain your **${field}**. Could you please provide it so I can complete the form for you?`,
    zu: (field: string) => `Ngibonile ukuthi amadokhumenti akho awanayo **${field}** yakho. Ngicela uyinikeze ukuze ngikwazise ukugcwalisa ifomu?`,
  },

  fallback: {
    en: `I'm not sure I understood that. Here's what I can help you with:`,
    zu: `Angiqiniseki ukuthi ngikuqondile lokho. Nanku engingakusiza ngakho:`,
  },
};

// ─── ENGINE ─────────────────────────────────────────────────────────────────

export function getGreeting(lang: Language = "en"): SkavsMessage {
  return {
    id: `skavs-${Date.now()}`,
    role: "skavs",
    content: T.greeting[lang],
    timestamp: new Date(),
    actions: T.menu_actions[lang],
  };
}

export function getResponse(
  input: string,
  state: SkavsState
): { message: SkavsMessage; nextState: SkavsState } {
  const lang = state.language;
  const lower = input.toLowerCase();

  let content = "";
  let actions: SkavsAction[] | undefined;
  let nextState = { ...state };

  // Language switch
  if (input === "switch_zu") {
    nextState.language = "zu";
    content = T.greeting.zu;
    actions = T.menu_actions.zu;
    nextState.stage = "menu";
  } else if (input === "switch_en") {
    nextState.language = "en";
    content = T.greeting.en;
    actions = T.menu_actions.en;
    nextState.stage = "menu";
  }

  // Main menu choices
  else if (input === "explain" || lower.includes("explain") || lower.includes("process") || lower.includes("how") || lower.includes("inqubo")) {
    content = T.process_overview[lang];
    actions = [1, 2, 3, 4, 5].map((n) => ({
      label: `Step ${n}: ${T.step_details.en[n - 1].title}`,
      value: `step_${n}`,
    }));
    nextState.stage = "explain_process";
  }

  // Step detail
  else if (input.startsWith("step_")) {
    const stepNum = parseInt(input.replace("step_", ""));
    const detail = T.step_details[lang][stepNum - 1];
    if (detail) {
      const tips = detail.tips.map((t, i) => `${i + 1}. ${t}`).join("\n");
      content = lang === "en"
        ? `📌 **Step ${stepNum}: ${detail.title}**\n\n${tips}\n\nWould you like to go to this step now, or see another?`
        : `📌 **Isinyathelo ${stepNum}: ${detail.title}**\n\n${tips}\n\nIngabe ufuna ukuya kule nyathelo manje, noma ubona elinye?`;
      actions = [
        { label: lang === "en" ? "📝 Go to this step" : "📝 Iya kule nyathelo", value: `goto_step_${stepNum}` },
        { label: lang === "en" ? "🏠 Back to menu" : "🏠 Buya kemenyu", value: "menu" },
      ];
    }
    nextState.stage = "explain_step";
    nextState.currentStep = stepNum;
  }

  // Document upload
  else if (input === "upload_doc" || lower.includes("upload") || lower.includes("document") || lower.includes("dokhumenti") || lower.includes("auto")) {
    content = T.doc_upload_prompt[lang];
    actions = [{ label: lang === "en" ? "🏠 Back to menu" : "🏠 Buya kemenyu", value: "menu" }];
    nextState.stage = "doc_upload";
  }

  // Subject help
  else if (input === "subjects" || lower.includes("subject") || lower.includes("izifundo") || lower.includes("stream") || lower.includes("science") || lower.includes("humanities")) {
    content = T.subject_help[lang];
    actions = [
      { label: lang === "en" ? "📚 Open Yearbook" : "📚 Vula iYearbook", value: "yearbook" },
      { label: lang === "en" ? "🏠 Back to menu" : "🏠 Buya kemenyu", value: "menu" },
    ];
    nextState.stage = "subject_help";
  }

  // Track help
  else if (input === "track" || lower.includes("track") || lower.includes("status") || lower.includes("reference") || lower.includes("isicelo")) {
    content = T.track_help[lang];
    actions = [
      { label: lang === "en" ? "🔍 Go to Track page" : "🔍 Iya ekhasini lokullandelela", value: "goto_track" },
      { label: lang === "en" ? "🏠 Back to menu" : "🏠 Buya kemenyu", value: "menu" },
    ];
    nextState.stage = "track_help";
  }

  // Go back to menu
  else if (input === "menu" || lower.includes("menu") || lower.includes("back") || lower.includes("help")) {
    content = lang === "en" ? "Sure! Here's what I can help you with:" : "Kulungile! Nanku engingakusiza ngakho:";
    actions = T.menu_actions[lang];
    nextState.stage = "menu";
  }

  // Fallback
  else {
    content = T.fallback[lang];
    actions = T.menu_actions[lang];
    nextState.stage = "menu";
  }

  return {
    message: {
      id: `skavs-${Date.now()}`,
      role: "skavs",
      content,
      timestamp: new Date(),
      actions,
    },
    nextState,
  };
}

export function getDocConfirmMessage(count: number, lang: Language): SkavsMessage {
  return {
    id: `skavs-${Date.now()}`,
    role: "skavs",
    content: T.confirm_fields[lang](count),
    timestamp: new Date(),
    actions: [
      { label: lang === "en" ? "✅ Apply data to form" : "✅ Faka idatha eformeni", value: "apply_data" },
      { label: lang === "en" ? "🔄 Upload different document" : "🔄 Layisha idokhumenti ehlukile", value: "upload_doc" },
    ],
  };
}

export function getMissingFieldMessage(field: string, lang: Language): SkavsMessage {
  return {
    id: `skavs-${Date.now()}`,
    role: "skavs",
    content: T.missing_field[lang](field),
    timestamp: new Date(),
  };
}
