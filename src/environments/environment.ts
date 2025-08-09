const dev_domain = 'api.uniprep.ai'
const prod_domain = 'uniprep.ai'
const local_domain = '127.0.0.1:8000'
const staging_domain = 'staging.uniprep.ai'
const staging_api_domain = 'api-staging.uniprep.ai'
const dev_url = `https://${dev_domain}/uniprepapi/public/api`;
const local_url = `http://${local_domain}/api`;
const prod_url = `https://${prod_domain}/uniprepapi/public/api`;
const staging_api_url = `https://${staging_api_domain}/api`;
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
const prod_job_url = 'https://job.uniprep.ai';

export const environment = {
    domain: prod_domain,
    maintenanceMode: false,
    production: false,
    ApiUrl: prod_url,
    ApiUrlEmployer: prod_url + '/employer',
    employerDomain: prod_employer_url,
    tokenKey: 'token',
    secretKeySalt: 'WaterMelonTea',
    facebookAppId: '892925195633254',
    linkedinId: '86b55xx7n8zomc',
    whatsappSupportNumber: 9876543210,
    partnerDomain: prod_partner,
    instituteDomain: prod_institute,
    talentDomain: prod_talents,
    studentDomain: prod_student,
    jobDomain: prod_job_url,
    googleCloud: {
        apiKey: 'AIzaSyCxrgn6ZZL3IsY_3xrSqQJi_3yT_OKr-n0'
    },
    uniApplyUrl: prod_uni_apply_b2c_url,
    uniapplyAPI: prod_uni_apply_student,
    imagePath: `https://${prod_domain}/uniprepapi/public/storage/`
};