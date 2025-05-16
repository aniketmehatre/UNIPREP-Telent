export const FavouriteList:FeatureFavourite[] = [
    {
        "id": 1,
        "moduleName": "CV Builder",
        "Description": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
        "tooltip": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
        "imageLink": "https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/CV.png",
        "mode": "cv-builder",
        "url": "/pages/job-tool/cv-builder",
        "module": "Career Tools"
    },
    {
        "id": 2,
        "moduleName": "Learning Hub",
        "Description": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
        "tooltip": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
        "imageLink": "https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/LearningHub.svg",
        "mode": "cv-builder",
        "url": "/pages/modules/learning-hub",
        "module": ""
    },
    // {
    // 	"id": 3,
    // 	"moduleName": "Job Portal",
    // 	"Description": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
    // 	"tooltip": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
    // 	"imageLink": "https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/JobPortal.svg",
    // 	"mode": "cv-builder",
    // 	"url": "/pages/job-portal/job-search",
    // 	"module":""
    // },
    {
        "id": 4,
        "moduleName": "Career Planner",
        "Description": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
        "tooltip": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
        "imageLink": "https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/CareerPlanner.svg",
        "mode": "cv-builder",
        "url": "/pages/job-tool/careerplannercountrywise",
        "module": "Career Tools"
    },
    {
        "id": 5,
        "moduleName": "Employer Test",
        "Description": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
        "tooltip": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
        "imageLink": "https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/EmployerTest.svg",
        "mode": "cv-builder",
        "url": "/pages/job-tool/list/employer-test/13",
        "module": ""
    },
    {
        "id": 6,
        "moduleName": "Pitch Deck",
        "Description": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
        "tooltip": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
        "imageLink": "https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/Pitchdeck.svg",
        "mode": "cv-builder",
        "url": "/pages/pitch-deck",
        "module": ""
    },
    {
        "id": 7,
        "moduleName": "UNILEARN",
        "Description": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
        "tooltip": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
        "imageLink": "https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/UNILEARN.svg",
        "mode": "cv-builder",
        "url": "/pages/unilearn/modules",
        "module": ""
    },
    {
        "id": 8,
        "moduleName": "UNIFINDER",
        "Description": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
        "tooltip": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
        "imageLink": "https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/UNIFINDER.svg",
        "mode": "cv-builder",
        "url": "/pages/course-list",
        "module": ""
    },
    {
        "id": 9,
        "moduleName": "UNISCHOLAR",
        "Description": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
        "tooltip": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
        "imageLink": "https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/UNISCHOLAR.svg",
        "mode": "cv-builder",
        "url": "/pages/scholarship-list",
        "module": ""
    },
    {
        "id": 10,
        "moduleName": "Global Repository",
        "Description": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
        "tooltip": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
        "imageLink": "https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/GlobalRepository.svg",
        "mode": "cv-builder",
        "url": "/pages/global-repo",
        "module": ""
    },
    {
        "id": 11,
        "moduleName": "AI Global Advisor",
        "Description": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
        "tooltip": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
        "imageLink": "https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/AI Business Advisor.svg",
        "mode": "cv-builder",
        "url": "/pages/advisor",
        "module": ""
    },
    {
        "id": 12,
        "moduleName": "Language Hub",
        "Description": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
        "tooltip": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
        "imageLink": "https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/LanguageHub.svg",
        "mode": "cv-builder",
        "url": "/pages/language-hub/languages",
        "module": ""
    }
]


export interface FeatureFavourite {
    id: number
    moduleName: string
    Description: string
    tooltip: string
    imageLink: string
    mode: string
    url: string
    module: string
}