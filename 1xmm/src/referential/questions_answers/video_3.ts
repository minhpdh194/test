export const questionList3 = [
    {
        description: "What is a major downside of printing money over time?",
        type: "single_choice"
    },
    {
        description: "What are key characteristics of yields in DeFi?",
        type: "multiple_choice"
    },
    {
        description: "In traditional finance, how are interest rates typically determined?",
        type: "single_choice"
    },
    {
        description: "What are common sources of yield generation in DeFi?",
        type: "multiple_choice"
    },
    {
        description: "How do lending protocols like Aave or Compound determine interest rates?",
        type: "single_choice"
    },
    {
        description: "What risks can be associated with investments?",
        type: "multiple_choice"
    },
    {
        description: "What differentiates DeFi from traditional finance regarding interest and yield?",
        type: "single_choice"
    },
    {
        description: "Why are DeFi yields can be considered more transparent than TradFi interest rates?",
        type: "multiple_choice"
    }
];

export const answerList3 = [
    // Question 1
    { description: "It always increases economic stability", is_correct: false, question_id: 1 },
    { description: "It ensures continuous economic growth", is_correct: false, question_id: 1 },
    { description: "It eliminates the possibility of financial crises", is_correct: false, question_id: 1 },
    { description: "It leads to a widening gap between asset creation and real value", is_correct: true, question_id: 1 },
    
    // Question 2
    { description: "They are always guaranteed", is_correct: false, question_id: 2 },
    { description: "They are artificially set by central banks", is_correct: false, question_id: 2 },
    { description: "They fluctuate based on market performance", is_correct: true, question_id: 2 },
    { description: "They depend on factors like staking, lending, and liquidity provision", is_correct: true, question_id: 2 },

    // Question 3
    { description: "They are set dynamically based on asset performance", is_correct: false, question_id: 3 },
    { description: "They are purely market-driven", is_correct: false, question_id: 3 },
    { description: "They are only influenced by staking and liquidity pools", is_correct: false, question_id: 3 },
    { description: "They are determined and fixed by central banks", is_correct: true, question_id: 3 },

    // Question 4
    { description: "Staking rewards", is_correct: true, question_id: 4 },
    { description: "Lending protocols", is_correct: true, question_id: 4 },
    { description: "Liquidity provision", is_correct: true, question_id: 4 },
    { description: "Fixed interest savings accounts", is_correct: false, question_id: 4 },

    // Question 5
    { description: "They adjust dynamically based on supply and demand", is_correct: true, question_id: 5 },
    { description: "They remain fixed regardless of market conditions", is_correct: false, question_id: 5 },
    { description: "They are set by central authorities", is_correct: false, question_id: 5 },
    { description: "They only depend on the number of staked assets", is_correct: false, question_id: 5 },

    // Question 6
    { description: "Guaranteed profits", is_correct: false, question_id: 6 },
    { description: "Counterparty risk", is_correct: true, question_id: 6 },
    { description: "Market risk", is_correct: true, question_id: 6 },
    { description: "Liquidity risk", is_correct: true, question_id: 6 },

    // Question 7
    { description: "DeFi offers fixed, centrally determined rates", is_correct: false, question_id: 7 },
    { description: "TradFi and DeFi use identical yield structures", is_correct: false, question_id: 7 },
    { description: "TradFi uses staking rewards instead of fixed interest rates", is_correct: false, question_id: 7 },
    { description: "TradFi fixes interest rates, while DeFi offers dynamic, risk-adjusted yields", is_correct: true, question_id: 7 },

    // Question 8
    { description: "They are secretly controlled by financial institutions", is_correct: false, question_id: 8 },
    { description: "They are determined by real market conditions", is_correct: true, question_id: 8 },
    { description: "They are influenced by user activity and decentralized protocols", is_correct: true, question_id: 8 },
    { description: "They are completely risk-free", is_correct: false, question_id: 8 },
];