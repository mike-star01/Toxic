import React, { createContext, useContext, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Situationship, AppContextType } from './types';

import GraveyardScreen from './screens/GraveyardScreen';
import AddGraveScreen from './screens/AddGraveScreen';
import SettingsScreen from './screens/SettingsScreen';
import StatsScreen from './screens/StatsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Mock data for demonstration
const mockSituationships: Situationship[] = [
  {
    id: '1',
    name: 'Gym Rat',
    causeOfDeath: 'ghosted',
    dateStarted: new Date('2024-01-15'),
    dateEnded: new Date('2024-02-01'),
    emotionalLog: {
      metInPerson: true,
      numberOfDates: 3,
      kissed: true,
      hookedUp: false,
      fellInLove: false,
      fought: false,
      talkedForWeeks: 2,
      wasExclusive: false,
      summary: 'He was really into fitness but not into me 😅',
    },
    reviveCount: 0,
    isRevived: false,
    epitaph: 'Here lies the man who said he was "too busy" to text back',
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '2',
    name: 'Tinder Tom',
    causeOfDeath: 'breadcrumbed',
    dateStarted: new Date('2024-01-01'),
    dateEnded: new Date('2024-01-20'),
    emotionalLog: {
      metInPerson: false,
      numberOfDates: 0,
      kissed: false,
      hookedUp: false,
      fellInLove: false,
      fought: false,
      talkedForWeeks: 3,
      wasExclusive: false,
      summary: 'Never met but he sure loved sending "hey" every 3 days',
    },
    reviveCount: 2,
    isRevived: true,
    epitaph: 'The king of one-word responses',
    createdAt: new Date('2024-01-20'),
  },
];

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Context provider component
const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [situationships, setSituationships] = useState<Situationship[]>(mockSituationships);

  const clearGraveyard = () => setSituationships([]);
  const addSoul = (soul: Situationship) => setSituationships(prev => [soul, ...prev]);
  const updateSoul = (soul: Situationship) => setSituationships(prev => prev.map(s => s.id === soul.id ? soul : s));
  const deleteSoul = (id: string) => setSituationships(prev => prev.map(s => s.id === id ? { ...s, deleted: true } : s));
  const restoreSoul = (id: string) => setSituationships(prev => prev.map(s => s.id === id ? { ...s, deleted: false } : s));

  const value: AppContextType = {
    darkMode,
    setDarkMode,
    situationships,
    setSituationships,
    clearGraveyard,
    addSoul,
    updateSoul,
    deleteSoul,
    restoreSoul,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// App content component that uses the context
const AppContent: React.FC = () => {
  const { darkMode } = useAppContext();
  
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style={darkMode ? "light" : "dark"} />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" options={{ headerShown: false }}>
            {() => (
              <Tab.Navigator
                screenOptions={({ route, navigation }) => ({
                  tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;
                    if (route.name === 'Graveyard') {
                      iconName = focused ? 'skull' : 'skull-outline';
                    } else if (route.name === 'Add Grave') {
                      iconName = focused ? 'add-circle' : 'add-circle-outline';
                    } else if (route.name === 'Stats') {
                      iconName = focused ? 'bar-chart' : 'bar-chart-outline';
                    } else {
                      iconName = 'help-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                  },
                  tabBarActiveTintColor: '#8B0000',
                  tabBarInactiveTintColor: '#666',
                  tabBarStyle: {
                    backgroundColor: darkMode ? '#1a1a1a' : '#f5f5f5',
                    borderTopColor: darkMode ? '#333' : '#ddd',
                  },
                  headerStyle: {
                    backgroundColor: darkMode ? '#1a1a1a' : '#f5f5f5',
                  },
                  headerTintColor: darkMode ? '#fff' : '#000',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                })}
              >
                <Tab.Screen 
                  name="Graveyard" 
                  component={GraveyardScreen}
                  options={({ navigation }) => ({
                    title: '🪦 Graveyard',
                    headerRight: () => (
                      <Ionicons
                        name="settings-outline"
                        size={26}
                        color="#fff"
                        style={{ marginRight: 16 }}
                        onPress={() => navigation.getParent()?.navigate('Settings')}
                      />
                    ),
                  })}
                />
                <Tab.Screen 
                  name="Add Grave" 
                  component={AddGraveScreen}
                  options={{ title: '➕ Add Grave' }}
                />
                <Tab.Screen 
                  name="Stats" 
                  component={StatsScreen}
                  options={{ title: '📊 Stats',
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name="bar-chart-outline" size={size} color={color} />
                    ),
                  }}
                />
              </Tab.Navigator>
            )}
          </Stack.Screen>
          <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: true, title: '⚙️ Settings' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
