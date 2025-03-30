export const questionList3 = [
    {
        description: {
            'en': "What is a major downside of printing money over time?",
            'fr': "Quel est le principal inconvénient de l'impression monétaire au fil du temps?",
            'es': "¿Cuál es la principal desventaja de imprimir dinero con el tiempo?"
        },
        type: "single_choice"
    },
    {
        description: {
            'en': "What are key characteristics of yields in DeFi?",
            'fr': "Quelles sont les caractéristiques clés des rendements en DeFi?",
            'es': "¿Cuáles son las características clave de los rendimientos en DeFi?"
        },
        type: "multiple_choice"
    },
    {
        description: {
            'en': "In traditional finance, how are interest rates typically determined?",
            'fr': "Dans la finance traditionnelle, comment les taux d'intérêt sont-ils généralement déterminés?",
            'es': "En la finanza tradicional, ¿cómo se determinan típicamente las tasas de interés?"
        },
        type: "single_choice"
    },
    {
        description: {
            'en': "What are common sources of yield generation in DeFi?",
            'fr': "Quelles sont les sources courantes de génération de rendement en DeFi?",
            'es': "¿Cuáles son las fuentes comunes de generación de rendimiento en DeFi?"
        },
        type: "multiple_choice"
    },
    {
        description: {
            'en': "How do lending protocols like Aave or Compound determine interest rates?",
            'fr': "Comment les protocoles de prêt comme Aave ou Compound déterminent-ils les taux d'intérêt?",
            'es': "¿Cómo determinan los protocolos de préstamo como Aave o Compound las tasas de interés?"
        },
        type: "single_choice"
    },
    {
        description: {
            'en': "What risks can be associated with investments?",
            'fr': "Quels risques peuvent être associés aux investissements?",
            'es': "¿Qué riesgos pueden estar asociados con las inversiones?"
        },
        type: "multiple_choice"
    },
    {
        description: {
            'en': "What differentiates DeFi from traditional finance regarding interest and yield?",
            'fr': "Quelle est la différence entre DeFi et la finance traditionnelle en ce qui concerne les intérêts et les rendements?",
            'es': "¿Qué diferencia a DeFi de la finanza tradicional en cuanto a intereses y rendimientos?"
        },
        type: "single_choice"
    },
    {
        description: {
            'en': "Why are DeFi yields can be considered more transparent than TradFi interest rates?",
            'fr': "Pourquoi les rendements DeFi peuvent-ils être considérés comme plus transparents que les taux d'intérêt TradFi?",
            'es': "¿Por qué los rendimientos DeFi pueden considerarse más transparentes que las tasas de interés TradFi?"
        },
        type: "multiple_choice"
    }
];

export const answerList3 = [
    // Question 1
{ description: {'en': "It always increases economic stability", 'fr': "Cela augmente toujours la stabilité économique", 'es': "Siempre aumenta la estabilidad económica" }, is_correct: false, question_id: 1 },
{ description: {'en': "It ensures continuous economic growth", 'fr': "Cela assure une croissance économique continue", 'es': "Garantiza un crecimiento económico continuo" }, is_correct: false, question_id: 1 },
{ description: {'en': "It eliminates the possibility of financial crises", 'fr': "Cela élimine la possibilité de crises financières", 'es': "Elimina la posibilidad de crisis financieras" }, is_correct: false, question_id: 1 },
{ description: {'en': "It leads to a widening gap between asset creation and real value", 'fr': "Cela entraîne un écart croissant entre la création d’actifs et la valeur réelle", 'es': "Conduce a una brecha creciente entre la creación de activos y el valor real" }, is_correct: true, question_id: 1 },

// Question 2
{ description: {'en': "They are always guaranteed", 'fr': "Ils sont toujours garantis", 'es': "Siempre están garantizados" }, is_correct: false, question_id: 2 },
{ description: {'en': "They are artificially set by central banks", 'fr': "Ils sont fixés artificiellement par les banques centrales", 'es': "Son establecidos artificialmente por los bancos centrales" }, is_correct: false, question_id: 2 },
{ description: {'en': "They fluctuate based on market performance", 'fr': "Ils fluctuent en fonction de la performance du marché", 'es': "Fluctúan en función del rendimiento del mercado" }, is_correct: true, question_id: 2 },
{ description: {'en': "They depend on factors like staking, lending, and liquidity provision", 'fr': "Ils dépendent de facteurs comme le staking, le prêt et la fourniture de liquidité", 'es': "Dependen de factores como el staking, los préstamos y la provisión de liquidez" }, is_correct: true, question_id: 2 },

// Question 3
{ description: {'en': "They are set dynamically based on asset performance", 'fr': "Ils sont fixés dynamiquement en fonction de la performance des actifs", 'es': "Se establecen dinámicamente según el rendimiento del activo" }, is_correct: false, question_id: 3 },
{ description: {'en': "They are purely market-driven", 'fr': "Ils sont purement déterminés par le marché", 'es': "Son impulsados puramente por el mercado" }, is_correct: false, question_id: 3 },
{ description: {'en': "They are only influenced by staking and liquidity pools", 'fr': "Ils sont uniquement influencés par le staking et les pools de liquidité", 'es': "Solo están influenciados por el staking y los pools de liquidez" }, is_correct: false, question_id: 3 },
{ description: {'en': "They are determined and fixed by central banks", 'fr': "Ils sont déterminés et fixés par les banques centrales", 'es': "Son determinados y fijados por los bancos centrales" }, is_correct: true, question_id: 3 },

// Question 4
{ description: {'en': "Staking rewards", 'fr': "Récompenses de staking", 'es': "Recompensas de staking" }, is_correct: true, question_id: 4 },
{ description: {'en': "Lending protocols", 'fr': "Protocoles de prêt", 'es': "Protocolos de préstamos" }, is_correct: true, question_id: 4 },
{ description: {'en': "Liquidity provision", 'fr': "Fourniture de liquidité", 'es': "Provisión de liquidez" }, is_correct: true, question_id: 4 },
{ description: {'en': "Fixed interest savings accounts", 'fr': "Comptes d'épargne à taux fixe", 'es': "Cuentas de ahorro con interés fijo" }, is_correct: false, question_id: 4 },

// Question 5
{ description: {'en': "They adjust dynamically based on supply and demand", 'fr': "Ils s'ajustent dynamiquement en fonction de l'offre et de la demande", 'es': "Se ajustan dinámicamente según la oferta y la demanda" }, is_correct: true, question_id: 5 },
{ description: {'en': "They remain fixed regardless of market conditions", 'fr': "Ils restent fixes indépendamment des conditions du marché", 'es': "Permanecen fijos independientemente de las condiciones del mercado" }, is_correct: false, question_id: 5 },
{ description: {'en': "They are set by central authorities", 'fr': "Ils sont fixés par les autorités centrales", 'es': "Son establecidos por las autoridades centrales" }, is_correct: false, question_id: 5 },
{ description: {'en': "They only depend on the number of staked assets", 'fr': "Ils dépendent uniquement du nombre d'actifs mis en staking", 'es': "Dependen solo de la cantidad de activos en staking" }, is_correct: false, question_id: 5 },

// Question 6
{ description: {'en': "Guaranteed profits", 'fr': "Profits garantis", 'es': "Ganancias garantizadas" }, is_correct: false, question_id: 6 },
{ description: {'en': "Counterparty risk", 'fr': "Risque de contrepartie", 'es': "Riesgo de contraparte" }, is_correct: true, question_id: 6 },
{ description: {'en': "Market risk", 'fr': "Risque de marché", 'es': "Riesgo de mercado" }, is_correct: true, question_id: 6 },
{ description: {'en': "Liquidity risk", 'fr': "Risque de liquidité", 'es': "Riesgo de liquidez" }, is_correct: true, question_id: 6 },

// Question 7
{ description: {'en': "DeFi offers fixed, centrally determined rates", 'fr': "La DeFi offre des taux fixes déterminés de manière centralisée", 'es': "DeFi ofrece tasas fijas determinadas centralmente" }, is_correct: false, question_id: 7 },
{ description: {'en': "TradFi and DeFi use identical yield structures", 'fr': "La TradFi et la DeFi utilisent des structures de rendement identiques", 'es': "TradFi y DeFi utilizan estructuras de rendimiento idénticas" }, is_correct: false, question_id: 7 },
{ description: {'en': "TradFi uses staking rewards instead of fixed interest rates", 'fr': "La TradFi utilise des récompenses de staking au lieu de taux d'intérêt fixes", 'es': "TradFi usa recompensas de staking en lugar de tasas de interés fijas" }, is_correct: false, question_id: 7 },
{ description: {'en': "TradFi fixes interest rates, while DeFi offers dynamic, risk-adjusted yields", 'fr': "La TradFi fixe les taux d'intérêt, tandis que la DeFi offre des rendements dynamiques ajustés au risque", 'es': "TradFi fija las tasas de interés, mientras que DeFi ofrece rendimientos dinámicos ajustados al riesgo" }, is_correct: true, question_id: 7 },

// Question 8
{ description: {'en': "They are secretly controlled by financial institutions", 'fr': "Ils sont secrètement contrôlés par des institutions financières", 'es': "Son controlados en secreto por instituciones financieras" }, is_correct: false, question_id: 8 },
{ description: {'en': "They are determined by real market conditions", 'fr': "Ils sont déterminés par les conditions réelles du marché", 'es': "Son determinados por las condiciones reales del mercado" }, is_correct: true, question_id: 8 },
{ description: {'en': "They are influenced by user activity and decentralized protocols", 'fr': "Ils sont influencés par l'activité des utilisateurs et les protocoles décentralisés", 'es': "Son influenciados por la actividad de los usuarios y los protocolos descentralizados" }, is_correct: true, question_id: 8 },
{ description: {'en': "They are completely risk-free", 'fr': "Ils sont totalement sans risque", 'es': "Son completamente libres de riesgo" }, is_correct: false, question_id: 8 },
];