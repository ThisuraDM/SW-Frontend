'use strict';

export let baseUrl = '';
export let azureB2c = '';
export let azureAd = '';
export let redirectUrl = '';

export function setBaseUrl(val: string) {
    baseUrl = val;
}
export function setAzureB2c(val: string) {
    azureB2c = val;
}
export function setAzureAd(val: string) {
    azureAd = val;
}
export function setRedirectUrl(val: string) {
    redirectUrl = val;
}

export function getBaseUrl() {
    return baseUrl;
}
export function getAzureB2c() {
    return azureB2c;
}
export function getAzureAd() {
    return azureAd;
}
export function getRedirectUrl() {
    return redirectUrl;
}
