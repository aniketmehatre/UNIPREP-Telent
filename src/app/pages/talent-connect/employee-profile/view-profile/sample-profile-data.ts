import { environment } from "@env/environment";
import { ProfileData } from "src/app/@Models/employee-connect-view-profile.model";

export const JobResponsibility = `Led recruitment and payroll activities for 80-85 employees.
Managed intern coordination, asset tracking, timesheets, and accommodation logistics.
Initiated and executed employee engagement programs.
Oversaw project tasks, including data validation, verification, and retrieval for seamless execution.
Managed schedule coordination for senior team members, ensuring timely meetings and travel arrangements.
Prepared and maintained internal reports on recruitment and project progress for leadership review.
Acted as a point of contact between departments and external stakeholders, streamlining communication.
Provided administrative support to senior management, maintaining confidential records and handling correspondence.
Coordinated calendars, meetings, and travel logistics for the team, ensuring efficient operations.
`;

export const SampleProfileData: ProfileData = {
    personalInfo: {
        fullName: 'Darshini',
        dateOfBirth: '30/01/2003',
        gender: 'Female',
        nationality: 'Indian',
        location: 'Mysore',
        logo: 'uniprep-assets/images/employer-connect/darshini.jpg',
        total_years_of_experience: '2 Years 5 Months',
    },
    educationDetails: [{
        highestQualification: 'BBA',
        university: 'MICA College',
        fieldOfStudy: 'UG',
        courseName: 'BBA IN Human Resource Management ',
        graduationYear: 2022,
        gpa: '8.6 GPA'
    }],
    workExperience: [{
        totalExperience: '1 Year 5 Months',
        companyName: 'UNIABROAD Technology Pvt Ltd',
        jobTitle: 'Recruitment Specialist',
        employmentType: 'Full Time',
        duration: '10-01-2023 - Currently Employed',
        salary: '45000',
        responsibilities: JobResponsibility,
        exp_currency: 'INR',
        experienceLetter: { name: 'ExperienceLetter.pdf', file: environment.imagePath + 'sample/Darshini_Experience_Certificate.pdf ' },
    }],
    careerPreferences: {
        careerStatus: 'Working',
        careerInterest: 'Education Industry, Real Estate',
        department: 'Human Resource (HR)',
        jobTitle: 'Human Resource',
        preferredWorkLocation: 'Bangalore - Mysore',
        preferredEmploymentType: 'Full Time',
        preferredWorkplaceType: 'Onsite',
        willingToRelocate: 'Yes',
        salaryRange: '55000',
        currency: 'INR'
    },
    certifications: [
        { name: 'Talent Acquisition and Recruitment in Human Resource Management', file: 'https://drive.google.com/file/d/1YDdn-B_THfbJ0NKLRP6i1nVLXNzbWpSW/view' }
    ],
    userAchievements: [
        { name: "Awarded HR Team's Best Performer of the Month", file: 'https://drive.google.com/file/d/1sZLWDD0QFAyUnZK6yM-lBUkmvufnWe6M/view?usp=drive_link' }
    ],
    additionalDetails: {
        languagesKnown: [
            { lang: 'English', prof: 'Fluent' },
            { lang: 'Kannada', prof: 'Proficient' },
            { lang: 'Hindi', prof: 'Fluent' },
            { lang: 'Marathi ', prof: 'Proficient' },
        ],
        hobbiesAndInterests: 'Reading, Traveling, Fitness and yoga, Exploring new cuisines, Volunteering for social causes',
        softSkills: ['Strong communication skills', 'Active listening', 'Conflict resolution', 'Empathy and compassion', 'Adaptability to change', 'Problem-solving ability', 'Ethical decision-making', 'Team collaboration', 'Effective time management', 'High emotional intelligence'],
    },
    keyStrengths: {
        industryDifferentiators: 'Strong interpersonal skills that build trust and rapport across all levels of the organization. Ability to handle sensitive matters with discretion and professionalism. A proactive approach to employee engagement and workplace culture. Balanced mindset between employee advocacy and organizational goals. Skilled in conflict resolution and fostering a positive work environment. Continuous learner who stays updated with HR trends and compliance. Empathetic listener with a solution-oriented approach',
        topProfessionalStrength: 'Excellent communication and interpersonal skills,Strong organizational and time management abilities,Conflict resolution and problem-solving expertise,High emotional intelligence and empathy,Confidentiality and ethical decision-making,Adaptability to dynamic work environments,Team leadership and collaboration,Strategic thinking and planning,Talent acquisition and retention skills,Commitment to continuous improvement and learning',
        solvedRealWorldChallenge: 'Yes',
        leadershipRoles: 'Yes',
        mostAdmiredQuality: 'Ability to stay calm and composed under pressure'
    },
    networking: {
        linkedinProfile: 'https://www.linkedin.com/in/darshini-p-ruknor-a09b49223/',
        socialMedia: [{ media: 'Instagram', link: 'https://www.instagram.com/darshu_ruknor?igsh=cGl1NWVrd204ajF5&utm_source=qr' },
        { media: 'Facebook', link: 'https://www.facebook.com/Darshini' },
        { media: 'X', link: 'https://twitter.com/Darshini' }
        ],
        personalWebsite: 'https://www.darshini-portfolio.com'
    },
    attachments: [
        { name: 'https://drive.google.com/file/d/1ISjq6bYNWCFTKjRhStrgdpN6J5ZnSxIi/view?usp=drive_link', type: 'document' },
        { name: 'https://drive.google.com/file/d/1hIV_NnPxa7xnXsXbwKB0y6k9PCng6EP7/view', type: 'video' }
    ],
    academicReference: [{
        collegeName: 'MICA College',
        name: 'Anitha KR',
        designation: 'Professor',
        email: 'Anitha@micacollege.com'
    }],
    professionalReference: [{
        companyName: 'UNIABROAD Technology Pvt Ltd',
        name: 'Kalyani',
        designation: 'HR Manager',
        email: 'Kalyani.hr@uniabraod.co.in'
    }],
    additionalInfo: 'Some Content'
}
