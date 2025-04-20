import { environment } from "@env/environment";
let domainUrl = `https://${environment.domain}/uniprepapi/storage/app/public/ToolIcons/education-tools/`;
export interface educationTools {
  title: string
  image: string
  url: string
  launch_soon: boolean
  is_ai: boolean
}

export const EducationToolsData: educationTools[] = [
  {
    title: "Course Navigator",
    image: domainUrl + "CourseNavigator.svg",
    url: "/pages/education-tools/course-navigator",
    launch_soon: false,
    is_ai: false
  },
  {
    title: "Politician Insights",
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
    image: domainUrl + "WealthLeaders.svg",
    url: "/pages/education-tools/wealthleaderslist",
    launch_soon: false,
    is_ai: false
  },
  {
    title: "Education ROI",
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
    image: domainUrl + "GlobalEdufit.svg",
    url: "/pages/education-tools/global-edufit",
    launch_soon: false,
    is_ai: true,
  },
  {
    title: "Video Mock Interview – University",
    image: domainUrl + "videomockinterviewuniversity.svg",
    url: "/pages/education-tools/scholarship-finder",
    launch_soon: true,
    is_ai: false,
  },
  {
    title: "UNIPAY",
    image: domainUrl + "UNIPAY.svg",
    url: "/pages/education-tools/scholarship-finder",
    launch_soon: true,
    is_ai: false,
  },
  {
    title: "SOP Expert",
    image: domainUrl + "sopexpert.svg",
    url: "/pages/education-tools/scholarship-finder",
    launch_soon: true,
    is_ai: false,
  }
]