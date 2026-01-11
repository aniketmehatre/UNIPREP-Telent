const dev_domain = "api.uniprep.ai";
const dev_url = `https://${dev_domain}/uniprepapi/public/api`;
const dev_uni_apply_b2c_url =
  "http://uniapplyb2c.uniabroad.io/auth/login?redirect=/pages/applications";
const dev_uni_apply_student = "http://74.225.142.9/uniapplyStudents/public/api";
const dev_employer_url = "https://dev-employer.uniprep.ai";
const dev_student = "https://dev-student.uniprep.ai";
const dev_talents = "https://dev-talent.uniprep.ai";
const dev_partner = "https://dev-partners.uniprep.ai";
const dev_institute = "https://dev-institutes.uniprep.ai";
const job_url = "https://job.uniprep.ai";

export const environment = {
  domain: dev_domain,
  maintenanceMode: false,
  production: false,
  ApiUrl: dev_url,
  ApiUrlEmployer: dev_url + "/employer",
  employerDomain: dev_employer_url,
  tokenKey: "token",
  secretKeySalt: "WaterMelonTea",
  facebookAppId: "892925195633254",
  linkedinId: "86b55xx7n8zomc",
  whatsappSupportNumber: 9876543210,
  partnerDomain: dev_partner,
  instituteDomain: dev_institute,
  talentDomain: dev_talents,
  studentDomain: dev_student,
  jobDomain: job_url,
  googleCloud: {
    apiKey: "AIzaSyCxrgn6ZZL3IsY_3xrSqQJi_3yT_OKr-n0",
  },
  uniApplyUrl: dev_uni_apply_b2c_url,
  uniapplyAPI: dev_uni_apply_student,
  imagePath: `https://${dev_domain}/uniprepapi/storage/app/public/`,
  adzuna: {
    apiUrl: "https://api.adzuna.com/v1/api/jobs",
    appId: "53dd2d27",
    appKey: "e27fbcbe3d392dd2f84896a0dde45680",
  },
};
