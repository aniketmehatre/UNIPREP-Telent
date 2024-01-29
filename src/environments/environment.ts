const devdomain = 'api.uniprep.ai';
const proddomain='uniprep.ai'
const devurl= `https://${devdomain}/uniprepapi/public/api`;
const produrl=`https://${proddomain}/uniprepapi/public/api`;

export const environment = {
  domain:proddomain,
  production: false,
  ApiUrl:produrl,
  tokenKey: 'token',
};