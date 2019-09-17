// v1/me
const user: Api.User = {
  id: 'e7e4c3f7-d681-4bb9-957a-a1cbe046cab0',
  email: 'jordyvandenaardweg@gmail.com',
  authenticatedAt: '2019-09-03T20:05:40.142Z',
  activatedAt: null,
  createdAt: '2019-08-30T07:47:57.106Z',
  updatedAt: '2019-09-03T18:05:40.168Z',
  voiceSettings: [],
  activeUserInAppSubscription: null,
  usedInAppSubscriptionTrials: [],
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
