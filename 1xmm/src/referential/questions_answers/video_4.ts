export const questionList4 = [
    {
        description: {
            'en': "What is the primary factor that determines the price of an asset in a market?",
            'fr': "Quel est le facteur principal qui détermine le prix d'un actif sur un marché?",
            'es': "¿Cuál es el factor principal que determina el precio de un activo en un mercado?"
        },
        type: "single_choice"
    },
    {
        description: {
            'en': "What role do market makers play on centralized exchanges?",
            'fr': "Quel rôle jouent les market makers sur les échanges centralisés?",
            'es': "¿Qué papel juegan los market makers en los exchanges centralizados?"
        },
        type: "single_choice"
    },
    {
        description: {
            'en': "Why do cryptocurrency prices vary between different exchanges?",
            'fr': "Pourquoi les prix des cryptomonnaies varient-ils entre les différentes plateformes?",
            'es': "¿Por qué varían los precios de las criptomonedas entre diferentes exchanges?"
        },
        type: "multiple_choice"
    },
    {
        description: {
            'en': "Which of the following are types of price formation models that can be used in DeFi?",
            'fr': "Quels sont les types de modèles de formation des prix qui peuvent être utilisés en DeFi?",
            'es': "¿Cuáles son los tipos de modelos de formación de precios que se pueden utilizar en DeFi?"
        },
        type: "multiple_choice"
    },
    {
        description: {
            'en': "Which of the following describes the order book on a centralized exchange?",
            'fr': "Quel est le rôle principal de l'ordre décentralisé Asagaia?",
            'es': "¿Cuál de las siguientes describe el libro de órdenes en un exchange centralizado?"
        },
        type: "single_choice"
    },
    {
        description: {
            'en': "What is a key drawback of decentralized exchanges compared to centralized exchanges?",
            'fr': "Quel est un inconvénient clé des échanges décentralisés par rapport aux échanges centralisés?",
            'es': "¿Cuál es una desventaja clave de los exchanges descentralizados en comparación con los exchanges centralizados?"
        },
        type: "single_choice"
    },
    {
        description: {
            'en': "Which of the following are characteristics of Automated Market Makers (AMMs)?",
            'fr': "Quelles sont les caractéristiques des Automated Market Makers (AMMs)?",
            'es': "¿Cuáles de los siguientes son características de los Automated Market Makers (AMMs)?"
        },
        type: "multiple_choice"
    },
    {
        description: {
            'en': "What are key features of the Asagaia Decentralized Order Book?",
            'fr': "Quelles sont les fonctionnalités clés de l'ordre décentralisé Asagaia?",
            'es': "¿Cuáles son las características clave del libro de órdenes descentralizado de Asagaia?"
        },
        type: "multiple_choice"
    },
];

export const answerList4 = [
    // Question 1
{ description: { 'en': "Market makers", 'fr': "Market Makers", 'es': "Market Makers"}, is_correct: false, question_id: 1 },
{ description: { 'en': "Government regulations", 'fr': "Réglementations gouvernementales", 'es': "Regulaciones gubernamentales"}, is_correct: false, question_id: 1 },
{ description: { 'en': "Supply and demand", 'fr': "Offre et demande", 'es': "Oferta y demanda"}, is_correct: true, question_id: 1 },
{ description: { 'en': "Blockchain technology", 'fr': "Technologie blockchain", 'es': "Tecnología blockchain"}, is_correct: false, question_id: 1 },

// Question 2
{ description: { 'en': "They provide liquidity and set bid and ask prices", 'fr': "Ils fournissent de la liquidité et fixent les prix d'achat et de vente", 'es': "Proporcionan liquidez y establecen precios de compra y venta"}, is_correct: true, question_id: 2 },
{ description: { 'en': "They regulate the cryptocurrency market", 'fr': "Ils régulent le marché des cryptomonnaies", 'es': "Regulan el mercado de criptomonedas"}, is_correct: false, question_id: 2 },
{ description: { 'en': "They prevent price fluctuations", 'fr': "Ils empêchent les fluctuations de prix", 'es': "Evitan las fluctuaciones de precios"}, is_correct: false, question_id: 2 },
{ description: { 'en': "They trade at prices fixed by exchanges", 'fr': "Ils négocient à des prix fixés par les échanges", 'es': "Operan a precios fijados por los intercambios"}, is_correct: false, question_id: 2 },

// Question 3
{ description: { 'en': "Different levels of supply and demand on each exchange", 'fr': "Différents niveaux d'offre et de demande sur chaque échange", 'es': "Diferentes niveles de oferta y demanda en cada intercambio"}, is_correct: true, question_id: 3 },
{ description: { 'en': "Market makers setting different prices based on liquidity", 'fr': "Les faiseurs de marché fixent des prix différents en fonction de la liquidité", 'es': "Los creadores de mercado establecen precios diferentes según la liquidez"}, is_correct: true, question_id: 3 },
{ description: { 'en': "Government intervention on specific exchanges", 'fr': "Intervention gouvernementale sur certains échanges", 'es': "Intervención gubernamental en intercambios específicos"}, is_correct: false, question_id: 3 },
{ description: { 'en': "Price of a cryptocurrency depends on the timezone", 'fr': "Le prix d'une cryptomonnaie dépend du fuseau horaire", 'es': "El precio de una criptomoneda depende de la zona horaria"}, is_correct: false, question_id: 3 },

// Question 4
{ description: { 'en': "Automated Market Makers (AMMs)", 'fr': "Faiseurs de marché automatisés (AMMs)", 'es': "Creadores de mercado automatizados (AMMs)"}, is_correct: true, question_id: 4 },
{ description: { 'en': "Hybrid Financial Technology companies", 'fr': "Entreprises hybrides de technologie financière", 'es': "Empresas híbridas de tecnología financiera"}, is_correct: true, question_id: 4 },
{ description: { 'en': "Traditional market maker intervention", 'fr': "Intervention traditionnelle des faiseurs de marché", 'es': "Intervención tradicional de los creadores de mercado"}, is_correct: false, question_id: 4 },
{ description: { 'en': "Decentralized Order Books", 'fr': "Carnets d'ordres décentralisés", 'es': "Libros de órdenes descentralizados"}, is_correct: true, question_id: 4 },

// Question 5
{ description: { 'en': "A list of historical prices of an asset", 'fr': "Une liste des prix historiques d'un actif", 'es': "Una lista de precios históricos de un activo"}, is_correct: false, question_id: 5 },
{ description: { 'en': "A record of all decentralized transactions", 'fr': "Un enregistrement de toutes les transactions décentralisées", 'es': "Un registro de todas las transacciones descentralizadas"}, is_correct: false, question_id: 5 },
{ description: { 'en': "A continuous auction of buy and sell prices", 'fr': "Une enchère continue des prix d'achat et de vente", 'es': "Una subasta continua de precios de compra y venta"}, is_correct: false, question_id: 5 },
{ description: { 'en': "A government-regulated price list", 'fr': "Une liste de prix réglementée par le gouvernement", 'es': "Una lista de precios regulada por el gobierno"}, is_correct: false, question_id: 5 },

// Question 6
{ description: { 'en': "They do not allow users to retain full control over their assets", 'fr': "Ils n'autorisent pas les utilisateurs à conserver un contrôle total sur leurs actifs", 'es': "No permiten a los usuarios retener el control total de sus activos"}, is_correct: false, question_id: 6 },
{ description: { 'en': "They are completely controlled by traditional banks", 'fr': "Ils sont entièrement contrôlés par les banques traditionnelles", 'es': "Están completamente controlados por los bancos tradicionales"}, is_correct: false, question_id: 6 },
{ description: { 'en': "They use the same market makers as centralized exchanges", 'fr': "Ils utilisent les mêmes faiseurs de marché que les échanges centralisés", 'es': "Usan los mismos creadores de mercado que los intercambios centralizados"}, is_correct: false, question_id: 6 },
{ description: { 'en': "Price formation is less efficient due to blockchain limitations", 'fr': "La formation des prix est moins efficace en raison des limitations de la blockchain", 'es': "La formación de precios es menos eficiente debido a las limitaciones de la blockchain"}, is_correct: true, question_id: 6 },

// Question 7
{ description: { 'en': "They provide random prices", 'fr': "Ils fournissent des prix aléatoires", 'es': "Proporcionan precios aleatorios"}, is_correct: false, question_id: 7 },
{ description: { 'en': "They use predefined formulas to determine prices", 'fr': "Ils utilisent des formules prédéfinies pour déterminer les prix", 'es': "Usan fórmulas predefinidas para determinar los precios"}, is_correct: true, question_id: 7 },
{ description: { 'en': "Users do not keep ownership of their assets", 'fr': "Les utilisateurs ne conservent pas la propriété de leurs actifs", 'es': "Los usuarios no mantienen la propiedad de sus activos"}, is_correct: false, question_id: 7 },
{ description: { 'en': "They do not require intermediaries", 'fr': "Ils ne nécessitent pas d'intermédiaires", 'es': "No requieren intermediarios"}, is_correct: true, question_id: 7 },

    // Question 8
{ description: { 'en': "It completely eliminates the need for liquidity", 'fr': "Il élimine les besoins de liquidité", 'es': "Elimina por completo la necesidad de liquidez"}, is_correct: false, question_id: 8 },
{ description: { 'en': "It integrates the 1xMM token", 'fr': "Il intègre le jeton 1xMM", 'es': "Integra el token 1xMM"}, is_correct: true, question_id: 8 },
{ description: { 'en': "It merges centralized and decentralized technologies", 'fr': "Il fusionne les technologies centralisées et décentralisées", 'es': "Fusiona tecnologías centralizadas y descentralizadas"}, is_correct: true, question_id: 8 },
{ description: { 'en': "It includes layer 2 services for interpreting decentralized market maker pools", 'fr': "Il inclut des services Layer 2 pour interpréter les pools de Market Making décentralisés", 'es': "Incluye servicios de capa 2 para interpretar pools de Market Making descentralizados"}, is_correct: true, question_id: 8 }
];