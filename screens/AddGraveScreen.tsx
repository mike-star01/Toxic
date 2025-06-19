import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Situationship, CauseOfDeath, EmotionalLog } from '../types';
import { useAppContext } from '../App';

const causesOfDeath: { value: CauseOfDeath; label: string; emoji: string }[] = [
  { value: 'ghosted', label: 'Ghosted', emoji: '👻' },
  { value: 'breadcrumbed', label: 'Breadcrumbed', emoji: '🍞' },
  { value: 'situationship', label: 'Situationship', emoji: '💔' },
  { value: 'friendzoned', label: 'Friendzoned', emoji: '🤝' },
  { value: 'lovebombed', label: 'Love Bombed', emoji: '💣' },
  { value: 'slowfaded', label: 'Slow Fade', emoji: '🌅' },
  { value: 'cheated', label: 'Cheated', emoji: '💔' },
  { value: 'other', label: 'Other', emoji: '💀' },
];

export default function AddGraveScreen() {
  const { addSoul } = useAppContext();
  const [name, setName] = useState('');
  const [causeOfDeath, setCauseOfDeath] = useState<CauseOfDeath>('ghosted');
  const [epitaph, setEpitaph] = useState('');
  const [dateStarted, setDateStarted] = useState('');
  const [dateEnded, setDateEnded] = useState('');
  
  // Emotional log state
  const [metInPerson, setMetInPerson] = useState(false);
  const [numberOfDates, setNumberOfDates] = useState('0');
  const [kissed, setKissed] = useState(false);
  const [hookedUp, setHookedUp] = useState(false);
  const [fellInLove, setFellInLove] = useState(false);
  const [fought, setFought] = useState(false);
  const [talkedForWeeks, setTalkedForWeeks] = useState('1');
  const [wasExclusive, setWasExclusive] = useState(false);

  const generateSummary = (): string => {
    const parts = [];
    
    if (metInPerson) {
      parts.push(`Met ${numberOfDates} time${parseInt(numberOfDates) !== 1 ? 's' : ''}`);
    } else {
      parts.push('Never met in person');
    }
    
    if (kissed) parts.push('kissed');
    if (hookedUp) parts.push('hooked up');
    if (fellInLove) parts.push('fell in love');
    if (fought) parts.push('fought');
    
    if (wasExclusive) parts.push('were exclusive');
    
    parts.push(`talked for ${talkedForWeeks} week${parseInt(talkedForWeeks) !== 1 ? 's' : ''}`);
    
    if (parts.length === 0) return 'A mysterious situationship';
    
    return parts.join(', ');
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name for your situationship');
      return;
    }
    const newSituationship: Situationship = {
      id: Date.now().toString(),
      name: name.trim(),
      causeOfDeath,
      dateStarted: dateStarted ? new Date(dateStarted) : new Date(),
      dateEnded: dateEnded ? new Date(dateEnded) : new Date(),
      emotionalLog: {
        metInPerson,
        numberOfDates: parseInt(numberOfDates) || 0,
        kissed,
        hookedUp,
        fellInLove,
        fought,
        talkedForWeeks: parseInt(talkedForWeeks) || 1,
        wasExclusive,
        summary: generateSummary(),
      },
      reviveCount: 0,
      isRevived: false,
      epitaph: epitaph.trim() || undefined,
      createdAt: new Date(),
    };
    addSoul(newSituationship);
    Alert.alert(
      '🪦 Grave Created!',
      `${name} has been added to the graveyard. RIP.`,
      [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setName('');
            setCauseOfDeath('ghosted');
            setEpitaph('');
            setDateStarted('');
            setDateEnded('');
            setMetInPerson(false);
            setNumberOfDates('0');
            setKissed(false);
            setHookedUp(false);
            setFellInLove(false);
            setFought(false);
            setTalkedForWeeks('1');
            setWasExclusive(false);
          }
        }
      ]
    );
  };

  const EmotionalLogSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>📊 Emotional Autopsy</Text>
      
      <View style={styles.row}>
        <Text style={styles.label}>Did you meet in person?</Text>
        <Switch
          value={metInPerson}
          onValueChange={setMetInPerson}
          trackColor={{ false: '#333', true: '#8B0000' }}
          thumbColor={metInPerson ? '#fff' : '#666'}
        />
      </View>

      {metInPerson && (
        <View style={styles.inputRow}>
          <Text style={styles.label}>Number of dates:</Text>
          <TextInput
            style={styles.numberInput}
            value={numberOfDates}
            onChangeText={setNumberOfDates}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#666"
          />
        </View>
      )}

      <View style={styles.row}>
        <Text style={styles.label}>Kissed?</Text>
        <Switch
          value={kissed}
          onValueChange={setKissed}
          trackColor={{ false: '#333', true: '#FF69B4' }}
          thumbColor={kissed ? '#fff' : '#666'}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Hooked up?</Text>
        <Switch
          value={hookedUp}
          onValueChange={setHookedUp}
          trackColor={{ false: '#333', true: '#FF4500' }}
          thumbColor={hookedUp ? '#fff' : '#666'}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Fell in love?</Text>
        <Switch
          value={fellInLove}
          onValueChange={setFellInLove}
          trackColor={{ false: '#333', true: '#FF1493' }}
          thumbColor={fellInLove ? '#fff' : '#666'}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Had fights?</Text>
        <Switch
          value={fought}
          onValueChange={setFought}
          trackColor={{ false: '#333', true: '#DC143C' }}
          thumbColor={fought ? '#fff' : '#666'}
        />
      </View>

      <View style={styles.inputRow}>
        <Text style={styles.label}>Talked for (weeks):</Text>
        <TextInput
          style={styles.numberInput}
          value={talkedForWeeks}
          onChangeText={setTalkedForWeeks}
          keyboardType="numeric"
          placeholder="1"
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Were exclusive?</Text>
        <Switch
          value={wasExclusive}
          onValueChange={setWasExclusive}
          trackColor={{ false: '#333', true: '#4169E1' }}
          thumbColor={wasExclusive ? '#fff' : '#666'}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>➕ Add New Grave</Text>
          <Text style={styles.subtitle}>Memorialize your failed situationship</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🪦 Basic Info</Text>
          
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Name or nickname (e.g., Gym Rat, Tinder Tom)"
            placeholderTextColor="#666"
          />

          <Text style={styles.label}>Cause of Death:</Text>
          <View style={styles.causeGrid}>
            {causesOfDeath.map((cause) => (
              <TouchableOpacity
                key={cause.value}
                style={[
                  styles.causeButton,
                  causeOfDeath === cause.value && styles.causeButtonActive
                ]}
                onPress={() => setCauseOfDeath(cause.value)}
              >
                <Text style={styles.causeEmoji}>{cause.emoji}</Text>
                <Text style={[
                  styles.causeLabel,
                  causeOfDeath === cause.value && styles.causeLabelActive
                ]}>
                  {cause.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={[styles.input, styles.textArea]}
            value={epitaph}
            onChangeText={setEpitaph}
            placeholder="Epitaph (optional) - e.g., 'Here lies the man who said he wasn't ready for a relationship'"
            placeholderTextColor="#666"
            multiline
            numberOfLines={3}
          />

          <View style={styles.dateRow}>
            <View style={styles.dateInput}>
              <Text style={styles.label}>Started:</Text>
              <TextInput
                style={styles.input}
                value={dateStarted}
                onChangeText={setDateStarted}
                placeholder="YYYY-MM-DD (optional)"
                placeholderTextColor="#666"
              />
            </View>
            <View style={styles.dateInput}>
              <Text style={styles.label}>Ended:</Text>
              <TextInput
                style={styles.input}
                value={dateEnded}
                onChangeText={setDateEnded}
                placeholder="YYYY-MM-DD (optional)"
                placeholderTextColor="#666"
              />
            </View>
          </View>
        </View>

        <EmotionalLogSection />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <LinearGradient
            colors={['#8B0000', '#DC143C']}
            style={styles.submitGradient}
          >
            <Ionicons name="skull" size={24} color="#fff" />
            <Text style={styles.submitText}>Add to Graveyard</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
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
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
  },
  section: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  causeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  causeButton: {
    width: '48%',
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  causeButtonActive: {
    backgroundColor: '#8B0000',
  },
  causeEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  causeLabel: {
    fontSize: 12,
    color: '#ccc',
  },
  causeLabelActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInput: {
    width: '48%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  numberInput: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 8,
    color: '#fff',
    fontSize: 16,
    width: 60,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 40,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 