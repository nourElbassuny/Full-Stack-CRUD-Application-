import { OktaAuthOptions } from '@okta/okta-auth-js';

export default {
  oidc: {
    clientId: '0oao3fvrwdX8b3TBs5d7',
    issuer: 'https://dev-98972006.okta.com/oauth2/default',
    redirectUri: 'http://localhost:4200/login/callback',
    scopes: ['openid', 'profile', 'email'],
  }
};
