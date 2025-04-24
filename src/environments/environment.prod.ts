const dev_domain = 'api.uniprep.ai';
const prod_domain = 'uniprep.ai'
const dev_url = `https://${dev_domain}/uniprepapi/public/api`;
const prod_url = `https://${prod_domain}/uniprepapi/public/api`;
const dev_uniapplyb2c_url = 'http://uniapplyb2c.uniabroad.io/auth/login?redirect=/pages/applications'
const prod_uniapplyb2c_url = 'http://uniapply.ai/auth/login?redirect=/pages/applications'

const dev_uniapply_student = 'http://74.225.142.9/uniapplyStudents/public/api'
const prod_uniapply_student = 'https://apply.uniabroad.io/uniapplyStudents/public/api'
const employerprodUrl = 'https://employer.uniprep.ai/';
const employerdevUrl = 'https://dev-employer.uniprep.ai';

export const environment = {
  domain: dev_domain,
  maintenanceMode: false,
  production: true,
  ApiUrl: dev_url,
  ApiUrlEmployer: dev_url + '/employer',
  employerDomain: employerprodUrl,
  secretKeySalt: 'WaterMelonTea',
  tokenKey: 'token',
  facebookAppId: '892925195633254',
  linkedinId: '86b55xx7n8zomc',
  googleCloud: {
    apiKey: 'AIzaSyCxrgn6ZZL3IsY_3xrSqQJi_3yT_OKr-n0'
  },
  uniApplyUrl: dev_uniapplyb2c_url,
  uniapplyAPI: dev_uniapply_student
};