export const environment = {
    production: false,
    baseUrl: 'http://34.87.186.209/api',
    env: 'local',
    redirect: 'http://localhost:4200/dashboard',
    logoutRedirect: 'http://localhost:4200/auth-landing',
    msAdTenant : 'bf048976-7110-4e87-96f3-c6744908b8be',
    msAdClientId : 'ad53bef6-a032-4a84-a3a6-47b1c41bc617',
    ewallet: 'https://test.onlinepayment.SW.com.my/Payment-Testing/DealerPayment',
    origin: 'http://localhost:4200/',
    b2cRedirect: 'https://SWb2c.b2clogin.com/SWb2c.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1A_AADB2C_PROTO2_SIGNIN&client_id=63a6e7a3-c4f7-4aa0-af20-54a0040827ae&nonce=defaultNonce&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fdashboard&scope=openid&response_type=id_token&prompt=login&channelName=PBO&sessionID=1111' ,
    recaptchaSiteKey: '6LfefFodAAAAAC1E-rQEfUaLsTYU8Yq8AaZBK7gV',
    selfPwReset:'https://SWb2c.b2clogin.com/SWb2c.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1A_AADB2C_PROTO2_PWDRESET&client_id=63a6e7a3-c4f7-4aa0-af20-54a0040827ae&nonce=defaultNonce&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fauth-landing&scope=openid&response_type=id_token&prompt=login&channelName=PBO&sessionID=1111'
};
