import { environment } from "@env/environment";
let domainUrl = `https://${environment.domain}/uniprepapi/storage/app/public/ToolIcons/education-tools/`;
export interface educationTools {
  title: string
  image: string
  url: string
  launch_soon: boolean
  is_ai: boolean
}

export const EducationToolsData:educationTools[] = [
  {
    title: "Course Navigator",
    image: domainUrl + "CourseNavigator.svg",
    url: "/pages/education-tools/course-navigator",
    launch_soon: false,
    is_ai: false
  },
  {
    title: "Politician Insights",
    //  description: "This tool lets you get a polician insights with the help of few easy steps",
    image: domainUrl + "PoliticalInsights.svg",
    url: "/pages/education-tools/politician-insights",
    launch_soon: false,
    is_ai: false
  },
  {
    title: "Global Study Visa",
    image: domainUrl + "GlobalStudyVisa.svg",
    url: "/pages/education-tools/study-visa",
    launch_soon: false,
    is_ai: false
  },
  {
    title: "Country Insights",
    image: domainUrl + "CountryInsights.svg",
    url: "/pages/education-tools/country-insights",
    launch_soon: false,
    is_ai: false
  },
  {
    title: "Wealth Leaders",
    //  description: "An assessment that evaluates an entrepreneur's in-depth knowledge and proficiency in specific industries.",
    image: domainUrl + "WealthLeaders.svg",
    url: "/pages/education-tools/wealthleaderslist",
    launch_soon: false,
    is_ai: false
  },
  {
    title: "Education ROI",
    // description: "This tool lets you get a global travel visa with the help of few easy steps",
    image: domainUrl + "StudentBudgetPlanner.svg",
    url: "/pages/education-tools/student-budget-planner",
    launch_soon: false,
    is_ai: true
  },
  {
    title: "EDULOAN Repayment Advisor",
    image: domainUrl + "LoanComparisonTool.svg",
    url: "/pages/education-tools/edu-loan-compare",
    launch_soon: false,
    is_ai: true
  },
  {
    title: "UNICOMPARE",
    image: domainUrl + "Unicompare.svg",
    url: "/pages/education-tools/uni-compare",
    launch_soon: false,
    is_ai: true
  },
  {
    title: "Global Edufit",
    // description: "This tool lets you get a global travel visa with the help of few easy steps",
    image: domainUrl + "GlobalEdufit.svg",
    url: "/pages/education-tools/global-edufit",
    launch_soon: false,
    is_ai: true
  }
]