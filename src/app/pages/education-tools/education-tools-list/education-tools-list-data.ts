import { environment } from "@env/environment";
let domainUrl = `https://${environment.domain}/uniprepapi/storage/app/public/ToolIcons/education-tools/`;
export const EducationToolsData = [
    {
        title: "Course Navigator",
      //  description: "This tool lets you get a global travel visa with the help of few easy steps",
        image: domainUrl+"CourseNavigator.svg",
        url: "/pages/education-tools/course-navigator",
        launch_soon: true,
    },
    {
        title: "Politician Insights",
      //  description: "This tool lets you get a polician insights with the help of few easy steps",
      image: domainUrl+"PoliticalInsights.svg",
        url: "/pages/education-tools/politician-insights",
        launch_soon: true,
    },
    {
        title: "Global Study Visa",
      //  description: "This tool lets you get a global travel visa with the help of few easy steps",
      image: domainUrl+"GlobalStudyVisa.svg",
        url: "/pages/education-tools/study-visa",
        launch_soon: true,
    },
    {
        title: "Country Insights",
      //  description: "This tool lets you get a global travel visa with the help of few easy steps",
      image: domainUrl+"CountryInsights.svg",
        url: "/pages/education-tools/country-insights",
        launch_soon: true,
    },
    {
        title: "Wealth Leaders",
      //  description: "An assessment that evaluates an entrepreneur's in-depth knowledge and proficiency in specific industries.",
      image: domainUrl+"WealthLeaders.svg",
        url: "/pages/education-tools/wealthleaderslist",
        launch_soon: false,
    },
    {
        title: "Student Budget Planner",
       // description: "This tool lets you get a global travel visa with the help of few easy steps",
       image: domainUrl+"StudentBudgetPlanner.svg",
        url: "/pages/education-tools/student-budget-planner",
        launch_soon: true,
    },
    {
        title: "UniCompare",
      //  description: "This tool lets you get a global travel visa with the help of few easy steps",
      image: domainUrl+"Unicompare.svg",
        url: "/pages/education-tools/uni-compare",
        launch_soon: false,
    },
    {
        title: "Global Edufit",
       // description: "This tool lets you get a global travel visa with the help of few easy steps",
       image: domainUrl+"GlobalEdufit.svg",
        url: "/pages/education-tools/global-edufit",
        launch_soon: false,
    },
    {
        title: "Loan Comparison Tool",
      //  description: "This tool lets you get a global travel visa with the help of few easy steps",
      image: domainUrl+"LoanComparisonTool.svg",
        url: "/pages/education-tools/edu-loan-compare",
        launch_soon: true,
    },
    
]