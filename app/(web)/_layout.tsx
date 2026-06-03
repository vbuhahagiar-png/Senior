import { Stack } from 'expo-router'
import { couleurs } from '@/lib/theme'

export default function WebLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: couleurs.fond },
      }}
    />
  )
}
