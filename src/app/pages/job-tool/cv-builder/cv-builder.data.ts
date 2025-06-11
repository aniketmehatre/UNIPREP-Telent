export interface CommonInterface {
    id: string;
    value: string;
}

export const experienceLevel: { id: number, level: string }[] = [
    { id: 1, level: "Fresher" },
    { id: 2, level: "Experience" },
];

export const monthList: { id: string, name: string }[] = [
    { id: "Jan", name: "January" },
    { id: "Feb", name: "February" },
    { id: "Mar", name: "March" },
    { id: "Apr", name: "Apr" },
    { id: "May", name: "May" },
    { id: "Jun", name: "June" },
    { id: "Jul", name: "July" },
    { id: "Aug", name: "August" },
    { id: "Sep", name: "September" },
    { id: "Oct", name: "October" },
    { id: "Nov", name: "November" },
    { id: "Dec", name: "December" },
];

export const cgpaPercentage: CommonInterface[] = [
    { id: "CGPA", value: "CGPA" },
    { id: "%", value: "Percentage" },
];

export const workTypeValue: CommonInterface[] = [
    { id: "Full Time", value: "Full-Time" },
    { id: "Part Time", value: "Part-Time" },
    { id: "Internship", value: "Internship" },
    { id: "Freelancer", value: "Freelancer" },
];
export const languageProficiency: CommonInterface[] = [
    { id: "Beginner", value: "Beginner" },
    { id: "Fluent", value: "Fluent" },
    { id: "Proficient", value: "Proficient" },
    { id: "Native", value: "Native" },
];
export const skillProficiency: CommonInterface[] = [
    { id: "Basic", value: "Basic" },
    { id: "Intermediate", value: "Intermediate" },
    { id: "Advance", value: "Advance" },
];
export const languageLists: { value: string }[] = [
    { value: "Kannada" },
    { value: "German" },
    { value: "Hindi" },
    { value: "Spanish" },
    { value: "French" },
    { value: "Italian" },
    { value: "Arabic" },
    { value: "Polish" },
    { value: "Swedish" },
    { value: "Dutch" },
    { value: "Danish" },
    { value: "Greek" },
    { value: "Portugese" },
    { value: "Chinese" },
    { value: "Korean" },
    { value: "Japanese" },
    { value: "Tamil" },
    { value: "Telugu" },
    { value: "Urdu" },
    { value: "Malyalam" },
    { value: "Russian" },
    { value: "Turkish" },
    { value: "Bengali" },
    { value: "Punjabi" },
    { value: "Marathi" },
    { value: "English" },
];

export const resumeSlider: { id: number, templateName: string, imageLink: string }[] = [
    {
        id: 5,
        templateName: "Creative",
        imageLink: "../../../uniprep-assets/resume-images/Creative.webp",
    },
    {
        id: 2,
        templateName: "Modern",
        imageLink: "../../../uniprep-assets/resume-images/Modern.webp",
    },
    {
        id: 3,
        templateName: "Academic",
        imageLink: "../../../uniprep-assets/resume-images/academic.webp",
    },
    {
        id: 4,
        templateName: "Functional",
        imageLink: "../../../uniprep-assets/resume-images/functional.webp",
    },
    {
        id: 1,
        templateName: "Traditional",
        imageLink: "../../../uniprep-assets/resume-images/Traditional.webp",
    },
    {
        id: 10,
        templateName: "Creative",
        imageLink: "../../../uniprep-assets/resume-images/Creative.webp",
    },
    {
        id: 7,
        templateName: "Modern",
        imageLink: "../../../uniprep-assets/resume-images/Modern.webp",
    },
    {
        id: 8,
        templateName: "Academic",
        imageLink: "../../../uniprep-assets/resume-images/academic.webp",
    },
    {
        id: 9,
        templateName: "Functional",
        imageLink: "../../../uniprep-assets/resume-images/functional.webp",
    },
    {
        id: 6,
        templateName: "Traditional",
        imageLink: "../../../uniprep-assets/resume-images/Traditional.webp",
    },
];


export const coverLetterSliders: any = [
    {
        id: 1,
        templateName: "Traditional",
        imageLink: "./../../../uniprep-assets/coverletter-images/traditional.svg",
    },
    {
        id: 2,
        templateName: "Modern",
        imageLink: "../../../../uniprep-assets/coverletter-images/modern.svg",
    },
    {
        id: 3,
        templateName: "Academic",
        imageLink: "../../../../uniprep-assets/coverletter-images/academic.svg",
    },
    {
        id: 4,
        templateName: "Creative",
        imageLink: "../../../../uniprep-assets/coverletter-images/creative.svg",
    },
    {
        id: 5,
        templateName: "Functional",
        imageLink: "../../../../uniprep-assets/coverletter-images/functional.svg",
    },
    {
        id: 6,
        templateName: "Traditional",
        imageLink: "./../../../uniprep-assets/coverletter-images/traditional.svg",
    },
    {
        id: 7,
        templateName: "Modern",
        imageLink: "../../../../uniprep-assets/coverletter-images/modern.svg",
    },
    {
        id: 8,
        templateName: "Academic",
        imageLink: "../../../../uniprep-assets/coverletter-images/academic.svg",
    },
    {
        id: 9,
        templateName: "Creative",
        imageLink: "../../../../uniprep-assets/coverletter-images/creative.svg",
    },
    {
        id: 10,
        templateName: "Functional",
        imageLink: "../../../../uniprep-assets/coverletter-images/functional.svg",
    },

];


export interface ResumeHistory {
  id: number;
  pdf_name: string;
  created_time: string;
  image_name: string;
}

export interface JobTitle {
  id: number | null; // null for custom job titles
  jobrole: string;
}