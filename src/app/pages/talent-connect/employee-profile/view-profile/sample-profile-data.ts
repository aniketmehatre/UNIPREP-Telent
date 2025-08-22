import { environment } from "@env/environment";
import { ProfileData } from "src/app/@Models/employee-connect-view-profile.model";

export const JobResponsibility = `
Design & Development <br>
- Write clean, efficient, and scalable code (commonly in Java, C++, Python, Go, or JavaScript).<br>
- Design and implement features for Google products (e.g., Search, Maps, Ads, Cloud, YouTube, Android).<br>
- Optimize code for performance, reliability, and scalability.<br><br>

System Architecture & Problem-Solving<br>
- Contribute to the design of distributed systems that handle millions of users.<br>
- Identify performance bottlenecks and improve system efficiency.<br>
- Participate in code reviews and ensure adherence to Google’s coding standards.<br><br>

Collaboration & Cross-Functional Work<br>
- Work closely with Product Managers, UX Designers, and Data Scientists to align features with business goals.<br>
- Collaborate with senior engineers to define technical roadmaps.<br>
- Pair programming and mentoring junior engineers/interns occasionally.<br><br>

Testing & Quality Assurance<br>
- Write unit, integration, and end-to-end tests.<br>
- Ensure robust deployment with minimal downtime.<br>
- Debug and fix critical production issues.
`;

export const SampleProfileData: ProfileData = {
    personalInfo: {
        fullName: 'Alex',
        dateOfBirth: '13/07/2000',
        gender: 'Male',
        nationality: 'American',
        location: 'California',
        logo: 'uniprep-assets/images/employer-connect/alex.jpg',
        total_years_of_experience: '3 Years 8 Months',
    },
    educationDetails: [{
        highestQualification: "Master's Degree",
        university: 'Yale University',
        fieldOfStudy: 'UG',
        courseName: 'MS in Computer Science',
        graduationYear: 2022,
        gpa: '8.6 GPA'
    }],
    workExperience: [{
        totalExperience: '3 Year 8 Months',
        companyName: 'Google',
        jobTitle: 'Software developer',
        employmentType: 'Full Time',
        duration: '10-01-2023 - Present',
        salary: '15,600',
        responsibilities: JobResponsibility,
        exp_currency: 'USD',
        experienceLetter: { name: 'ExperienceLetter.pdf', file: 'https://drive.google.com/file/d/1Smi845bV66-Gw-edWOP-ClDmn9X4ELni/view' },
    }],
    careerPreferences: {
        careerStatus: 'Working',
        careerInterest: 'Education Industry, Real Estate',
        department: 'Human Resource (HR)',
        jobTitle: 'Lead Developer',
        preferredWorkLocation: 'New York',
        preferredEmploymentType: 'Full Time',
        preferredWorkplaceType: 'Remote',
        willingToRelocate: 'No',
        salaryRange: '18000',
        currency: 'USD'
    },
    certifications: [
        { name: 'Google Professional Cloud Architect', file: 'https://drive.google.com/file/d/1KETV_D8yGngmVUaJO0djpL-eleMXbQTs/view' }
    ],
    userAchievements: [
        { name: "Employee of the Year", file: 'https://drive.google.com/file/d/15wRM9o3IDSDX4iWv3HSXqaaX1fuYd_vG/view?usp=drive_link' }
    ],
    additionalDetails: {
        languagesKnown: [
            { lang: 'English', prof: 'Native' },
            { lang: 'Spanish', prof: 'Proficient' },
            { lang: 'German', prof: 'Proficient' },
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
        linkedinProfile: 'https://www.linkedin.com/alex',
        socialMedia: [
            // { media: 'Instagram', link: 'https://www.instagram.com/darshu_ruknor?igsh=cGl1NWVrd204ajF5&utm_source=qr' },
            // { media: 'Facebook', link: 'https://www.facebook.com/Darshini' },
            // { media: 'X', link: 'https://twitter.com/Darshini' }
        ],
        personalWebsite: ''
    },
    attachments: [
        { name: 'https://drive.google.com/file/d/15J5Pt-bwSIN4zSJWcyn9OT2KO7-nx4-y/view?usp=drive_link', type: 'document' },
        { name: 'https://youtu.be/tRzt2P1Fm5I', type: 'video' }
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
    additionalInfo: 'Hi, I’m Alex. For the past 3.8 years, I’ve been a Software Developer at Google, where I designed and scaled systems impacting millions of users worldwide. My work earned me the Employee of the Year (2024) award, a recognition of both technical excellence and teamwork. With an MS in Computer Science from Yale and certifications in cloud and system design, I’m eager to bring the same drive, innovation, and impact to your organization.'
}
