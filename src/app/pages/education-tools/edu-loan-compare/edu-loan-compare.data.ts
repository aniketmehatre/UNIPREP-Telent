export const eduloanRecommendations = [
    {
        id: 1,
        heading: 'Loan Details',
        questions: ['What is your total loan amount?', 'What is the interest rate of your loan?', 'What is your loan tenure?', 'What is the duration of your course?']
    },
    {
        id: 2,
        heading: 'Loan Closure Details',
        questions: ['Did your loan have a moratorium (Grace) period?', 'In how many years do you prefer to complete the loan repayment?']
    }
];

export const loanTensureMonths = Array.from({ length: 30 }, (_, i) => {
    const month = (i + 1) * 6;
    return { id: i, value: `${month} Months` };
});

export const courseDuration = Array.from({ length: 10 }, (_, i) => {
    const month = (i + 1) * 6;
    return { id: i, value: `${month} Months` };
});

export const moratoriumPeriods = [
    { id: 1, value: "Course Duration + 6 Months" },
    { id: 2, value: "Course Duration + 1 year" },
    { id: 4, value: "No moratorium" }
];

export const repaymentYears = [
    { id: 1, value: '1 Year' },
    { id: 2, value: '2 Years' },
    { id: 3, value: '3 Years' },
    { id: 4, value: '4 Years' },
    { id: 5, value: '5 Years' },
    { id: 6, value: '6 Years' }
];
