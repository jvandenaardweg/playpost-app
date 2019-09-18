const user: Api.User = {
  id: 'e7e4c3f7-d681-4bb9-957a-a1cbe046cab0',
  email: 'jordyvandenaardweg@gmail.com',
  authenticatedAt: '2019-09-05T05:16:29.426Z',
  activatedAt: null,
  createdAt: '2019-08-30T07:47:57.106Z',
  updatedAt: '2019-09-05T03:16:29.449Z',
  voiceSettings: [],
  activeUserInAppSubscription: null,
  usedInAppSubscriptionTrials: [
    {
      id: '1ef2de2f-0ad9-4668-aeb8-30ef91821018',
      productId: 'com.aardwegmedia.playpost.premium',
      name: 'Premium',
      description: 'Monthly Premium Subscription',
      price: 4.99,
      currency: 'eur',
      duration: '1m',
      service: 'apple',
      limitSecondsPerMonth: 7200,
      limitSecondsPerArticle: 1800,
      isActive: true,
      upgradeFromId: "e4f10326-4584-4a7e-b833-dd388cb2a41a",
      createdAt: '2019-07-22T03:24:53.236Z',
      updatedAt: '2019-09-04T08:11:56.748Z'
    },
    {
      id: '7e31ec53-b7c0-4795-83ea-98432ac7754b',
      productId: 'com.aardwegmedia.playpost.android.premium',
      name: 'Premium',
      description: 'Monthly Premium Subscription',
      price: 4.99,
      currency: 'eur',
      duration: '1m',
      service: 'google',
      limitSecondsPerMonth: 7200,
      limitSecondsPerArticle: 1800,
      isActive: true,
      upgradeFromId: "e4f10326-4584-4a7e-b833-dd388cb2a41a",
      createdAt: '2019-06-01T08:16:42.873Z',
      updatedAt: '2019-09-04T08:11:56.766Z'
    }
  ],
  hasUsedFreeIntroduction: true,
  used: {
    audiofiles: {
      currentMonthInSeconds: 0
    }
  },
  available: {
    audiofiles: {
      currentMonthInSeconds: 1800
    }
  },
  limits: {
    audiofiles: {
      limitSecondsPerMonth: 1800,
      limitSecondsPerArticle: 1800
    }
  }
}

export default user;
