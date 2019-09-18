const subscriptionValidationResult: Api.ReceiptValidationResponseApple = {
  id: 'e3901c8f-5a61-46bb-bebf-e7ed9f936922',
  startedAt: '2019-06-10T18:50:08.000Z',
  expiresAt: '2019-06-10T18:56:06.000Z',
  latestTransactionId: '1000000535687698',
  originalTransactionId: '1000000531243136',
  latestReceipt: '[REDACTED]',
  hadTrial: null,
  isTrial: false,
  isCanceled: false,
  isExpired: false,
  status: 'active',
  environment: 'Sandbox',
  renewedAt: '2019-06-10T18:51:06.000Z',
  canceledAt: null,
  createdAt: '2019-06-01T08:19:58.217Z',
  updatedAt: '2019-06-11T12:21:21.406Z',
  inAppSubscription: {
    id: '7e31ec53-b7c0-4795-83ea-98432ac7754b',
    productId: 'com.aardwegmedia.playpost.premium',
    name: 'Premium',
    description: 'Monthly Premium Subscription',
    price: 4.99,
    currency: 'eur',
    duration: '1m',
    service: 'apple',
    limitSecondsPerMonth: 7200,
    limitSecondsPerArticle: 900,
    isActive: true,
    upgradeFromId: "e4f10326-4584-4a7e-b833-dd388cb2a41a",
    createdAt: '2019-06-01T08:16:42.873Z',
    updatedAt: '2019-07-02T05:32:35.020Z'
  }
};

export default subscriptionValidationResult;
