import { environment } from "@env/environment";
import { CourseSubmodulesList } from "src/app/@Models/course-navigator.model";

export const CourseSubmodules: CourseSubmodulesList[] = [
    {
      id: 1,
      icon: `https://${environment.domain}/uniprepapi/storage/app/public/ToolIcons/education-tools/career-choice.svg`,
      submodule_name: "Career Opportunities & Job Roles"
    },
    {
      id: 2,
      icon: `https://${environment.domain}/uniprepapi/storage/app/public/ToolIcons/education-tools/job-description.svg`,
      submodule_name: "Industry Relevance & Practical Exposure"
    },
    {
      id: 3,
      icon: `https://${environment.domain}/uniprepapi/storage/app/public/ToolIcons/education-tools/skills.svg`,
      submodule_name: "Skills & Compentency Developement"
    },
    {
      id: 4,
      icon: `https://${environment.domain}/uniprepapi/storage/app/public/ToolIcons/education-tools/worldwide.svg`,
      submodule_name: "Global & Regional Career Scope"
    },
    {
      id: 5,
      icon: `https://${environment.domain}/uniprepapi/storage/app/public/ToolIcons/education-tools/return-of-investment.svg`,
      submodule_name: "ROI (Return on Investment) & Financial Aspects"
    },
  ];