import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '../App';

export default function SettingsScreen() {
  const { darkMode, setDarkMode, clearGraveyard } = useAppContext();
  const [notifications, setNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // New state for info modals
  const [infoModal, setInfoModal] = useState<{visible: boolean, title: string, content: React.ReactNode}>({visible: false, title: '', content: null});

  const handleExportData = () => {
    Alert.alert(
      '📤 Export Data',
      'Export your graveyard data to share with friends or backup?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => Alert.alert('Success', 'Data exported!') }
      ]
    );
  };

  const handleClearGraveyard = () => {
    Alert.alert(
      '🗑️ Clear Graveyard',
      'Are you sure you want to clear all graves? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: () => {
            clearGraveyard();
            Alert.alert('Cleared', 'All graves have been cleared. RIP.');
          }
        }
      ]
    );
  };

  const handlePremiumUpgrade = () => {
    setShowPremiumModal(true);
  };

  const handleDarkModeToggle = (value: boolean) => {
    setDarkMode(value);
    Alert.alert(
      value ? '🌙 Dark Mode On' : '☀️ Light Mode On',
      value ? 'The graveyard is now spookier!' : 'The graveyard is now brighter!',
      [{ text: 'OK' }]
    );
  };

  const PremiumModal = () => (
    <Modal
      visible={showPremiumModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowPremiumModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <LinearGradient
            colors={['#FFD700', '#FFA500', '#FF8C00']}
            style={styles.premiumModalGradient}
          >
            <Text style={styles.modalTitle}>💎 Premium Features</Text>
            <Text style={styles.modalSubtitle}>Unlock the full graveyard experience!</Text>
            
            <ScrollView style={styles.featureScroll}>
              <View style={styles.featureList}>
                <View style={styles.featureItem}>
                  <Text style={styles.featureIcon}>🎭</Text>
                  <View style={styles.featureText}>
                    <Text style={styles.featureTitle}>Gothic Themes</Text>
                    <Text style={styles.featureDesc}>Spooky graveyard aesthetics</Text>
                  </View>
                </View>
                
                <View style={styles.featureItem}>
                  <Text style={styles.featureIcon}>⚡</Text>
                  <View style={styles.featureText}>
                    <Text style={styles.featureTitle}>Revive Animations</Text>
                    <Text style={styles.featureDesc}>Extra dramatic zombie effects</Text>
                  </View>
                </View>
                
                <View style={styles.featureItem}>
                  <Text style={styles.featureIcon}>🤖</Text>
                  <View style={styles.featureText}>
                    <Text style={styles.featureTitle}>AI Eulogies</Text>
                    <Text style={styles.featureDesc}>Let AI write funny epitaphs</Text>
                  </View>
                </View>
                
                <View style={styles.featureItem}>
                  <Text style={styles.featureIcon}>☁️</Text>
                  <View style={styles.featureText}>
                    <Text style={styles.featureTitle}>Cloud Backup</Text>
                    <Text style={styles.featureDesc}>Never lose your graves again</Text>
                  </View>
                </View>
                
                <View style={styles.featureItem}>
                  <Text style={styles.featureIcon}>📊</Text>
                  <View style={styles.featureText}>
                    <Text style={styles.featureTitle}>Analytics</Text>
                    <Text style={styles.featureDesc}>Track your dating patterns</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
            
            <Text style={styles.modalPrice}>$4.99/month</Text>
            
            <TouchableOpacity 
              style={styles.upgradeButton}
              onPress={() => {
                setShowPremiumModal(false);
                Alert.alert(
                  '💳 Payment Required',
                  'You need to pay for this upgrade with real money! 💸\n\nJust kidding, this is a demo app. But imagine if it was real... 😅',
                  [{ text: 'OK', onPress: () => {} }]
                );
              }}
            >
              <Text style={styles.upgradeButtonText}>💸 Take My Money Already!</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowPremiumModal(false)}
            >
              <Text style={styles.closeButtonText}>Maybe Later 😅</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );

  const InfoModal = () => (
    <Modal
      visible={infoModal.visible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setInfoModal({ ...infoModal, visible: false })}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{infoModal.title}</Text>
          <ScrollView style={{ maxHeight: 300, marginBottom: 16 }}>
            {infoModal.content}
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={() => setInfoModal({ ...infoModal, visible: false })}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const handleGraveThemes = () => {
    setInfoModal({
      visible: true,
      title: 'Grave Themes',
      content: (
        <View>
          <Text style={{ fontSize: 16, marginBottom: 8 }}>Preview the spookiest graveyard themes:</Text>
          <Text>🦇 Gothic: Dark, moody, and full of bats!</Text>
          <Text>🌈 Vaporwave: Neon tombstones and retro vibes.</Text>
          <Text>⛪ Churchyard: Classic, peaceful, and a little haunted.</Text>
          <Text style={{ marginTop: 16, color: '#FFD700', fontWeight: 'bold' }}>Upgrade to Premium to unlock all themes!</Text>
        </View>
      )
    });
  };

  const handleReviveAnimations = () => {
    setInfoModal({
      visible: true,
      title: 'Revive Animations',
      content: (
        <View>
          <Text style={{ fontSize: 16, marginBottom: 8 }}>Bring your situationships back with style:</Text>
          <Text>💀 Skeletons rising from the grave</Text>
          <Text>⚡ Lightning strikes and dramatic music</Text>
          <Text>🧟‍♂️ Zombie hand animations</Text>
          <Text style={{ marginTop: 16, color: '#FFD700', fontWeight: 'bold' }}>Upgrade to Premium for the full show!</Text>
        </View>
      )
    });
  };

  const handlePrivacyPolicy = () => {
    setInfoModal({
      visible: true,
      title: 'Privacy Policy',
      content: (
        <View>
          <Text style={{ fontSize: 16, marginBottom: 8 }}>Your secrets are safe in the graveyard.</Text>
          <Text>We do not share your situationships with the living or the dead. All your data stays on your device, unless you choose to back it up. No ghosts, no leaks, just peace.</Text>
        </View>
      )
    });
  };

  const handleTermsOfService = () => {
    setInfoModal({
      visible: true,
      title: 'Terms of Service',
      content: (
        <View>
          <Text style={{ fontSize: 16, marginBottom: 8 }}>By using this app, you agree to:</Text>
          <Text>• Only bury situationships, not real people.</Text>
          <Text>• Laugh at your own dating history.</Text>
          <Text>• Not take anything here too seriously.</Text>
          <Text style={{ marginTop: 16 }}>If you summon a ghost, that's on you. 👻</Text>
        </View>
      )
    });
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    showSwitch = false, 
    switchValue = false, 
    onSwitchChange = () => {},
    isPremium = false 
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: (value: boolean) => void;
    isPremium?: boolean;
  }) => (
    <TouchableOpacity 
      style={[styles.settingItem, { borderBottomColor: darkMode ? '#333' : '#eee' }]} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: darkMode ? '#fff' : '#000' }]}>
            {title}
            {isPremium && <Text style={styles.premiumBadge}> ⭐</Text>}
          </Text>
          {subtitle && <Text style={[styles.settingSubtitle, { color: darkMode ? '#888' : '#666' }]}>{subtitle}</Text>}
        </View>
      </View>
      {showSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: darkMode ? '#333' : '#ddd', true: '#8B0000' }}
          thumbColor={switchValue ? '#fff' : darkMode ? '#666' : '#999'}
        />
      ) : onPress ? (
        <Ionicons name="chevron-forward" size={20} color={darkMode ? '#666' : '#999'} />
      ) : null}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: darkMode ? '#0a0a0a' : '#f5f5f5' }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: darkMode ? '#fff' : '#000' }]}>⚙️ Settings</Text>
          <Text style={[styles.subtitle, { color: darkMode ? '#888' : '#666' }]}>Customize your graveyard experience</Text>
        </View>

        <View style={[styles.section, { backgroundColor: darkMode ? '#1a1a1a' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: darkMode ? '#fff' : '#000' }]}>🔔 Notifications</Text>
          <SettingItem
            icon="🔔"
            title="Push Notifications"
            subtitle="Get notified when someone tries to revive a grave"
            showSwitch={true}
            switchValue={notifications}
            onSwitchChange={setNotifications}
          />
        </View>

        <View style={[styles.section, { backgroundColor: darkMode ? '#1a1a1a' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: darkMode ? '#fff' : '#000' }]}>🎨 Appearance</Text>
          <SettingItem
            icon="🌙"
            title="Dark Mode"
            subtitle="Keep it spooky"
            showSwitch={true}
            switchValue={darkMode}
            onSwitchChange={handleDarkModeToggle}
          />
          <SettingItem
            icon="🎭"
            title="Grave Themes"
            subtitle="Gothic, Vaporwave, Churchyard"
            isPremium={true}
            onPress={handleGraveThemes}
          />
          <SettingItem
            icon="⚡"
            title="Revive Animations"
            subtitle="Extra dramatic effects"
            isPremium={true}
            onPress={handleReviveAnimations}
          />
        </View>

        <View style={[styles.section, { backgroundColor: darkMode ? '#1a1a1a' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: darkMode ? '#fff' : '#000' }]}>💾 Data & Backup</Text>
          <SettingItem
            icon="☁️"
            title="Auto Backup"
            subtitle="Backup your graveyard to the cloud"
            showSwitch={true}
            switchValue={autoBackup}
            onSwitchChange={setAutoBackup}
            isPremium={true}
          />
          <SettingItem
            icon="📤"
            title="Export Data"
            subtitle="Share your graveyard with friends"
            onPress={handleExportData}
          />
          <SettingItem
            icon="🗑️"
            title="Clear Graveyard"
            subtitle="Delete all graves (cannot be undone)"
            onPress={handleClearGraveyard}
          />
        </View>

        <View style={[styles.section, { backgroundColor: darkMode ? '#1a1a1a' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: darkMode ? '#fff' : '#000' }]}>💎 Premium Features</Text>
          <TouchableOpacity style={styles.premiumCard} onPress={handlePremiumUpgrade}>
            <LinearGradient
              colors={['#FFD700', '#FFA500']}
              style={styles.premiumGradient}
            >
              <Text style={styles.premiumIcon}>💎</Text>
              <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
              <Text style={styles.premiumSubtitle}>
                Unlock exclusive themes, animations, and AI eulogies
              </Text>
              <Text style={styles.premiumPrice}>$4.99/month</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: darkMode ? '#1a1a1a' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: darkMode ? '#fff' : '#000' }]}>ℹ️ About</Text>
          <SettingItem
            icon="📱"
            title="Version"
            subtitle="1.0.0"
          />
          <SettingItem
            icon="📧"
            title="Contact Support"
            subtitle="Get help with your graveyard"
            onPress={() => Alert.alert('Contact', 'Email: support@situationshipgraveyard.com')}
          />
          <SettingItem
            icon="📖"
            title="Privacy Policy"
            subtitle="How we handle your data"
            onPress={handlePrivacyPolicy}
          />
          <SettingItem
            icon="📄"
            title="Terms of Service"
            subtitle="App usage terms"
            onPress={handleTermsOfService}
          />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: darkMode ? '#888' : '#666' }]}>
            Made with 💀 by the Situationship Graveyard team
          </Text>
          <Text style={[styles.footerSubtext, { color: darkMode ? '#666' : '#999' }]}>
            Because every failed talking stage deserves a proper burial
          </Text>
        </View>
      </ScrollView>
      <PremiumModal />
      <InfoModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  premiumBadge: {
    color: '#FFD700',
  },
  premiumCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  premiumGradient: {
    padding: 20,
    alignItems: 'center',
  },
  premiumIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  premiumSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  premiumPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 14,
  },
  footerSubtext: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#0a0a0a',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    maxHeight: '80%',
  },
  premiumModalGradient: {
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 24,
  },
  featureScroll: {
    maxHeight: 200,
    marginBottom: 16,
  },
  featureList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  featureDesc: {
    fontSize: 14,
    color: '#888',
  },
  modalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  upgradeButton: {
    backgroundColor: '#FFA500',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    backgroundColor: '#666',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
}); 