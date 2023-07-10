// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
 // serviceWorkerScript: 'sw-sync.js',
  firebase: {
    apiKey: 'AIzaSyA82jMk8_IIzUwtS8yAWXb6lHSGpAusvwE',
    authDomain: 'centrenews-dfc60.firebaseapp.com',
    databaseURL: 'https://centrenews-dfc60.firebaseio.com',
    projectId: 'centrenews-dfc60',
    storageBucket: 'centrenews-dfc60.appspot.com',
    messagingSenderId: '608473106039'
  }
};
export const globals = {
  url: 'http://localhost' // '35.204.190.149'
};
