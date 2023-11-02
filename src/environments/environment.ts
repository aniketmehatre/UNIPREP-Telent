// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// const domain = '40.80.95.32';
// const url= `http://${domain}/sopapi/public/api`;
// const domain = '20.235.29.36';
const domain = '40.80.95.32';
const url= `http://${domain}/uniprepapi/public/api`;
// const url='https://uniprep.ai/uniprepapi/public/api'
export const environment = {
  domain,
  production: false,
  ApiUrl:url,
  tokenKey: 'token',
};