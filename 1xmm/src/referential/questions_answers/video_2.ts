export const questionList2 = [
    {
        description: {
            'en': "What happens to an asset’s price when market participants favor it?",
            'fr': "Que se passe-t-il lorsque les participants du marché le favorisent?",
            'es': "¿Qué sucede con el precio de un activo cuando los participantes del mercado lo favorecen?"
        },
        type: "single_choice"
    },
    {
        description: {
            'en': "What are the characteristics of a long position?",
            'fr': "Quelles sont les caractéristiques d'une position longue?",
            'es': "¿Cuáles son las características de una posición larga?"
        },
        type: "multiple_choice"
    },
    {
        description: {
            'en': "What should investors do before opening a position?",
            'fr': "Que devrait-on faire avant d'ouvrir une position?",
            'es': "¿Qué deberían hacer los inversores antes de abrir una posición?"
        },
        type: "single_choice"
    },
    {
        description: {
            'en': "What are some key aspects of a short position?",
            'fr': "Quels sont certains aspects clés d'une position courte?",
            'es': "¿Cuáles son algunos aspectos clave de una posición corta?"
        },
        type: "multiple_choice"
    },
    {
        description: {
            'en': "When does an investor realize a profit or loss?",
            'fr': "Quand un investisseur réalise-t-il un profit ou une perte?",
            'es': "¿Cuándo realiza un inversor una ganancia o pérdida?"
        },
        type: "single_choice"
    },
    {
        description: {
            'en': "What are key differences between 1XMM pools and traditional outright positions?",
            'fr': "Quelles sont les différences clés entre les pools 1XMM et les positions traditionnelles?",
            'es': "¿Cuáles son las diferencias clave entre los pools 1XMM y las posiciones tradicionales?"
        },
        type: "multiple_choice"
    }
];

export const answerList2 = [
    // Question 1
{ description: { 'en': "The price decreases", 'fr': "Le prix diminue", 'es': "El precio disminuye" }, is_correct: false, question_id: 1 },
{ description: { 'en': "The price remains constant", 'fr': "Le prix reste constant", 'es': "El precio se mantiene constante" }, is_correct: false, question_id: 1 },
{ description: { 'en': "The price increases", 'fr': "Le prix augmente", 'es': "El precio aumenta" }, is_correct: true, question_id: 1 },
{ description: { 'en': "The asset gets delisted", 'fr': "L'actif est retiré de la liste", 'es': "El activo es eliminado del listado" }, is_correct: false, question_id: 1 },

// Question 2
{ description: { 'en': "It is opened when we expect the asset's value to rise", 'fr': "Elle est ouverte lorsque l'on s'attend à une hausse de la valeur de l'actif", 'es': "Se abre cuando se espera que el valor del activo aumente" }, is_correct: true, question_id: 2 },
{ description: { 'en': "The investor profits if the price increases", 'fr': "L'investisseur profite si le prix augmente", 'es': "El inversor obtiene beneficios si el precio sube" }, is_correct: true, question_id: 2 },
{ description: { 'en': "It is the same as a short position", 'fr': "C'est la même chose qu'une position courte", 'es': "Es lo mismo que una posición corta" }, is_correct: false, question_id: 2 },
{ description: { 'en': "The investor profits if the price drop", 'fr': "L'investisseur profite si le prix baisse", 'es': "El inversor obtiene beneficios si el precio baja" }, is_correct: false, question_id: 2 },

// Question 3
{ description: { 'en': "Randomly buy or sell assets", 'fr': "Acheter ou vendre des actifs au hasard", 'es': "Comprar o vender activos al azar" }, is_correct: false, question_id: 3 },
{ description: { 'en': "Analyze market conditions", 'fr': "Analyser les conditions du marché", 'es': "Analizar las condiciones del mercado" }, is_correct: true, question_id: 3 },
{ description: { 'en': "Follow social media trends without research", 'fr': "Suivre les tendances des réseaux sociaux sans recherche", 'es': "Seguir las tendencias de las redes sociales sin investigación" }, is_correct: false, question_id: 3 },
{ description: { 'en': "Open both long and short positions at the same time", 'fr': "Ouvrir simultanément des positions longues et courtes", 'es': "Abrir posiciones largas y cortas al mismo tiempo" }, is_correct: false, question_id: 3 },

// Question 4
{ description: { 'en': "The investor profits if the asset’s price drops", 'fr': "L'investisseur profite si le prix de l'actif baisse", 'es': "El inversor obtiene beneficios si el precio del activo baja" }, is_correct: true, question_id: 4 },
{ description: { 'en': "The investor profits if the asset’s price increases", 'fr': "L'investisseur profite si le prix de l'actif augmente", 'es': "El inversor obtiene beneficios si el precio del activo sube" }, is_correct: false, question_id: 4 },
{ description: { 'en': "Shorting an asset is risk-free", 'fr': "Vendre un actif à découvert est sans risque", 'es': "Vender un activo en corto no tiene riesgo" }, is_correct: false, question_id: 4 },
{ description: { 'en': "It is opened when we expect the asset’s price to decline", 'fr': "Elle est ouverte lorsque l'on s'attend à une baisse du prix de l'actif", 'es': "Se abre cuando se espera que el precio del activo disminuya" }, is_correct: true, question_id: 4 },

// Question 5
{ description: { 'en': "When they monitor their unrealized profit/loss", 'fr': "Lorsqu'ils surveillent leur profit/perte latent(e)", 'es': "Cuando monitorean su ganancia/pérdida no realizada" }, is_correct: false, question_id: 5 },
{ description: { 'en': "As soon as the price moves in their favor", 'fr': "Dès que le prix évolue en leur faveur", 'es': "Tan pronto como el precio se mueva a su favor" }, is_correct: false, question_id: 5 },
{ description: { 'en': "Only when they close their position", 'fr': "Uniquement lorsqu'ils ferment leur position", 'es': "Solo cuando cierran su posición" }, is_correct: true, question_id: 5 },
{ description: { 'en': "When they open a position", 'fr': "Lorsqu'ils ouvrent une position", 'es': "Cuando abren una posición" }, is_correct: false, question_id: 5 },

// Question 6
{ description: { 'en': "1XMM pools operate based on asset performance", 'fr': "Les pools 1XMM fonctionnent en fonction de la performance des actifs", 'es': "Los pools 1XMM operan según el rendimiento de los activos" }, is_correct: true, question_id: 6 },
{ description: { 'en': "Traditional outright positions rely on the direct asset price", 'fr': "Les positions traditionnelles directes dépendent du prix de l'actif", 'es': "Las posiciones directas tradicionales dependen del precio del activo" }, is_correct: true, question_id: 6 },
{ description: { 'en': "1XMM pools guarantee profits without risk", 'fr': "Les pools 1XMM garantissent des profits sans risque", 'es': "Los pools 1XMM garantizan ganancias sin riesgo" }, is_correct: false, question_id: 6 },
{ description: { 'en': "User returns in 1XMM pools are calculated on price dynamics", 'fr': "Les rendements des utilisateurs dans les pools 1XMM sont calculés en fonction de la dynamique des prix", 'es': "Los rendimientos de los usuarios en los pools 1XMM se calculan en función de la dinámica de precios" }, is_correct: true, question_id: 6 },
];