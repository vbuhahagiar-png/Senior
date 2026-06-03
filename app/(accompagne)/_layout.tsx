import React from 'react'
import { Tabs } from 'expo-router'
import { LayoutDashboard, Users, Bell, Settings } from 'lucide-react-native'
import { couleurs } from '@/lib/theme'
import { Platform } from 'react-native'

export default function AccompagneLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: couleurs.accent,
        tabBarInactiveTintColor: couleurs.ardoiseLighter,
        tabBarStyle: {
          backgroundColor: couleurs.blanc,
          borderTopColor: couleurs.bordure,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Nunito-SemiBold',
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Tableau de bord',
          tabBarIcon: ({ focused, size }) => (
            <LayoutDashboard
              size={size ?? 26}
              color={focused ? couleurs.accent : couleurs.ardoiseLighter}
              strokeWidth={focused ? 2.5 : 1.8}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="circle"
        options={{
          title: 'Cercle',
          tabBarIcon: ({ focused, size }) => (
            <Users
              size={size ?? 26}
              color={focused ? couleurs.accent : couleurs.ardoiseLighter}
              strokeWidth={focused ? 2.5 : 1.8}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alertes',
          tabBarIcon: ({ focused, size }) => (
            <Bell
              size={size ?? 26}
              color={focused ? couleurs.accent : couleurs.ardoiseLighter}
              strokeWidth={focused ? 2.5 : 1.8}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Réglages',
          tabBarIcon: ({ focused, size }) => (
            <Settings
              size={size ?? 26}
              color={focused ? couleurs.accent : couleurs.ardoiseLighter}
              strokeWidth={focused ? 2.5 : 1.8}
            />
          ),
        }}
      />
      <Tabs.Screen name="activities" options={{ href: null }} />
      <Tabs.Screen name="letters" options={{ href: null }} />
    </Tabs>
  )
}
