const devdomain = 'api.uniprep.ai';
const proddomain='uniprep.ai'
const devurl= `https://${devdomain}/uniprepapi/public/api`;
const produrl=`https://${proddomain}/uniprepapi/public/api`;
const devUniApplyURL = 'http://uniapplyb2c.uniabroad.io/auth/login?redirect=/pages/applications'
const prodUniApplyUrl = 'http://uniapply.ai/auth/login?redirect=/pages/applications'

const devUniApplyApi = 'http://74.225.142.9/uniapplyStudents/public/api'
const prodUniApplyApi = 'https://apply.uniabroad.io/uniapplyStudents/public/api'
export const environment = {
  domain: devdomain,
  maintenanceMode: false,
  production: true,
  ApiUrl: devurl,
  tokenKey: 'token',
  facebookAppId: '892925195633254',
  linkedinId: '86b55xx7n8zomc',
  googleCloud: {
    apiKey: 'AIzaSyCxrgn6ZZL3IsY_3xrSqQJi_3yT_OKr-n0'
  },
  uniApplyUrl: devUniApplyURL,
  uniapplyAPI: devUniApplyApi
};