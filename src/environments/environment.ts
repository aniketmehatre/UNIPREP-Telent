const devdomain = '40.80.95.32';
const proddomain='uniprep.ai'
const devurl= `http://${devdomain}/uniprepapi/public/api`;
const produrl=`https://${proddomain}/uniprepapi/public/api`;

export const environment = {
  domain: devdomain,
  production: false,
  ApiUrl: devurl,
  tokenKey: 'token',
};