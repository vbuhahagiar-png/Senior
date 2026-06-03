import React from 'react'
import { Tabs } from 'expo-router'
import { Home, Calendar, Users, Settings, MessageCircle } from 'lucide-react-native'
import { couleurs } from '@/lib/theme'
import { Platform } from 'react-native'

function IconeOnglet({ icone: Icone, focused, size }: { icone: any; focused: boolean; size?: number }) {
  return (
    <Icone
      size={size ?? 26}
      color={focused ? couleurs.primaire : couleurs.ardoiseLighter}
      strokeWidth={focused ? 2.5 : 1.8}
    />
  )
}

export default function ProfiteLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: couleurs.primaire,
        tabBarInactiveTintColor: couleurs.ardoiseLighter,
        tabBarStyle: {
          backgroundColor: couleurs.blanc,
          borderTopColor: couleurs.bordure,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Nunito-SemiBold',
          fontSize: 12,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ focused }) => <IconeOnglet icone={Home} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="activities"
        options={{
          title: 'Activités',
          tabBarIcon: ({ focused }) => <IconeOnglet icone={Calendar} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="circle"
        options={{
          title: 'Famille',
          tabBarIcon: ({ focused }) => <IconeOnglet icone={Users} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="companion"
        options={{
          title: 'Compagnon',
          tabBarIcon: ({ focused }) => <IconeOnglet icone={MessageCircle} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Réglages',
          tabBarIcon: ({ focused }) => <IconeOnglet icone={Settings} focused={focused} />,
        }}
      />
      <Tabs.Screen name="letters" options={{ href: null }} />
    </Tabs>
  )
}
