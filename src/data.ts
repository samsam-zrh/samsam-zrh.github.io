export type Lang = 'fr' | 'en'

export const contact = {
  email: 'samuel.zerah@edu.esiee.fr',
  phone: '+33 6 32 35 25 83',
  phoneHref: 'tel:+33632352583',
  linkedin: 'https://www.linkedin.com/in/samuel-z-177066269',
  github: 'https://github.com/samsam-zrh',
  cv: '/CV_Samuel_Zerah.pdf',
}

export const stack = [
  'Python', 'PyTorch', 'Transformers', 'LoRA / PEFT', 'scikit-learn', 'pandas', 'NumPy',
  'FastAPI', 'Flask', 'Streamlit', 'Next.js', 'TypeScript', 'Azure', 'Entra ID',
  'SQL', 'SQLite', 'Ollama', 'Unsloth', 'CLIP', 'Gemma', 'FinBERT', 'Git', 'Linux', 'Java', 'C',
]

const fr = {
  nav: { about: 'Profil', xp: 'Expérience', projects: 'Projets', skills: 'Compétences', terminal: 'Terminal', contact: 'Contact' },
  boot: ['Initialisation du noyau neuronal…', 'Chargement des poids LoRA…', 'Calibration des embeddings…', 'Accès autorisé.'],
  hero: {
    status: 'Disponible · Stage 6 mois · Février 2027',
    hello: 'Bonjour, je suis',
    roles: ['Data Scientist', 'AI Engineer', 'NLP & LLM Builder', 'Cyber-curieux'],
    pitch: "Élève ingénieur en dernière année à l'ESIEE Paris, filière IA & Cybersécurité. Je conçois des systèmes d'IA appliquée — de l'agent LLM sécurisé sur Azure au modèle multimodal médical.",
    cta1: 'Voir mes projets',
    cta2: 'Télécharger le CV',
    scroll: 'Défiler',
    location: 'Paris · Île-de-France',
  },
  about: {
    kicker: '01 — Profil',
    title: "J'entraîne des modèles, je les déploie, et je les sécurise.",
    text: "Expérience en IA appliquée sur Azure, pipelines NLP, modèles multimodaux et prévision temporelle. Mon double profil IA + cybersécurité me permet de livrer des systèmes intelligents qui restent fiables, auditables et protégés.",
    stats: [
      { value: 6, suffix: ' mois', label: 'de stage recherchés dès février 2027' },
      { value: 840, suffix: '', label: 'au TOEIC — anglais B2' },
      { value: 4, suffix: '', label: 'missions menées pendant mon stage IA' },
      { value: 3, suffix: '', label: 'projets IA de bout en bout' },
    ],
    bento: [
      { t: 'IA générative', d: 'Copilotes LLM, extraction structurée par LLM, règles métier et validation humaine.' },
      { t: 'Multimodal', d: 'Vision + langage : CLIP projeté dans Gemma, fine-tuning LoRA.' },
      { t: 'Séries temporelles', d: 'Prévision de charge, features de Fourier, split chronologique.' },
      { t: 'Cybersécurité', d: 'Entra ID, Easy Auth, audit web et pentest autorisé.' },
    ],
  },
  xp: {
    kicker: '02 — Expérience',
    title: 'Sur le terrain',
    items: [
      {
        when: 'Mai → Août 2026',
        role: 'Stagiaire Ingénieur IA',
        org: 'Magellan Partners / Exakis Nelite',
        place: 'Paris',
        points: [
          "Copilote d'IA générative pour les réponses aux appels d'offres SSI / RGPD — Python, Next.js/TypeScript, Azure.",
          "Sécurisation d'AI Team Cockpit avec Entra ID et Azure Easy Auth ; fiabilisation de l'ingestion des dépôts GitHub.",
          'Assistant RH : extraction de convocations médicales par LLM, règles métier Python, préparation de mails et invitations Outlook avec validation humaine.',
          "Pentest autorisé de la plateforme M'Cowork.",
        ],
        tags: ['Azure', 'LLM', 'Next.js', 'Entra ID', 'Pentest'],
      },
    ],
    eduTitle: 'Formation',
    edu: [
      { when: '2022 → 2027', t: "Diplôme d'ingénieur — IA & Cybersécurité", o: 'ESIEE Paris · Université Gustave Eiffel', p: 'Noisy-le-Grand' },
      { when: '2024', t: "Semestre d'échange", o: 'Università di Bologna', p: 'Bologne, Italie' },
      { when: '2022', t: 'Baccalauréat général', o: 'Spécialités Maths & Physique-Chimie', p: '' },
    ],
  },
  projects: {
    kicker: '03 — Projets',
    title: 'Des idées aux modèles en production',
    open: 'Détails',
    close: 'Fermer',
    items: [
      {
        id: 'news',
        name: 'News Agents',
        when: 'Mars → Mai 2026 · ESIEE × Achord Partners',
        short: "Agents d'analyse financière : collecte d'actualités, filtrage par LLM locaux et mesure d'incertitude.",
        points: [
          'Collecte yfinance + extraction web, filtrage par LLM locaux via Ollama, stockage SQLite, dashboard Flask.',
          "FinBERT adapté par LoRA / PEFT pour estimer l'incertitude avec le lexique Loughran-McDonald.",
          'Analyse de polarité et modèles TF-IDF / Ridge.',
        ],
        tags: ['Ollama', 'FinBERT', 'LoRA', 'Flask', 'SQLite'],
        metric: 'LLM locaux · 0 donnée envoyée au cloud',
      },
      {
        id: 'eye',
        name: 'EYE Médicale',
        when: 'Mai → Juillet 2025',
        short: "Modèle vision-langage pour l'interprétation d'images médicales.",
        points: [
          "CLIP associé à Gemma par projection d'embeddings.",
          'Données ROCOv2, fine-tuning LoRA avec PyTorch, Transformers et Unsloth sur un modèle quantifié.',
          'Prototype web FastAPI.',
        ],
        tags: ['CLIP', 'Gemma', 'PyTorch', 'Unsloth', 'FastAPI'],
        metric: 'Multimodal · modèle quantifié',
      },
      {
        id: 'grid',
        name: 'Prévision de charge électrique',
        when: '2026 · Open data Enedis',
        short: 'Prévoir la consommation électrique à partir des données ouvertes Enedis.',
        points: [
          'Variables de Fourier et de saisonnalité, clustering K-means.',
          'Comparaison Random Forest vs MLP, lags et moyennes glissantes, split chronologique.',
          'Application Streamlit interactive.',
        ],
        tags: ['scikit-learn', 'K-means', 'MLP', 'Streamlit'],
        metric: 'Random Forest vs MLP',
      },
    ],
  },
  skills: {
    kicker: '04 — Compétences',
    title: 'La boîte à outils',
    groups: [
      { t: 'Développement', items: ['Python', 'SQL', 'TypeScript / JS', 'Java', 'C', 'Git', 'Linux'] },
      { t: 'Intelligence artificielle', items: ['PyTorch', 'Transformers', 'scikit-learn', 'pandas', 'NumPy', 'NLP', 'LoRA', 'Vision', 'Clustering', 'Séries temporelles'] },
      { t: 'Applications & Cloud', items: ['FastAPI', 'Flask', 'Streamlit', 'Next.js', 'Azure', 'Entra ID', 'Easy Auth'] },
      { t: 'Cybersécurité', items: ['Audit web', "Tests d'authentification", 'Pentest autorisé'] },
      { t: 'Soft skills', items: ['Travail en équipe', 'Autonomie', 'Rigueur', 'Adaptabilité', 'Communication technique'] },
    ],
    langTitle: 'Langues',
    langs: [
      { l: 'Français', lvl: 'Natif', v: 100 },
      { l: 'Anglais', lvl: 'B2 · TOEIC 840', v: 78 },
      { l: 'Espagnol', lvl: 'B1', v: 55 },
    ],
    hobbyTitle: 'Hors écran',
    hobbies: [
      { t: 'Plongée', d: 'Calme, procédure, profondeur.' },
      { t: 'Drone', d: 'Pilotage et prises de vue aériennes.' },
      { t: 'Wakeboard', d: 'Équilibre, vitesse, persévérance.' },
    ],
  },
  term: {
    kicker: '05 — Terminal',
    title: 'Interrogez-moi en ligne de commande',
    hint: 'Tapez help puis Entrée',
    welcome: "samuel@portfolio — tapez 'help' pour la liste des commandes.",
  },
  contact: {
    kicker: '06 — Contact',
    title: 'Construisons quelque chose d’intelligent.',
    text: 'Je recherche un stage de fin d’études de 6 mois en Data Science / IA à partir de février 2027, à Paris ou en Île-de-France. Permis B.',
    copy: 'Copier l’email',
    copied: 'Copié !',
    footer: 'Conçu et codé par Samuel Zerah · React, Three.js & Motion',
  },
}

const en: typeof fr = {
  nav: { about: 'Profile', xp: 'Experience', projects: 'Projects', skills: 'Skills', terminal: 'Terminal', contact: 'Contact' },
  boot: ['Booting neural core…', 'Loading LoRA weights…', 'Calibrating embeddings…', 'Access granted.'],
  hero: {
    status: 'Available · 6-month internship · Feb 2027',
    hello: "Hi, I'm",
    roles: ['Data Scientist', 'AI Engineer', 'NLP & LLM Builder', 'Security-minded'],
    pitch: 'Final-year engineering student at ESIEE Paris, majoring in AI & Cybersecurity. I build applied AI systems — from secure LLM agents on Azure to medical multimodal models.',
    cta1: 'See my projects',
    cta2: 'Download résumé',
    scroll: 'Scroll',
    location: 'Paris · Île-de-France',
  },
  about: {
    kicker: '01 — Profile',
    title: 'I train models, ship them, and secure them.',
    text: 'Hands-on experience in applied AI on Azure, NLP pipelines, multimodal models and time-series forecasting. My dual AI + cybersecurity background lets me deliver intelligent systems that stay reliable, auditable and protected.',
    stats: [
      { value: 6, suffix: ' months', label: 'internship wanted from Feb 2027' },
      { value: 840, suffix: '', label: 'TOEIC score — English B2' },
      { value: 4, suffix: '', label: 'missions delivered during my AI internship' },
      { value: 3, suffix: '', label: 'end-to-end AI projects' },
    ],
    bento: [
      { t: 'Generative AI', d: 'LLM copilots, LLM-based structured extraction, business rules and human-in-the-loop.' },
      { t: 'Multimodal', d: 'Vision + language: CLIP projected into Gemma, LoRA fine-tuning.' },
      { t: 'Time series', d: 'Load forecasting, Fourier features, chronological splits.' },
      { t: 'Cybersecurity', d: 'Entra ID, Easy Auth, web audits and authorised pentesting.' },
    ],
  },
  xp: {
    kicker: '02 — Experience',
    title: 'In the field',
    items: [
      {
        when: 'May → Aug 2026',
        role: 'AI Engineering Intern',
        org: 'Magellan Partners / Exakis Nelite',
        place: 'Paris',
        points: [
          'Generative AI copilot for security / GDPR tender responses — Python, Next.js/TypeScript, Azure.',
          'Secured AI Team Cockpit with Entra ID and Azure Easy Auth; hardened GitHub repository ingestion.',
          'HR assistant: LLM extraction of medical appointments, Python business rules, Outlook emails and invites with human validation.',
          "Authorised penetration test of the M'Cowork platform.",
        ],
        tags: ['Azure', 'LLM', 'Next.js', 'Entra ID', 'Pentest'],
      },
    ],
    eduTitle: 'Education',
    edu: [
      { when: '2022 → 2027', t: 'Engineering degree — AI & Cybersecurity', o: 'ESIEE Paris · Université Gustave Eiffel', p: 'Noisy-le-Grand' },
      { when: '2024', t: 'Exchange semester', o: 'Università di Bologna', p: 'Bologna, Italy' },
      { when: '2022', t: 'French Baccalauréat', o: 'Maths & Physics-Chemistry majors', p: '' },
    ],
  },
  projects: {
    kicker: '03 — Projects',
    title: 'From ideas to working models',
    open: 'Details',
    close: 'Close',
    items: [
      {
        id: 'news',
        name: 'News Agents',
        when: 'Mar → May 2026 · ESIEE × Achord Partners',
        short: 'Financial analysis agents: news collection, local LLM filtering and uncertainty scoring.',
        points: [
          'yfinance + web extraction, local LLM filtering via Ollama, SQLite storage, Flask dashboard.',
          'FinBERT adapted with LoRA / PEFT to estimate uncertainty using the Loughran-McDonald lexicon.',
          'Polarity analysis and TF-IDF / Ridge models.',
        ],
        tags: ['Ollama', 'FinBERT', 'LoRA', 'Flask', 'SQLite'],
        metric: 'Local LLMs · zero data sent to cloud',
      },
      {
        id: 'eye',
        name: 'EYE Medical',
        when: 'May → Jul 2025',
        short: 'Vision-language model for medical image interpretation.',
        points: [
          'CLIP connected to Gemma through embedding projection.',
          'ROCOv2 dataset, LoRA fine-tuning with PyTorch, Transformers and Unsloth on a quantised model.',
          'FastAPI web prototype.',
        ],
        tags: ['CLIP', 'Gemma', 'PyTorch', 'Unsloth', 'FastAPI'],
        metric: 'Multimodal · quantised model',
      },
      {
        id: 'grid',
        name: 'Electric load forecasting',
        when: '2026 · Enedis open data',
        short: 'Forecasting electricity consumption from Enedis open data.',
        points: [
          'Fourier and seasonality features, K-means clustering.',
          'Random Forest vs MLP, lags and rolling means, chronological split.',
          'Interactive Streamlit app.',
        ],
        tags: ['scikit-learn', 'K-means', 'MLP', 'Streamlit'],
        metric: 'Random Forest vs MLP',
      },
    ],
  },
  skills: {
    kicker: '04 — Skills',
    title: 'The toolbox',
    groups: [
      { t: 'Development', items: ['Python', 'SQL', 'TypeScript / JS', 'Java', 'C', 'Git', 'Linux'] },
      { t: 'Artificial intelligence', items: ['PyTorch', 'Transformers', 'scikit-learn', 'pandas', 'NumPy', 'NLP', 'LoRA', 'Vision', 'Clustering', 'Time series'] },
      { t: 'Apps & Cloud', items: ['FastAPI', 'Flask', 'Streamlit', 'Next.js', 'Azure', 'Entra ID', 'Easy Auth'] },
      { t: 'Cybersecurity', items: ['Web auditing', 'Authentication testing', 'Authorised pentesting'] },
      { t: 'Soft skills', items: ['Teamwork', 'Autonomy', 'Rigour', 'Adaptability', 'Technical communication'] },
    ],
    langTitle: 'Languages',
    langs: [
      { l: 'French', lvl: 'Native', v: 100 },
      { l: 'English', lvl: 'B2 · TOEIC 840', v: 78 },
      { l: 'Spanish', lvl: 'B1', v: 55 },
    ],
    hobbyTitle: 'Off screen',
    hobbies: [
      { t: 'Scuba diving', d: 'Calm, procedure, depth.' },
      { t: 'Drones', d: 'Piloting and aerial shots.' },
      { t: 'Wakeboarding', d: 'Balance, speed, perseverance.' },
    ],
  },
  term: {
    kicker: '05 — Terminal',
    title: 'Query me from the command line',
    hint: 'Type help then Enter',
    welcome: "samuel@portfolio — type 'help' to list commands.",
  },
  contact: {
    kicker: '06 — Contact',
    title: "Let's build something intelligent.",
    text: "I'm looking for a 6-month final-year internship in Data Science / AI starting February 2027, in Paris or Île-de-France. Driving licence.",
    copy: 'Copy email',
    copied: 'Copied!',
    footer: 'Designed & coded by Samuel Zerah · React, Three.js & Motion',
  },
}

export const dict = { fr, en }
export type Dict = typeof fr
