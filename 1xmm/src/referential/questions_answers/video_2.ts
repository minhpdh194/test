export const questionList2 = [
    {
        description: "What happens to an asset&apos;s price when market participants favor it?",
        type: "single_choice"
    },
    {
        description: "What are the characteristics of a long position?",
        type: "multiple_choice"
    },
    {
        description: "What should investors do before opening a position?",
        type: "single_choice"
    },
    {
        description: "What are some key aspects of a short position?",
        type: "multiple_choice"
    },
    {
        description: "When does an investor realize a profit or loss?",
        type: "single_choice"
    },
    {
        description: "What are key differences between 1XMM pools and traditional outright positions?",
        type: "multiple_choice"
    }
];

export const answerList2 = [
    // Question 1
    { description: "The price decreases", is_correct: false, question_id: 1 },
    { description: "The price remains constant", is_correct: false, question_id: 1 },
    { description: "The price increases", is_correct: true, question_id: 1 },
    { description: "The asset gets delisted", is_correct: false, question_id: 1 },
    
    // Question 2
    { description: "It is opened when we expect the asset's value to rise", is_correct: true, question_id: 2 },
    { description: "The investor profits if the price increases", is_correct: true, question_id: 2 },
    { description: "It is the same as a short position", is_correct: false, question_id: 2 },
    { description: "The investor profits if the price drop", is_correct: false, question_id: 2 },

    // Question 3
    { description: "Randomly buy or sell assets", is_correct: false, question_id: 3 },
    { description: "Analyze market conditions", is_correct: true, question_id: 3 },
    { description: "Follow social media trends without research", is_correct: false, question_id: 3 },
    { description: "Open both long and short positions at the same time", is_correct: false, question_id: 3 },

    // Question 4
    { description: "The investor profits if the asset&apos;s price drops", is_correct: true, question_id: 4 },
    { description: "The investor profits if the asset&apos;s price increases", is_correct: false, question_id: 4 },
    { description: "Shorting an asset is risk-free", is_correct: false, question_id: 4 },
    { description: "It is opened when we expect the asset&apos;s price to decline", is_correct: true, question_id: 4 },

    // Question 5
    { description: "When they monitor their unrealized profit/loss", is_correct: false, question_id: 5 },
    { description: "As soon as the price moves in their favor", is_correct: false, question_id: 5 },
    { description: "Only when they close their position", is_correct: true, question_id: 5 },
    { description: "When they open a position", is_correct: false, question_id: 5 },

    // Question 6
    { description: "1XMM pools operate based on asset performance", is_correct: true, question_id: 6 },
    { description: "Traditional outright positions rely on the direct asset price", is_correct: true, question_id: 6 },
    { description: "1XMM pools guarantee profits without risk", is_correct: false, question_id: 6 },
    { description: "User returns in 1XMM pools are calculated on price dynamics", is_correct: true, question_id: 6 },
];