import RNIap from 'react-native-iap';

const purchases: RNIap.SubscriptionPurchase[] = [
    {
      autoRenewingAndroid: true,
      dataAndroid: '{"orderId":"GPA.3373-3758-4797-38496","packageName":"com.aardwegmedia.playpost","productId":"com.aardwegmedia.playpost.android.premium","purchaseTime":1567360160183,"purchaseState":0,"purchaseToken":"pidfahlmgkeoggdkdmhcfidp.AO-J1OwO9af3Q67nqsvJ4pT0LcXVuf1xkP1Rc0jfT8SF54ySlPJbhs6EPBKRbZCr9XdwxcjTmyWSa1-pIBSql8tshD4wphks95tFabVjYggyINbRiwh0_xgv57DBa8ecD4zHgeZGymLvO2nHKxhmZ8Dcjh9Z6vP7kU1Z_UXinCTllB0QLwUFSvA","autoRenewing":true,"acknowledged":false}',
      productId: "com.aardwegmedia.playpost.android.premium",
      purchaseStateAndroid: 1,
      purchaseToken: "pidfahlmgkeoggdkdmhcfidp.AO-J1OwO9af3Q67nqsvJ4pT0LcXVuf1xkP1Rc0jfT8SF54ySlPJbhs6EPBKRbZCr9XdwxcjTmyWSa1-pIBSql8tshD4wphks95tFabVjYggyINbRiwh0_xgv57DBa8ecD4zHgeZGymLvO2nHKxhmZ8Dcjh9Z6vP7kU1Z_UXinCTllB0QLwUFSvA",
      signatureAndroid: "UaEtDRpk4Ww5D0V8Nzar1h8Mki2G4KTVcJhF128LaTRBd644yMfNk6uSJi6q9YanXR2fEEt2zE7Ey7YT26xYntnZg2cNAoD3XTAmnHgoymPrfmsNbXO+VDT3awK5pmzpPWrUVUkGlTledpUaJ1u9K43mWC3KvV6mGGhMm8r+Y9oSgtzYK92IyxHvEt6el9r9gAxFmxrv6N5lucvgGDERk93DyDHNwYngUyy4NHFyMmEI6Y08GgWGX3l8+4HniA0vewbjt4QMhJV+EQ2VlDm6G4J2bKRzNmA4gMfiNWGSDmdRh6PDNoFrrI8cOd4kFWxjkmH9Cfu9dNkqO3nPRkW4Gg==",
      transactionDate: "1567360160183",
      transactionId: "GPA.3373-3758-4797-38496",
      transactionReceipt: '{"orderId":"GPA.3373-3758-4797-38496","packageName":"com.aardwegmedia.playpost","productId":"com.aardwegmedia.playpost.android.premium","purchaseTime":1567360160183,"purchaseState":0,"purchaseToken":"pidfahlmgkeoggdkdmhcfidp.AO-J1OwO9af3Q67nqsvJ4pT0LcXVuf1xkP1Rc0jfT8SF54ySlPJbhs6EPBKRbZCr9XdwxcjTmyWSa1-pIBSql8tshD4wphks95tFabVjYggyINbRiwh0_xgv57DBa8ecD4zHgeZGymLvO2nHKxhmZ8Dcjh9Z6vP7kU1Z_UXinCTllB0QLwUFSvA","autoRenewing":true,"acknowledged":false}'
    }
]

export default purchases;
