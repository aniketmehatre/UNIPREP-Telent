const dev_domain = 'api.uniprep.ai'
const prod_domain = 'uniprep.ai'
const local_domain = '127.0.0.1:8000'
const dev_url = `https://${dev_domain}/uniprepapi/public/api`;
const local_url = `http://${local_domain}/api`;
const prod_url = `https://${prod_domain}/uniprepapi/public/api`;
const dev_uni_apply_b2c_url = 'http://uniapplyb2c.uniabroad.io/auth/login?redirect=/pages/applications'
const prod_uni_apply_b2c_url = 'http://uniapply.ai/auth/login?redirect=/pages/applications'
const dev_uni_apply_student = 'http://74.225.142.9/uniapplyStudents/public/api'
const prod_uni_apply_student = 'https://apply.uniabroad.io/uniapplyStudents/public/api'
const dev_employer_url = 'https://dev-employer.uniprep.ai';
const prod_employer_url = 'https://employer.uniprep.ai';
const dev_student = 'https://dev-student.uniprep.ai';
const prod_student = 'https://uniprep.ai';
const dev_talents = 'https://dev-talent.uniprep.ai';
const prod_talents = 'https://talent.uniprep.ai';
const dev_partner = 'https://dev-partners.uniprep.ai';
const prod_partner = 'https://partners.uniprep.ai';
const dev_institute = 'https://dev-institutes.uniprep.ai';
const prod_institute = 'https://institutes.uniprep.ai';

export const environment = {
    domain: dev_domain,
    maintenanceMode: false,
    production: false,
    ApiUrl: prod_url,
    ApiUrlEmployer: dev_url + '/employer',
    employerDomain: dev_employer_url,
    tokenKey: 'token',
    secretKeySalt: 'WaterMelonTea',
    facebookAppId: '892925195633254',
    linkedinId: '86b55xx7n8zomc',
    whatsappSupportNumber: 9876543210,
    partnerDomain: dev_partner,
    instituteDomain: dev_institute,
    talentDomain: dev_talents,
    studentDomain: dev_student,
    googleCloud: {
        apiKey: 'AIzaSyCxrgn6ZZL3IsY_3xrSqQJi_3yT_OKr-n0'
    },
    uniApplyUrl: dev_uni_apply_b2c_url,
    uniapplyAPI: dev_uni_apply_student,
    imagePath:`https://${dev_domain}/uniprepapi/storage/app/public/`
};