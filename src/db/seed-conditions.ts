import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const conditions = [
  {
    slug: "vppb",
    title: "Vertige positionnel paroxystique bénin (VPPB)",
    shortDescription: "Courts épisodes de vertiges intenses déclenchés par les changements de position de la tête.",
    heroHook: "Vous tournez la tête en vous levant et tout vacille ? Le VPPB est la cause la plus fréquente de vertiges — et la plus simple à traiter.",
    longDescription: "Le vertige positionnel paroxystique bénin (VPPB) est causé par le déplacement de petits cristaux de carbonate de calcium (otolithes) dans les canaux semi-circulaires de l'oreille interne. Ces cristaux perturbent la détection normale des mouvements de la tête, provoquant des épisodes brefs mais intenses de vertige rotatoire.\n\nLe VPPB représente environ 30% de tous les cas de vertiges vus en consultation. Il peut survenir à tout âge, mais est plus fréquent après 50 ans.",
    symptoms: ["Vertiges brefs (30-60 secondes) lors des changements de position", "Sensation de rotation intense au lever ou au coucher", "Nausées accompagnant les épisodes", "Nystagmus (mouvements involontaires des yeux)", "Instabilité résiduelle entre les crises"],
    causes: "Le VPPB survient lorsque de petits cristaux (otolithes) se détachent de leur position normale dans l'utricule et migrent dans l'un des canaux semi-circulaires.\n\nLes facteurs déclencheurs incluent : traumatisme crânien, position prolongée sur le dos (dentiste, coiffeur), vieillissement naturel, ou parfois sans cause identifiable (idiopathique).",
    protocol: "Le traitement du VPPB repose sur des manœuvres de repositionnement des cristaux, principalement la manœuvre d'Epley ou de Sémont selon le canal atteint.\n\nArnaud Canadas identifie d'abord le canal impliqué grâce à des tests positionnels spécifiques (Dix-Hallpike, roll test), puis applique la manœuvre appropriée. Le taux de succès dépasse 90% dès la première séance.",
    sessionDescription: "La première séance dure environ 45 minutes. Elle commence par un bilan vestibulaire complet : questionnaire détaillé, tests oculomoteurs, puis manœuvres diagnostiques pour identifier le canal atteint.\n\nUne fois le diagnostic posé, la manœuvre de repositionnement est réalisée immédiatement. Vous recevez des instructions pour les 48h suivantes.",
    sessionCount: "La majorité des patients sont soulagés en 1 à 3 séances. Le VPPB du canal postérieur (le plus fréquent) répond souvent dès la première manœuvre.\n\nUne séance de contrôle est recommandée 1 à 2 semaines après. Le taux de récidive est d'environ 15% la première année.",
    relatedSlugs: ["nevrite-vestibulaire", "maladie-de-meniere", "migraine-vestibulaire"],
    order: 1,
  },
  {
    slug: "nevrite-vestibulaire",
    title: "Névrite vestibulaire",
    shortDescription: "Inflammation du nerf vestibulaire causant un vertige soudain et prolongé avec perte d'équilibre.",
    heroHook: "Un vertige violent est apparu brusquement et ne disparaît pas ? La névrite vestibulaire nécessite une rééducation spécifique.",
    longDescription: "La névrite vestibulaire est une inflammation aiguë du nerf vestibulaire, généralement d'origine virale. Elle provoque un vertige rotatoire intense et continu qui peut durer plusieurs jours.\n\nC'est la deuxième cause la plus fréquente de vertiges périphériques après le VPPB.",
    symptoms: ["Vertige rotatoire intense et continu (plusieurs jours)", "Nausées et vomissements importants", "Instabilité majeure à la marche", "Nystagmus spontané", "Déviation latérale à la marche"],
    causes: "La névrite vestibulaire est le plus souvent causée par une réactivation d'un virus dans le ganglion vestibulaire.\n\nElle peut également survenir après une infection des voies respiratoires supérieures.",
    protocol: "La rééducation vestibulaire vise à accélérer la compensation centrale.\n\nLe programme inclut des exercices de stabilisation du regard (VOR), des exercices d'équilibre progressifs, et de l'habituation aux mouvements de la tête.",
    sessionDescription: "Le bilan initial évalue le degré de déficit vestibulaire.\n\nLes séances suivantes se concentrent sur des exercices progressifs de stabilisation du regard et d'équilibre.",
    sessionCount: "La rééducation s'étale généralement sur 6 à 12 séances. La majorité des patients récupèrent bien en 2 à 3 mois.",
    relatedSlugs: ["vppb", "deficit-vestibulaire", "vertige-post-commotion"],
    order: 2,
  },
  {
    slug: "maladie-de-meniere",
    title: "Maladie de Ménière",
    shortDescription: "Crises de vertiges rotatoires associées à une perte auditive, acouphènes et plénitude auriculaire.",
    heroHook: "Des crises de vertiges imprévisibles avec bourdonnements et baisse d'audition ? La rééducation vestibulaire peut aider.",
    longDescription: "La maladie de Ménière est un trouble de l'oreille interne caractérisé par des crises récurrentes de vertige rotatoire, une perte auditive fluctuante, des acouphènes et une sensation de plénitude dans l'oreille.\n\nElle est liée à un excès de liquide dans l'oreille interne (hydrops endolymphatique).",
    symptoms: ["Crises de vertige rotatoire de 20 min à plusieurs heures", "Perte auditive fluctuante", "Acouphènes", "Sensation de plénitude auriculaire", "Nausées pendant les crises"],
    causes: "L'hydrops endolymphatique est le mécanisme principal.\n\nFacteurs contributifs : prédisposition génétique, allergies, infections virales, stress.",
    protocol: "La physiothérapie vestibulaire aide à gérer les symptômes inter-critiques et améliore la compensation vestibulaire.\n\nArnaud Canadas travaille en coordination avec les ORL.",
    sessionDescription: "Le bilan évalue l'état vestibulaire entre les crises.\n\nLes séances sont adaptées à la phase de la maladie.",
    sessionCount: "Un suivi de 8 à 12 séances est recommandé, avec des séances de rappel selon l'évolution.",
    relatedSlugs: ["vppb", "nevrite-vestibulaire", "deficit-vestibulaire"],
    order: 3,
  },
  {
    slug: "migraine-vestibulaire",
    title: "Migraine vestibulaire",
    shortDescription: "Vertiges et déséquilibres associés à la migraine, avec ou sans céphalée.",
    heroHook: "Des vertiges récurrents associés à vos migraines ? La migraine vestibulaire est sous-diagnostiquée mais très bien prise en charge.",
    longDescription: "La migraine vestibulaire est la cause la plus fréquente de vertiges épisodiques chez l'adulte.\n\nElle touche environ 1% de la population. Le diagnostic est souvent retardé car les vertiges peuvent survenir indépendamment des maux de tête.",
    symptoms: ["Épisodes de vertige de quelques minutes à 72 heures", "Instabilité fluctuante", "Sensibilité aux mouvements visuels", "Photophobie et phonophobie", "Vertiges parfois sans mal de tête"],
    causes: "Hypersensibilité neuronale affectant les voies vestibulaires centrales.\n\nDéclencheurs : stress, manque de sommeil, certains aliments, changements hormonaux.",
    protocol: "La rééducation combine des exercices d'habituation vestibulaire et visuelle, progressivement dosés.\n\nArnaud Canadas respecte le seuil de tolérance du patient.",
    sessionDescription: "Le bilan identifie les seuils de déclenchement.\n\nChaque séance progresse par paliers.",
    sessionCount: "Le traitement s'étale sur 8 à 16 séances, à raison d'une par semaine.",
    relatedSlugs: ["vertige-cervicogenique", "vppb", "mal-de-debarquement"],
    order: 4,
  },
  {
    slug: "vertige-cervicogenique",
    title: "Vertige cervicogénique",
    shortDescription: "Vertiges et déséquilibre liés à un dysfonctionnement du rachis cervical.",
    heroHook: "Des vertiges associés à des douleurs ou raideurs cervicales ? Le vertige cervicogénique répond très bien à la physiothérapie.",
    longDescription: "Le vertige cervicogénique est un syndrome où le déséquilibre est provoqué par un dysfonctionnement de la colonne cervicale.\n\nDe plus en plus reconnu chez les patients après un traumatisme cervical.",
    symptoms: ["Vertiges liés aux mouvements du cou", "Douleur et raideur cervicale", "Instabilité aggravée par certaines postures", "Céphalées d'origine cervicale"],
    causes: "Conflit entre les informations proprioceptives cervicales et vestibulaires.\n\nCauses : traumatisme cervical, arthrose, tensions musculaires, mauvaise posture.",
    protocol: "Le traitement combine physiothérapie cervicale et rééducation vestibulaire.\n\nThérapie manuelle, mobilisations, exercices de coordination oculo-cervicale.",
    sessionDescription: "Bilan cervical et vestibulaire complet.\n\nSéances combinant thérapie manuelle et exercices actifs.",
    sessionCount: "6 à 10 séances sur 6 à 8 semaines.",
    relatedSlugs: ["migraine-vestibulaire", "vertige-post-commotion", "deficit-vestibulaire"],
    order: 5,
  },
  {
    slug: "deficit-vestibulaire",
    title: "Déficit vestibulaire unilatéral et bilatéral",
    shortDescription: "Perte partielle ou totale de la fonction vestibulaire d'un ou des deux côtés.",
    heroHook: "Un déséquilibre persistant après une atteinte vestibulaire ? La rééducation est le traitement de référence.",
    longDescription: "Le déficit vestibulaire désigne une perte de la fonction de l'oreille interne d'un côté (unilatéral) ou des deux côtés (bilatéral).\n\nIl est souvent séquelle d'une névrite vestibulaire, d'une chirurgie ou d'un traitement ototoxique.",
    symptoms: ["Instabilité chronique à la marche", "Oscillopsie", "Difficultés dans l'obscurité", "Fatigue de compensation", "Risque de chutes"],
    causes: "Séquelles de névrite vestibulaire, chirurgie otologique, médicaments ototoxiques, maladie de Ménière avancée.",
    protocol: "La rééducation optimise la compensation centrale.\n\nExercices de stabilisation du regard, d'équilibre progressifs et de substitution sensorielle.",
    sessionDescription: "Le bilan quantifie le déficit et les capacités compensatoires.\n\nProgression du simple au complexe.",
    sessionCount: "10 à 20 séances pour un déficit unilatéral. Amélioration significative en 3 à 6 mois.",
    relatedSlugs: ["nevrite-vestibulaire", "maladie-de-meniere", "vertige-post-commotion"],
    order: 6,
  },
  {
    slug: "mal-de-debarquement",
    title: "Mal de débarquement",
    shortDescription: "Sensation persistante de balancement ou tangage après un voyage.",
    heroHook: "Vous avez l'impression de tanguer en permanence après un voyage ? Le mal de débarquement se traite.",
    longDescription: "Le syndrome de mal de débarquement se caractérise par une sensation persistante de balancement après un voyage.\n\nIl est souvent sous-diagnostiqué car les examens vestibulaires classiques sont normaux.",
    symptoms: ["Sensation de balancement persistante", "Amélioration paradoxale en voiture", "Fatigue et difficulté de concentration", "Instabilité dans les espaces visuellement chargés"],
    causes: "Maladaptation du système vestibulaire central après une exposition prolongée au mouvement passif.",
    protocol: "Réadaptation à la stimulation optocinétique et protocoles vestibulaires spécifiques.",
    sessionDescription: "Bilan diagnostique et évaluation de la sévérité.\n\nStimulations visuelles contrôlées et exercices de marche spécifiques.",
    sessionCount: "8 à 12 séances. Un traitement précoce améliore le pronostic.",
    relatedSlugs: ["migraine-vestibulaire", "deficit-vestibulaire", "vppb"],
    order: 7,
  },
  {
    slug: "vertige-post-commotion",
    title: "Vertige post-commotion",
    shortDescription: "Vertiges et troubles de l'équilibre persistants après un traumatisme crânien.",
    heroHook: "Des vertiges qui persistent après un choc à la tête ? La rééducation vestibulaire post-commotion accélère la récupération.",
    longDescription: "Les vertiges post-commotionnels touchent jusqu'à 80% des patients après un traumatisme crânien.\n\nPlusieurs mécanismes coexistent souvent : VPPB post-traumatique, lésion vestibulaire, dysfonctionnement cervicogénique.",
    symptoms: ["Vertiges positionnels", "Instabilité à la marche", "Sensibilité aux mouvements rapides", "Céphalées associées", "Fatigue cognitive", "Brouillard mental"],
    causes: "Le traumatisme crânien peut affecter le système vestibulaire à plusieurs niveaux.\n\nUn coup du lapin concomitant ajoute souvent une composante cervicogénique.",
    protocol: "Prise en charge multimodale ciblant chaque composante identifiée.\n\nProtocole structuré de retour progressif à l'activité.",
    sessionDescription: "Bilan post-commotion complet : vestibulaire, cervical, effort.\n\nSéances combinant rééducation vestibulaire, traitement cervical et reconditionnement.",
    sessionCount: "6 à 16 séances sur 2 à 4 mois selon la sévérité.",
    relatedSlugs: ["vertige-cervicogenique", "vppb", "nevrite-vestibulaire"],
    order: 8,
  },
];

async function seed() {
  await db.delete(schema.services);
  for (const c of conditions) {
    await db.insert(schema.services).values({ ...c, published: true });
  }
  console.log(`Seeded ${conditions.length} conditions`);
}

seed().catch(console.error);
