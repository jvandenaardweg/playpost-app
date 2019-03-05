describe('Onboarding', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should tap the button', async () => {
    await element(by.traits(['button'])).tap();
  });


});
