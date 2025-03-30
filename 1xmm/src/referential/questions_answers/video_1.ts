import { QuestionType } from "../questionsAnswers";

export const questionList1: Array<QuestionType> = [
    {
        description: {
            'en': "What is the primary goal of 1xMM?",
            'fr': "Quel est l'objectif principal de 1xMM?",
            'es': "¿Cuál es el objetivo principal de 1xMM?"
        },
        type: "single_choice"
    },
    {
        description: {
            'en': "How do the 1xMM Pools generate yields?",
            'fr': "Comment les Pools 1xMM génèrent-ils leurs rendements?",
            'es': "¿Cómo generan rendimientos los Pools 1xMM?"
        },
        type: "single_choice"
    },
    {
        description: {
            'en': "Which are 1xMM Token features?",
            'fr': "Quelles sont les caractéristiques du Token 1xMM?",
            'es': "¿Cuáles son las características del Token 1xMM?"
        },
        type: "multiple_choice"
    },
    {
        description: {
            'en': "Which of the following steps are included in the staking process?",
            'fr': "Quelles étapes sont incluses dans le processus de staking?",
            'es': "¿Cuáles de los siguientes pasos están incluidos en el proceso de staking?"
        },
        type: "multiple_choice"
    },
    {
        description: {
            'en': "What are some of the benefits of the 1xMM Pools?",
            'fr': "Quels sont les avantages des Pools 1xMM?",
            'es': "¿Cuáles son algunos de los beneficios de los Pools 1xMM?"
        },
        type: "single_choice"
    },
    {
        description: {
            'en': "What makes 1xMM staking user-friendly?",
            'fr': "Qu'est-ce qui rend le staking 1xMM convivial pour l'utilisateur?",
            'es': "¿Qué hace que el staking de 1xMM sea fácil de usar?"
        },
        type: "single_choice"
    },
    {
        description: {
            'en': "Which other projects will follow 1xMM project?",
            'fr': "Quels autres projets suivront le projet 1xMM?",
            'es': "¿Qué otros proyectos seguirán al proyecto 1xMM?"
        },
        type: "multiple_choice"
    },
];

export const answerList1 = [
    // Question 1
    { description: { 'en': "To create a new cryptocurrency for trading", 'fr': "Créer une nouvelle crypto à échanger", 'es': "Crear una nueva criptomoneda para comerciar" }, is_correct: false, question_id: 1 },
    { description: { 'en': "To provide an all-in-one DeFi solution", 'fr': "Offrir une solution DeFi tout-en-un", 'es': "Proporcionar una solución DeFi todo en uno" }, is_correct: true, question_id: 1 },
    { description: { 'en': "To replace traditional banks with crypto lending services", 'fr': "Remplacer les banques traditionnelles par des services de prêts crypto", 'es': "Reemplazar los bancos tradicionales con servicios de préstamo cripto" }, is_correct: false, question_id: 1 },
    { description: { 'en': "To act as a centralized exchange for digital assets", 'fr': "Agir comme une plateforme d'échange centralisée pour les actifs numériques", 'es': "Actuar como un exchange centralizado para activos digitales" }, is_correct: false, question_id: 1 },

    // Question 2
    { description: { 'en': "By mining new tokens daily", 'fr': "En minant de nouveaux tokens quotidiennement", 'es': "Minando nuevos tokens diariamente" }, is_correct: false, question_id: 2 },
    { description: { 'en': "By charging high transaction fees on every trade", 'fr': "En facturant des frais de transaction élevés à chaque échange", 'es': "Cobrando altas comisiones en cada transacción" }, is_correct: false, question_id: 2 },
    { description: { 'en': "Through funding rates using Futures and Options markets", 'fr': "Grâce aux taux de financement utilisant les marchés des Futures et Options", 'es': "A través de tasas de financiación utilizando los mercados de Futuros y Opciones" }, is_correct: true, question_id: 2 },
    { description: { 'en': "Through a staking lottery system", 'fr': "Grâce à un système de loterie", 'es': "A través de un sistema de lotería" }, is_correct: false, question_id: 2 },

    // Question 3
    { description: { 'en': "Deflationary and offering access to rebates", 'fr': "Déflationniste et offrant un accès à des remises", 'es': "Deflacionario y ofreciendo acceso a descuentos" }, is_correct: true, question_id: 3 },
    { description: { 'en': "Staking rewards that grow indefinitely", 'fr': "Des récompenses de staking qui augmentent indéfiniment", 'es': "Recompensas de staking que crecen indefinidamente" }, is_correct: false, question_id: 3 },
    { description: { 'en': "Bridgeable for cross-chain transfers", 'fr': "Transférable entre blockchains", 'es': "Transferible entre cadenas" }, is_correct: true, question_id: 3 },
    { description: { 'en': "Auto-exchangeable at preferential rates", 'fr': "Échangeable automatiquement à des taux préférentiels", 'es': "Intercambiable automáticamente a tasas preferenciales" }, is_correct: true, question_id: 3 },

    // Question 4
    { description: { 'en': "Selecting a staking pool", 'fr': "Sélectionner un pool de staking", 'es': "Seleccionar un pool de staking" }, is_correct: true, question_id: 4 },
    { description: { 'en': "Choosing a term and a position", 'fr': "Choisir une durée et une position", 'es': "Elegir un plazo y una posición" }, is_correct: true, question_id: 4 },
    { description: { 'en': "Setting up a third-party intermediary for withdrawals", 'fr': "Mettre en place un intermédiaire tiers pour les retraits", 'es': "Configurar un intermediario externo para los retiros" }, is_correct: false, question_id: 4 },
    { description: { 'en': "Opening positions without monitoring them", 'fr': "Ouvrir des positions sans les surveiller", 'es': "Abrir posiciones sin monitorearlas" }, is_correct: false, question_id: 4 },

    // Question 5
    { description: { 'en': "Guaranteed profits with no market risk", 'fr': "Profits garantis sans risque de marché", 'es': "Ganancias garantizadas sin riesgo de mercado" }, is_correct: false, question_id: 5 },
    { description: { 'en': "Manual oversight by a financial authority", 'fr': "Supervision manuelle par une autorité financière", 'es': "Supervisión manual por una autoridad financiera" }, is_correct: false, question_id: 5 },
    { description: { 'en': "High transaction fees to ensure long-term sustainability", 'fr': "Frais de transaction élevés pour assurer la durabilité à long terme", 'es': "Altas comisiones de transacción para garantizar la sostenibilidad a largo plazo" }, is_correct: false, question_id: 5 },
    { description: { 'en': "No insolvency, no impermanent loss, and natural leverage", 'fr': "Pas d'insolvabilité, pas de perte impermanente et un effet de levier naturel", 'es': "Sin insolvencia, sin pérdida impermanente y apalancamiento natural" }, is_correct: true, question_id: 5 },

    // Question 6
    { description: { 'en': "Ability to withdraw anytime after the minimum staking period", 'fr': "Possibilité de retirer à tout moment après la période minimale de staking", 'es': "Capacidad de retirar en cualquier momento después del período mínimo de staking" }, is_correct: true, question_id: 6 },
    { description: { 'en': "Complicated registration processes", 'fr': "Processus d'inscription compliqués", 'es': "Procesos de registro complicados" }, is_correct: false, question_id: 6 },
    { description: { 'en': "Penalties for early withdrawals", 'fr': "Pénalités pour retraits anticipés", 'es': "Penalizaciones por retiros anticipados" }, is_correct: false, question_id: 6 },
    { description: { 'en': "Fixed returns regardless of market conditions", 'fr': "Rendements fixes indépendamment des conditions du marché", 'es': "Rendimientos fijos sin importar las condiciones del mercado" }, is_correct: false, question_id: 6 },

    // Question 7
    { description: { 'en': "Loss protection for everyone", 'fr': "Protection contre les pertes pour tous", 'es': "Protección contra pérdidas para todos" }, is_correct: false, question_id: 7 },
    { description: { 'en': "Concentration of wealth to disempower people", 'fr': "Concentration de la richesse pour priver les gens de pouvoir", 'es': "Concentración de riqueza para despojar de poder a las personas" }, is_correct: false, question_id: 7 },
    { description: { 'en': "Decentralized Order Book platform", 'fr': "Plateforme de carnet d'ordres décentralisée", 'es': "Plataforma de libro de órdenes descentralizada" }, is_correct: true, question_id: 7 },
    { description: { 'en': "Green asset digitization", 'fr': "Numérisation des actifs verts", 'es': "Digitalización de activos verdes" }, is_correct: true, question_id: 7 },
];