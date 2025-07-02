import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  Modal,
  TextInput,
  Animated,
  Easing,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Situationship } from '../types';
import { useAppContext } from '../App';
import Svg, { SvgXml, G, Ellipse, Rect, Polyline, Path, Defs, LinearGradient as SvgLinearGradient, Stop, Filter } from 'react-native-svg';
import { Asset } from 'expo-asset';
import SkeletonRisingSvg from '../assets/SkeletonRising.svg';
import LightningBGSvg from '../assets/LightningBG.svg';
import { View as RNView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

const { width } = Dimensions.get('window');

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

const CARD_COLORS = [
  '#8B0000', // dark red
  '#1a1a1a', // gothic black
  '#FFD700', // gold
  '#4B0082', // indigo
  '#00CED1', // teal
  '#FF69B4', // pink
  '#FFA500', // orange
  '#2E8B57', // green
];

// Helper to load SVG as string
const useSvgString = (asset: any) => {
  const [svg, setSvg] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      const assetObj = Asset.fromModule(asset);
      await assetObj.downloadAsync();
      const response = await fetch(assetObj.uri);
      const text = await response.text();
      setSvg(text);
    })();
  }, [asset]);
  return svg;
};

// Animated SVG groups
const AnimatedG = Animated.createAnimatedComponent(G);

// Animated SVG groups for Reanimated
const ReanimatedG = Animated.createAnimatedComponent(G);

type TabParamList = {
  Graveyard: undefined;
  'Add Grave': undefined;
  Settings: undefined;
};

export default function GraveyardScreen() {
  const { situationships, setSituationships, darkMode, deleteSoul, updateSoul, restoreSoul } = useAppContext();
  const [editingSoul, setEditingSoul] = useState<Situationship | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [showDeletedModal, setShowDeletedModal] = useState(false);
  const [reviveAnimId, setReviveAnimId] = useState<string | null>(null);
  const [showFullScreenRevive, setShowFullScreenRevive] = useState<{id: string, name: string} | null>(null);
  const reviveAnim = useRef(new Animated.Value(60)).current; // Y offset for card
  const lightningAnim = useRef(new Animated.Value(0)).current; // opacity for lightning
  const fullScreenAnim = useRef(new Animated.Value(1)).current; // Y offset for full screen
  const fullScreenLightning = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();

  const nonDeletedSouls = situationships.filter(s => !s.deleted);
  const deletedSouls = situationships.filter(s => s.deleted);

  const handleRevive = (id: string) => {
    const soul = situationships.find(s => s.id === id);
    if (!soul) return;
    if (soul.deleted) {
      restoreSoul(id);
      animateFullScreenRevive(id, soul.name);
      Alert.alert('Restored!', `${soul.name} has been restored from the grave! ⚡💀`);
      return;
    }
    setSituationships((prev: Situationship[]) =>
      prev.map((s: Situationship) => {
        if (s.id === id) {
          const newReviveCount = s.reviveCount + 1;
          let message = '';
          if (newReviveCount === 1) {
            message = `Revived ${s.name}! 👻`;
          } else if (newReviveCount === 2) {
            message = `Back from the dead again! 💀`;
          } else if (newReviveCount >= 3) {
            message = `You've revived ${s.name} ${newReviveCount} times. This is now necromancy! 🧟‍♀️`;
          }
          setTimeout(() => {
            if (message) Alert.alert('🧟‍♀️ REVIVED!', message);
          }, 1200); // after animation
          animateFullScreenRevive(id, s.name);
          return {
            ...s,
            reviveCount: newReviveCount,
            isRevived: true,
          };
        }
        return s;
      })
    );
  };

  // Full screen skeleton + lightning animation
  const animateFullScreenRevive = (id: string, name: string) => {
    setShowFullScreenRevive({ id, name });
    fullScreenAnim.setValue(fullScreenHeight); // Start below the screen
    fullScreenLightning.setValue(0);
    Animated.sequence([
      Animated.timing(fullScreenLightning, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
      Animated.timing(fullScreenLightning, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
      Animated.timing(fullScreenAnim, {
        toValue: 0, // Rise to visible
        duration: 1200,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
    ]).start(() => setTimeout(() => setShowFullScreenRevive(null), 1200));
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Grave',
      'Are you sure you want to delete this soul forever?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteSoul(id) }
      ]
    );
  };

  const openEditModal = (soul: Situationship) => {
    setEditingSoul({ ...soul });
    setEditModalVisible(true);
  };

  const handleEditChange = (field: string, value: any) => {
    if (!editingSoul) return;
    setEditingSoul({ ...editingSoul, [field]: value });
  };

  const handleEditEmotionalLogChange = (field: string, value: any) => {
    if (!editingSoul) return;
    setEditingSoul({
      ...editingSoul,
      emotionalLog: { ...editingSoul.emotionalLog, [field]: value }
    });
  };

  const saveEdit = () => {
    if (editingSoul) {
      updateSoul(editingSoul);
      setEditModalVisible(false);
      setEditingSoul(null);
    }
  };

  const getCauseOfDeathIcon = (cause: string) => {
    switch (cause) {
      case 'ghosted': return '👻';
      case 'breadcrumbed': return '🍞';
      case 'situationship': return '💔';
      case 'friendzoned': return '🤝';
      case 'lovebombed': return '💣';
      case 'slowfaded': return '🌅';
      case 'cheated': return '💔';
      default: return '💀';
    }
  };

  const getCauseOfDeathColor = (cause: string) => {
    switch (cause) {
      case 'ghosted': return '#8B0000';
      case 'breadcrumbed': return '#FF8C00';
      case 'situationship': return '#FF1493';
      case 'friendzoned': return '#4169E1';
      case 'lovebombed': return '#FF4500';
      case 'slowfaded': return '#9370DB';
      case 'cheated': return '#DC143C';
      default: return '#666';
    }
  };

  const handleBury = (id: string) => {
    setSituationships((prev: Situationship[]) =>
      prev.map((s: Situationship) => {
        if (s.id === id) {
          return {
            ...s,
            isRevived: false,
          };
        }
        return s;
      })
    );
    const soul = situationships.find(s => s.id === id);
    if (soul) {
      Alert.alert('Back to the grave', `${soul.name} has been buried again.`);
    }
  };

  const GraveCard = ({ situationship }: { situationship: Situationship }) => {
    const screenWidth = Dimensions.get('window').width;
    const width = Math.floor(screenWidth * 0.5);
    const height = 290;
    return (
      <TouchableOpacity style={[styles.graveCard, { marginHorizontal: 0 }]} onPress={() => openEditModal(situationship)}>
        <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
          <Svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
            <Defs>
              <SvgLinearGradient id="stoneGray" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#d3d6db" />
                <Stop offset="100%" stopColor="#a2a5ab" />
              </SvgLinearGradient>
              <SvgLinearGradient id="baseGray" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#b0b2b8" />
                <Stop offset="100%" stopColor="#888a92" />
              </SvgLinearGradient>
            </Defs>
            {/* Main tombstone body, full width */}
            <Path
              d={`M0 ${height*0.8} L0 ${height*0.32} Q0 ${height*0.13} ${width/2} ${height*0.08} Q${width} ${height*0.13} ${width} ${height*0.32} L${width} ${height*0.8} Z`}
              fill="url(#stoneGray)"
              stroke="#888a92"
              strokeWidth="3"
            />
            {/* Skinny inner border for subtle design */}
            <Path
              d={`M${width*0.05} ${height*0.77} L${width*0.05} ${height*0.36} Q${width*0.05} ${height*0.17} ${width/2} ${height*0.12} Q${width*0.95} ${height*0.17} ${width*0.95} ${height*0.36} L${width*0.95} ${height*0.77} Z`}
              fill="none"
              stroke="#cfd1d6"
              strokeWidth="1.2"
            />
            {/* Base slab, full width */}
            <Rect x={0} y={height*0.8} width={width} height={height*0.10} rx={0} fill="url(#baseGray)" stroke="#888a92" strokeWidth="2" />
          </Svg>
          <View style={{
            position: 'absolute',
            top: height * 0.28,
            left: 0,
            width: width,
            height: height * 0.6,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 16,
          }}>
            <Text style={[styles.graveName, { color: '#222', fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 2, textShadowColor: '#fff', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 2, alignSelf: 'center' }]} numberOfLines={1} ellipsizeMode="tail">{situationship.name}</Text>
            <Text style={{ color: '#333', fontSize: 14, marginBottom: 2, textAlign: 'center', textShadowColor: '#fff', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 2, alignSelf: 'center' }} numberOfLines={1} ellipsizeMode="tail">
              {situationship.dateStarted instanceof Date && situationship.dateEnded instanceof Date
                ? `${situationship.dateStarted.toLocaleString('default', { month: 'short', year: 'numeric' })} - ${situationship.dateEnded.toLocaleString('default', { month: 'short', year: 'numeric' })}`
                : ''}
            </Text>
            <Text style={{ color: '#444', fontSize: 13, fontStyle: 'italic', marginBottom: 4, textAlign: 'center', textShadowColor: '#fff', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 2, alignSelf: 'center' }} numberOfLines={2} ellipsizeMode="tail">
              {situationship.epitaph || 'RIP'}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 4, alignSelf: 'center' }}>
              <Text style={[styles.stat, { textShadowColor: '#fff', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 2, textAlign: 'center' }]} numberOfLines={1} ellipsizeMode="tail">📅 {situationship.emotionalLog.numberOfDates} dates</Text>
              <Text style={[styles.stat, { marginLeft: 8, textShadowColor: '#fff', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 2, textAlign: 'center' }]} numberOfLines={1} ellipsizeMode="tail">💬 {situationship.emotionalLog.talkedForWeeks} weeks</Text>
            </View>
          </View>
          {/* Button sits at the bottom slab */}
          <View style={{
            position: 'absolute',
            left: 0,
            width: width,
            bottom: height * 0.04,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3,
          }}>
            {situationship.isRevived ? (
              <TouchableOpacity
                style={[styles.reviveButton, { backgroundColor: '#222', borderColor: '#FFD700', borderWidth: 2, alignSelf: 'center', maxWidth: width * 0.8, justifyContent: 'center' }]}
                onPress={() => handleBury(situationship.id)}
              >
                <Ionicons name="close-circle" size={20} color="#FFD700" />
                <Text style={[styles.reviveText, { color: '#FFD700', marginLeft: 4, textAlign: 'center' }]} numberOfLines={1} ellipsizeMode="tail">Bury</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.reviveButton, { alignSelf: 'center', maxWidth: width * 0.8, justifyContent: 'center' }]}
                onPress={() => handleRevive(situationship.id)}
              >
                <Ionicons name="flash" size={20} color="#FFD700" />
                <Text style={[styles.reviveText, { textAlign: 'center' }]} numberOfLines={1} ellipsizeMode="tail">Revive</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Edit Modal
  const EditModal = () => (
    <Modal
      visible={editModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setEditModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { width: '90%' }]}> 
          <Text style={styles.modalTitle}>Edit Soul</Text>
          <ScrollView style={{ maxHeight: 400 }}>
            {editingSoul && (
              <>
                <Text>Name</Text>
                <TextInput
                  style={styles.input}
                  value={editingSoul.name}
                  onChangeText={v => handleEditChange('name', v)}
                />
                <Text>Epitaph</Text>
                <TextInput
                  style={styles.input}
                  value={editingSoul.epitaph || ''}
                  onChangeText={v => handleEditChange('epitaph', v)}
                />
                <Text>Where You Met</Text>
                <TextInput
                  style={styles.input}
                  value={editingSoul.whereMet || ''}
                  onChangeText={v => handleEditChange('whereMet', v)}
                />
                <Text>Red Flags (comma separated)</Text>
                <TextInput
                  style={styles.input}
                  value={editingSoul.redFlags ? editingSoul.redFlags.join(', ') : ''}
                  onChangeText={v => handleEditChange('redFlags', v.split(',').map(f => f.trim()).filter(Boolean))}
                />
                <Text>Last Message</Text>
                <TextInput
                  style={styles.input}
                  value={editingSoul.lastMessage || ''}
                  onChangeText={v => handleEditChange('lastMessage', v)}
                  multiline
                />
                <Text>Reflection</Text>
                <TextInput
                  style={styles.input}
                  value={editingSoul.reflection || ''}
                  onChangeText={v => handleEditChange('reflection', v)}
                  multiline
                />
                <Text>Card Color</Text>
                <View style={{ flexDirection: 'row', marginBottom: 12, flexWrap: 'wrap' }}>
                  {CARD_COLORS.map(color => (
                    <TouchableOpacity
                      key={color}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: color,
                        marginRight: 8,
                        marginBottom: 8,
                        borderWidth: editingSoul.color === color ? 3 : 1,
                        borderColor: editingSoul.color === color ? '#FFD700' : '#ccc',
                      }}
                      onPress={() => handleEditChange('color', color)}
                    />
                  ))}
                </View>
              </>
            )}
          </ScrollView>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
            <TouchableOpacity style={[styles.saveButton, { flex: 1, marginRight: 8 }]} onPress={saveEdit}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.cancelButton, { flex: 1, marginLeft: 8 }]} onPress={() => setEditModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Deleted Souls Modal
  const DeletedSoulsModal = () => (
    <Modal
      visible={showDeletedModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowDeletedModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { width: '90%' }]}> 
          <Text style={styles.modalTitle}>Deleted Souls</Text>
          <ScrollView style={{ maxHeight: 400 }}>
            {deletedSouls.length === 0 && <Text>No deleted souls.</Text>}
            {deletedSouls.map(soul => (
              <View key={soul.id} style={{ marginBottom: 16, backgroundColor: '#222', borderRadius: 10, padding: 12 }}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>{soul.name}</Text>
                <Text style={{ color: '#aaa' }}>{soul.epitaph}</Text>
                <TouchableOpacity
                  style={[styles.saveButton, { marginTop: 8 }]}
                  onPress={() => {
                    restoreSoul(soul.id);
                    setShowDeletedModal(false);
                    animateFullScreenRevive(soul.id, soul.name);
                  }}
                >
                  <Text style={styles.saveButtonText}>Restore</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={[styles.cancelButton, { marginTop: 8 }]} onPress={() => setShowDeletedModal(false)}>
            <Text style={styles.cancelButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Full screen revive modal
  const skeletonSvg = useSvgString(SkeletonRisingSvg);
  const lightningSvg = useSvgString(LightningBGSvg);

  const fullScreenWidth = Dimensions.get('window').width;
  const fullScreenHeight = Dimensions.get('window').height;

  // Arm animation values
  const leftArmAnim = useRef(new Animated.Value(-30)).current;
  const rightArmAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    if (!!showFullScreenRevive) {
      Animated.sequence([
        Animated.timing(leftArmAnim, { toValue: -50, duration: 250, useNativeDriver: true }),
        Animated.timing(leftArmAnim, { toValue: -10, duration: 250, useNativeDriver: true }),
        Animated.timing(leftArmAnim, { toValue: -50, duration: 250, useNativeDriver: true }),
        Animated.timing(leftArmAnim, { toValue: -30, duration: 250, useNativeDriver: true }),
      ]).start();
      Animated.sequence([
        Animated.timing(rightArmAnim, { toValue: 50, duration: 250, useNativeDriver: true }),
        Animated.timing(rightArmAnim, { toValue: 10, duration: 250, useNativeDriver: true }),
        Animated.timing(rightArmAnim, { toValue: 50, duration: 250, useNativeDriver: true }),
        Animated.timing(rightArmAnim, { toValue: 30, duration: 250, useNativeDriver: true }),
      ]).start();
    }
  }, [showFullScreenRevive]);

  const armBaseStyle = StyleSheet.create({
    left: {
      position: 'absolute',
      left: width * 0.09,
      top: fullScreenHeight * 0.53,
      width: width * 0.18,
      height: fullScreenHeight * 0.22,
      zIndex: 3,
    },
    right: {
      position: 'absolute',
      left: width * 0.76,
      top: fullScreenHeight * 0.53,
      width: width * 0.18,
      height: fullScreenHeight * 0.22,
      zIndex: 3,
    },
  });

  const leftArmStyle = [
    armBaseStyle.left,
    { transform: [{ rotate: leftArmAnim.interpolate({ inputRange: [-50, 50], outputRange: ['-50deg', '50deg'] }) }] },
  ];
  const rightArmStyle = [
    armBaseStyle.right,
    { transform: [{ rotate: rightArmAnim.interpolate({ inputRange: [-50, 50], outputRange: ['-50deg', '50deg'] }) }] },
  ];

  // Define riseTransform before FullScreenReviveModal
  const riseTransform = [{ translateY: fullScreenAnim }];

  // ...skeletonRise, skeletonScale, skeletonRotate as before...
  const skeletonRise = fullScreenAnim.interpolate({ inputRange: [0, 1], outputRange: [fullScreenHeight, 0] });
  const skeletonScale = fullScreenAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.1] });
  const skeletonRotate = fullScreenAnim.interpolate({ inputRange: [0, 1], outputRange: ['10deg', '0deg'] });

  // For arms, build transform array directly
  const leftArmStyleFinal = [
    armBaseStyle.left,
    { transform: [
      { rotate: leftArmAnim.interpolate({ inputRange: [-50, 50], outputRange: ['-50deg', '50deg'] }) },
      { translateY: fullScreenAnim },
    ] },
  ];
  const rightArmStyleFinal = [
    armBaseStyle.right,
    { transform: [
      { rotate: rightArmAnim.interpolate({ inputRange: [-50, 50], outputRange: ['-50deg', '50deg'] }) },
      { translateY: fullScreenAnim },
    ] },
  ];

  const FullScreenReviveModal = () => (
    <Modal
      visible={!!showFullScreenRevive}
      transparent={true}
      animationType="none"
      onRequestClose={() => setShowFullScreenRevive(null)}
    >
      <RNView style={{ flex: 1, backgroundColor: 'rgba(10,10,10,0.97)', justifyContent: 'flex-end', alignItems: 'center' }}>
        {/* Lightning background */}
        <Animated.View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: fullScreenWidth,
          height: fullScreenHeight,
          opacity: fullScreenLightning,
          zIndex: 1,
        }}>
          <Svg width={fullScreenWidth} height={fullScreenHeight} viewBox="0 0 320 400">
            <Ellipse cx="80" cy="80" rx="60" ry="30" fill="#444" fillOpacity={0.7} />
            <Ellipse cx="160" cy="60" rx="80" ry="40" fill="#333" fillOpacity={0.7} />
            <Ellipse cx="240" cy="90" rx="70" ry="35" fill="#555" fillOpacity={0.7} />
            <Rect width="320" height="400" fill="#222" fillOpacity={0.3} />
            <Polyline
              points="170,100 150,200 180,200 140,320 200,180 170,180 200,100"
              stroke="#FFD700"
              strokeWidth={10}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Polyline
              points="175,120 160,180 185,180 150,300 190,170 175,170 190,120"
              stroke="#FFF700"
              strokeWidth={5}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
        </Animated.View>
        {/* Left Arm (Animated) */}
        <Animated.View style={leftArmStyleFinal}>
          <Svg width="100%" height="100%" viewBox="0 0 58 120">
            <Rect x="0" y="0" width="18" height="120" rx="9" fill="#F8F8F8" stroke="#222" strokeWidth="4" />
            <Ellipse cx="-10" cy="110" rx="16" ry="12" fill="#F8F8F8" stroke="#222" strokeWidth="4" />
          </Svg>
        </Animated.View>
        {/* Right Arm (Animated) */}
        <Animated.View style={rightArmStyleFinal}>
          <Svg width="100%" height="100%" viewBox="0 0 58 120">
            <Rect x="40" y="0" width="18" height="120" rx="9" fill="#F8F8F8" stroke="#222" strokeWidth="4" />
            <Ellipse cx="68" cy="110" rx="16" ry="12" fill="#F8F8F8" stroke="#222" strokeWidth="4" />
          </Svg>
        </Animated.View>
        {/* Skeleton rising, full screen (body, head, legs) */}
        <Animated.View style={{
          width: fullScreenWidth,
          height: fullScreenHeight,
          position: 'absolute',
          bottom: 0,
          left: 0,
          justifyContent: 'flex-end',
          alignItems: 'center',
          transform: [
            { translateY: fullScreenAnim },
            { scale: skeletonScale },
            { rotate: skeletonRotate },
          ],
          zIndex: 2,
        }}>
          <Svg width={fullScreenWidth} height={fullScreenHeight} viewBox="0 0 320 600">
            {/* Dirt mound */}
            <Ellipse cx="160" cy="570" rx="120" ry="40" fill="#5B3A1B" />
            <Ellipse cx="160" cy="590" rx="100" ry="20" fill="#7C4F1D" />
            {/* Left Arm */}
            <AnimatedG
              originX={60}
              originY={320}
              transform={[
                { rotate: leftArmAnim.interpolate({ inputRange: [-50, 50], outputRange: ['-50deg', '50deg'] }) },
              ]}
            >
              <Rect x="60" y="320" width="18" height="120" rx="9" fill="#F8F8F8" stroke="#222" strokeWidth="4" />
              <Ellipse cx="50" cy="430" rx="16" ry="12" fill="#F8F8F8" stroke="#222" strokeWidth="4" />
            </AnimatedG>
            {/* Right Arm */}
            <AnimatedG
              originX={242}
              originY={320}
              transform={[
                { rotate: rightArmAnim.interpolate({ inputRange: [-50, 50], outputRange: ['-50deg', '50deg'] }) },
              ]}
            >
              <Rect x="242" y="320" width="18" height="120" rx="9" fill="#F8F8F8" stroke="#222" strokeWidth="4" />
              <Ellipse cx="272" cy="430" rx="16" ry="12" fill="#F8F8F8" stroke="#222" strokeWidth="4" />
            </AnimatedG>
            {/* Body */}
            <G>
              <Ellipse cx="160" cy="220" rx="54" ry="54" fill="#F8F8F8" stroke="#222" strokeWidth="6" />
              <Ellipse cx="140" cy="220" rx="12" ry="18" fill="#222" />
              <Ellipse cx="180" cy="220" rx="12" ry="18" fill="#222" />
              <Ellipse cx="160" cy="245" rx="7" ry="10" fill="#222" />
              <Rect x="135" y="265" width="50" height="14" rx="7" fill="#222" />
              <Rect x="135" y="265" width="50" height="6" rx="3" fill="#F8F8F8" />
              <Rect x="152" y="285" width="16" height="120" rx="8" fill="#F8F8F8" stroke="#222" strokeWidth="4" />
              <Ellipse cx="160" cy="320" rx="38" ry="14" fill="#F8F8F8" stroke="#222" strokeWidth="4" />
              <Ellipse cx="160" cy="340" rx="34" ry="12" fill="#F8F8F8" stroke="#222" strokeWidth="4" />
              <Ellipse cx="160" cy="360" rx="30" ry="10" fill="#F8F8F8" stroke="#222" strokeWidth="4" />
              <Rect x="130" y="400" width="16" height="100" rx="8" fill="#F8F8F8" stroke="#222" strokeWidth="4" />
              <Rect x="174" y="400" width="16" height="100" rx="8" fill="#F8F8F8" stroke="#222" strokeWidth="4" />
              <Ellipse cx="138" cy="510" rx="14" ry="10" fill="#F8F8F8" stroke="#222" strokeWidth="4" />
              <Ellipse cx="182" cy="510" rx="14" ry="10" fill="#F8F8F8" stroke="#222" strokeWidth="4" />
            </G>
          </Svg>
        </Animated.View>
        {/* Name badge */}
        {showFullScreenRevive && (
          <View style={{ position: 'absolute', top: 60, alignSelf: 'center', backgroundColor: '#FFD700', borderRadius: 30, paddingHorizontal: 32, paddingVertical: 12, zIndex: 4 }}>
            <Text style={{ color: '#222', fontWeight: 'bold', fontSize: 28 }}>{showFullScreenRevive.name}</Text>
          </View>
        )}
      </RNView>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: darkMode ? '#0a0a0a' : '#f5f5f5' }]}>
      <FullScreenReviveModal />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: darkMode ? '#fff' : '#000' }]}>🪦 Situationship Graveyard</Text>
          <Text style={[styles.subtitle, { color: darkMode ? '#888' : '#666' }]}> 
            {nonDeletedSouls.length} souls rest here
          </Text>
        </View>
        
        <View style={styles.graveyardGrid}>
          {nonDeletedSouls.map((situationship) => (
            <GraveCard key={situationship.id} situationship={situationship} />
          ))}
        </View>
        
        {nonDeletedSouls.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🪦</Text>
            <Text style={[styles.emptyText, { color: darkMode ? '#fff' : '#000' }]}>No graves yet</Text>
            <Text style={[styles.emptySubtext, { color: darkMode ? '#888' : '#666' }]}>
              Add your first situationship to the graveyard
            </Text>
          </View>
        )}
      </ScrollView>
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 24, alignItems: 'center', zIndex: 10 }}>
        <TouchableOpacity
          style={{ backgroundColor: '#FFD700', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 8 }}
          onPress={() => setShowDeletedModal(true)}
        >
          <Text style={{ color: '#222', fontWeight: 'bold' }}>Show Deleted Souls</Text>
        </TouchableOpacity>
      </View>
      <EditModal />
      <DeletedSoulsModal />
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
  graveyardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 0,
    marginBottom: 0,
  },
  graveCard: {
    width: (width - 48) / 2,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  graveGradient: {
    padding: 16,
    minHeight: 180,
    justifyContent: 'space-between',
  },
  graveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  graveName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  causeIcon: {
    fontSize: 24,
  },
  graveDetails: {
    flex: 1,
  },
  epitaph: {
    fontSize: 12,
    color: '#ccc',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    fontSize: 10,
    color: '#999',
  },
  revivedBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  revivedText: {
    fontSize: 10,
    color: '#000',
    fontWeight: 'bold',
  },
  reviveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 8,
  },
  reviveText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#FFD700',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#333',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 