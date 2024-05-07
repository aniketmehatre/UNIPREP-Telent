const devdomain = 'api.uniprep.ai';
const staging='staging.uniprep.ai'
const proddomain='uniprep.ai'
const devurl= `https://${devdomain}/uniprepapi/public/`;
const stagingurl=`https://${staging}/uniprepapi/public/`;
const produrl=`https://${proddomain}/uniprepapi/public/`;

export const environment = {
  domain:devdomain,
  production: false,
  ApiUrl:devurl+'api',
  imageUrl: devurl,
  tokenKey: 'token',
  facebookAppId: '892925195633254',
  linkedinId: '86b55xx7n8zomc'
};