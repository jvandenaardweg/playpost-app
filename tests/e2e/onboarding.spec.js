
// import { expect, device, element, by } from 'detox';

// describe('Onboarding', () => {
//   beforeEach(async () => {
//     await device.reloadReactNative();
//   });

//   it('should show the onboarding screen', async () => {
//     await expect(element(by.id('onboarding-screen'))).toBeVisible();
//   });

//   it('should go to the signup screen when tapping the signup button', async () => {
//     await element(by.id('onboarding-button-signup')).tap();
//     await expect(element(by.id('signup-form'))).toBeVisible();
//   });

//   it('should close the signup screen when tapping the close button', async () => {
//     await element(by.id('onboarding-button-signup')).tap();
//     await expect(element(by.id('signup-form'))).toBeVisible();
//     await element(by.id('button-close')).tap();
//     await expect(element(by.id('signup-form'))).toBeNotVisible();
//   });

//   it('should go to the login screen when tapping the login button', async () => {
//     await element(by.id('onboarding-button-login')).tap();
//     await expect(element(by.id('login-form'))).toBeVisible();
//   });

//   it('should close the login screen when tapping the close button', async () => {
//     await element(by.id('onboarding-button-login')).tap();
//     await expect(element(by.id('login-form'))).toBeVisible();
//     await element(by.id('button-close')).tap();
//     await expect(element(by.id('login-form'))).toBeNotVisible();
//   });
// });
