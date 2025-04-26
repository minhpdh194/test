export const questionList5 = [
    {
        description: {
            'en': "What is the primary effect of inflation on personal finances?",
            'fr': "Quel est l'effet principal de l'inflation sur les finances personnelles?",
            'es': "¿Cuál es el efecto principal de la inflación en las finanzas personales?"
        },
        type: "single_choice"
    },
    {
        description: {
            'en': "What does the consumer price index (CPI) measure?",
            'fr': "Que mesure l’indice des prix à la consommation (IPC)?",
            'es': "¿Qué mide el índice de precios al consumidor (IPC)?"
        },
        type: "multiple_choice"
    },
    {
        description: {
            'en': "What is the \"risk-free rate\"?",
            'fr': "Qu’est-ce que le \"taux sans risque\"?",
            'es': "¿Qué es la \"tasa libre de riesgo\"?"
        },
        type: "single_choice"
    },
    {
        description: {
            'en': "Why can't governments just print unlimited money?",
            'fr': "Pourquoi les gouvernements ne peuvent-ils pas simplement imprimer de l'argent en illimité?",
            'es': "¿Por qué los gobiernos no pueden simplemente imprimir dinero sin límite?"
        },
        type: "single_choice"
    },
    {
        description: {
            'en': "What actions are taken by central banks to manage inflation?",
            'fr': "Quelles mesures les banques centrales prennent-elles pour gérer l’inflation?",
            'es': "¿Qué acciones toman los bancos centrales para gestionar la inflación?"
        },
        type: "multiple_choice"
    },
    {
        description: {
            'en': "What happens when interest rates are low during a recession (without inflation)?",
            'fr': "Que se passe-t-il lorsque les taux d’intérêt sont bas pendant une période de récession (sans inflation)?",
            'es': "¿Qué sucede cuando las tasas de interés son bajas durante una recesión (sin inflación)?"
        },
        type: "single_choice"
    },
    {
        description: {
            'en': "Which of the following are causes of inflation mentioned in the video?",
            'fr': "Quelles sont les causes de l'inflation mentionnées dans la vidéo?",
            'es': "¿Cuáles son las causas de la inflación mencionadas en el video?"
        },
        type: "multiple_choice"
    },
    {
        description: {
            'en': "What are some of the ways inflation affects people’s lives?",
            'fr': "Quelles sont les façons dont l’inflation affecte la vie des gens?",
            'es': "¿De qué maneras afecta la inflación la vida de las personas?"
        },
        type: "multiple_choice"
    },
];

export const answerList5 = [
    // Question 1
    { description: { 'en': "It increases your income", 'fr': "Cela augmente vos revenus", 'es': "Aumenta tus ingresos"}, is_correct: false, question_id: 1 },
    { description: { 'en': "It lowers interest rates", 'fr': "Cela réduit les taux d'intérêt", 'es': "Disminuye las tasas de interés"}, is_correct: false, question_id: 1 },
    { description: { 'en': "It increases the value of cash", 'fr': "Cela augmente la valeur de l'argent liquide", 'es': "Aumenta el valor del efectivo"}, is_correct: false, question_id: 1 },
    { description: { 'en': "It reduces your purchasing power", 'fr': "Cela réduit votre pouvoir d'achat", 'es': "Reduce tu poder adquisitivo"}, is_correct: true, question_id: 1 },

    // Question 2
    { description: { 'en': "Value loss of money in circulation", 'fr': "Perte de valeur de l'argent en circulation", 'es': "Pérdida de valor del dinero en circulación"}, is_correct: true, question_id: 2 },
    { description: { 'en': "Economic growth", 'fr': "Croissance économique", 'es': "Crecimiento económico"}, is_correct: false, question_id: 2 },
    { description: { 'en': "Asset prices", 'fr': "Prix des actifs", 'es': "Precios de los activos"}, is_correct: false, question_id: 2 },
    { description: { 'en': "The increase in daily prices", 'fr': "L'augmentation des prix quotidiens", 'es': "El aumento de los precios diarios"}, is_correct: true, question_id: 2 },

    // Question 3
    { description: { 'en': "The cost of cash", 'fr': "Le coût de l'argent", 'es': "El costo del dinero"}, is_correct: true, question_id: 3 },
    { description: { 'en': "The stock market return", 'fr': "Le rendement du marché boursier", 'es': "El rendimiento del mercado de valores"}, is_correct: false, question_id: 3 },
    { description: { 'en': "A central bank policy", 'fr': "Une politique de banque centrale", 'es': "Una política del banco central"}, is_correct: false, question_id: 3 },
    { description: { 'en': "The interest rate of a mortgage", 'fr': "Le taux d'intérêt d'un prêt hypothécaire", 'es': "La tasa de interés de una hipoteca"}, is_correct: false, question_id: 3 },

    // Question 4
    { description: { 'en': "It leads to unemployment", 'fr': "Cela mène au chômage", 'es': "Conduce al desempleo"}, is_correct: false, question_id: 4 },
    { description: { 'en': "It causes inflation", 'fr': "Cela provoque de l'inflation", 'es': "Causa inflación"}, is_correct: true, question_id: 4 },
    { description: { 'en': "It reduces taxes", 'fr': "Cela réduit les taxes", 'es': "Reduce los impuestos"}, is_correct: false, question_id: 4 },
    { description: { 'en': "It stabilizes the economy", 'fr': "Cela stabilise l'économie", 'es': "Estabiliza la economía"}, is_correct: false, question_id: 4 },

    // Question 5
    { description: { 'en': "Print more money", 'fr': "Imprimer plus d'argent", 'es': "Imprimir más dinero"}, is_correct: false, question_id: 5 },
    { description: { 'en': "Adjust interest rates", 'fr': "Ajuster les taux d'intérêt", 'es': "Ajustar las tasas de interés"}, is_correct: true, question_id: 5 },
    { description: { 'en': "Invest overseas", 'fr': "Investir à l'étranger", 'es': "Invertir en el extranjero"}, is_correct: false, question_id: 5 },
    { description: { 'en': "Align money supply with growth", 'fr': "Aligner la masse monétaire sur la croissance", 'es': "Alinear la oferta monetaria con el crecimiento"}, is_correct: true, question_id: 5 },

    // Question 6
    { description: { 'en': "The economy grows rapidly", 'fr': "L'économie croît rapidement", 'es': "La economía crece rápidamente"}, is_correct: false, question_id: 6 },
    { description: { 'en': "Money becomes more valuable", 'fr': "L'argent devient plus précieux", 'es': "El dinero se vuelve más valioso"}, is_correct: false, question_id: 6 },
    { description: { 'en': "Asset prices tend to decrease", 'fr': "Les prix des actifs ont tendance à baisser", 'es': "Los precios de los activos tienden a disminuir"}, is_correct: true, question_id: 6 },
    { description: { 'en': "People can save more money", 'fr': "Les gens peuvent économiser plus d'argent", 'es': "La gente puede ahorrar más dinero"}, is_correct: false, question_id: 6 },

    // Question 7
    { description: { 'en': "Excess money printing", 'fr': "Impression excessive de monnaie", 'es': "Impresión excesiva de dinero"}, is_correct: true, question_id: 7 },
    { description: { 'en': "High employment rates", 'fr': "Taux d'emploi élevés", 'es': "Altas tasas de empleo"}, is_correct: false, question_id: 7 },
    { description: { 'en': "Surplus liquidity in markets", 'fr': "Liquidité excédentaire sur les marchés", 'es': "Liquidez excedente en los mercados"}, is_correct: true, question_id: 7 },
    { description: { 'en': "Economic stagnation with rising asset prices", 'fr': "Stagnation économique avec hausse des prix des actifs", 'es': "Estancamiento económico con aumento de precios de activos"}, is_correct: true, question_id: 7 },

    // Question 8
    { description: { 'en': "Salaries always increase", 'fr': "Les salaires augmentent toujours", 'es': "Los salarios siempre aumentan"}, is_correct: false, question_id: 8 },
    { description: { 'en': "Daily expenses become higher", 'fr': "Les dépenses quotidiennes augmentent", 'es': "Los gastos diarios aumentan"}, is_correct: true, question_id: 8 },
    { description: { 'en': "Prices of food and transport increase", 'fr': "Les prix de la nourriture et des transports augmentent", 'es': "Los precios de los alimentos y el transporte aumentan"}, is_correct: true, question_id: 8 },
    { description: { 'en': "Investments lose value", 'fr': "Les investissements perdent de la valeur", 'es': "Las inversiones pierden valor"}, is_correct: true, question_id: 8 },
];