const devdomain = 'api.uniprep.ai';
const staging='staging.uniprep.ai'
const proddomain='`uniprep.ai`'
const devurl= `https://${devdomain}/uniprepapi/public/api`;
const stagingurl=`https://${staging}/uniprepapi/public/api`;
const produrl=`https://${proddomain}/uniprepapi/public/api`;
export const environment = {
  domain:devdomain,
  production: false,
  ApiUrl:devurl,
  tokenKey: 'token',
  facebookAppId: '892925195633254',
  linkedinId: '86b55xx7n8zomc',
  googleCloud: {
    apiKey: 'AIzaSyCxrgn6ZZL3IsY_3xrSqQJi_3yT_OKr-n0'
  }
};