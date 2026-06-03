import { Stack } from 'expo-router'
import { couleurs } from '@/lib/theme'

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: couleurs.fond },
        animation: 'slide_from_right',
      }}
    />
  )
}
