import { Platform } from 'react-native'

export const mockPlatform = (platform: string) => {
  Object.defineProperty(Platform, 'OS', {
    get: jest.fn(() => platform)
  })
}
