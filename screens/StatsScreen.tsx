import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../App';
import { CauseOfDeath, Situationship } from '../types';

const CAUSE_LABELS: Record<CauseOfDeath, { label: string; emoji: string }> = {
  ghosted: { label: 'Ghosted', emoji: '👻' },
  breadcrumbed: { label: 'Breadcrumbed', emoji: '🍞' },
  situationship: { label: 'Situationship', emoji: '💔' },
  friendzoned: { label: 'Friendzoned', emoji: '🤝' },
  lovebombed: { label: 'Love Bombed', emoji: '💣' },
  slowfaded: { label: 'Slow Fade', emoji: '🌅' },
  cheated: { label: 'Cheated', emoji: '💔' },
  other: { label: 'Other', emoji: '💀' },
};

function getMonthYear(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}`;
}

export default function StatsScreen() {
  const { situationships } = useAppContext();
  const nonDeleted = situationships.filter(s => !s.deleted);

  // Total graves
  const totalGraves = nonDeleted.length;
  // Revived
  const revived = nonDeleted.filter(s => s.reviveCount > 0).length;
  // Durations
  const durations = nonDeleted.map(s => {
    const start = new Date(s.dateStarted);
    const end = new Date(s.dateEnded);
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24); // days
  }).filter(d => !isNaN(d));
  const avgDuration = durations.length ? (durations.reduce((a, b) => a + b, 0) / durations.length) : 0;
  const longest = durations.length ? Math.max(...durations) : 0;
  const shortest = durations.length ? Math.min(...durations) : 0;

  // Cause of death
  const causeCounts: Record<CauseOfDeath, number> = {
    ghosted: 0, breadcrumbed: 0, situationship: 0, friendzoned: 0, lovebombed: 0, slowfaded: 0, cheated: 0, other: 0
  };
  nonDeleted.forEach(s => { causeCounts[s.causeOfDeath] = (causeCounts[s.causeOfDeath] || 0) + 1; });
  const totalCauses = Object.values(causeCounts).reduce((a, b) => a + b, 0);
  const causeOfDeath = Object.entries(causeCounts).map(([key, value]) => ({
    label: `${CAUSE_LABELS[key as CauseOfDeath].emoji} ${CAUSE_LABELS[key as CauseOfDeath].label}`,
    value,
    percent: totalCauses ? Math.round((value / totalCauses) * 100) : 0,
  })).filter(c => c.value > 0);

  // Monthly activity
  const monthlyMap: Record<string, number> = {};
  nonDeleted.forEach(s => {
    const month = getMonthYear(new Date(s.createdAt));
    monthlyMap[month] = (monthlyMap[month] || 0) + 1;
  });
  const months = Object.keys(monthlyMap).sort();
  const monthlyActivity = months.map(m => monthlyMap[m]);

  // Insights
  let mostCommonEnding = '';
  let maxCause = 0;
  causeOfDeath.forEach(c => {
    if (c.value > maxCause) {
      maxCause = c.value;
      mostCommonEnding = c.label;
    }
  });
  const revivalRate = totalGraves ? `${Math.round((revived / totalGraves) * 100)}%` : '0%';

  // Notification: this month
  const now = new Date();
  const thisMonthKey = `${now.getFullYear()}-${now.getMonth() + 1}`;
  const thisMonthCount = monthlyMap[thisMonthKey] || 0;

  // Duration formatting helper
  function formatDays(days: number) {
    if (days < 1) return '<1 day';
    if (days < 30) return `${Math.round(days)} days`;
    if (days < 365) return `${(days / 30).toFixed(1)} months`;
    return `${(days / 365).toFixed(1)} years`;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>📊 Your Stats</Text>
        <View style={styles.row}>
          <View style={styles.statBox}>
            <Text style={styles.statNumberPink}>🪦 {totalGraves}</Text>
            <Text style={styles.statLabel}>Total Graves</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumberGold}>⚡ {revived}</Text>
            <Text style={styles.statLabel}>Revived</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⏳ Duration Stats</Text>
          <Text style={styles.sectionText}>Average: <Text style={styles.sectionValue}>{formatDays(avgDuration)}</Text></Text>
          <Text style={styles.sectionText}>Longest: <Text style={styles.sectionValue}>{formatDays(longest)}</Text></Text>
          <Text style={styles.sectionText}>Shortest: <Text style={styles.sectionValue}>{formatDays(shortest)}</Text></Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Cause of Death</Text>
          {causeOfDeath.map((c, i) => (
            <View key={c.label} style={styles.causeRow}>
              <Text style={styles.causeLabel}>{c.label}</Text>
              <View style={styles.causeBarBg}>
                <View style={[styles.causeBar, { width: `${c.percent * 2}%` }]} />
              </View>
              <Text style={styles.causeValue}>{c.value} ({c.percent}%)</Text>
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Monthly Activity</Text>
          <View style={styles.monthRow}>
            {months.map((m, i) => (
              <View key={m} style={styles.monthBox}>
                <Text style={styles.monthValue}>{monthlyActivity[i]}</Text>
                <Text style={styles.monthLabel}>{m}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Insights</Text>
          <View style={styles.insightRow}>
            <Text style={styles.insightEmoji}>❤️</Text>
            <View>
              <Text style={styles.insightTitle}>Most Frequent Cause of Death</Text>
              <Text style={styles.insightDesc}>{mostCommonEnding || 'N/A'}</Text>
            </View>
          </View>
          <View style={styles.insightRow}>
            <Text style={styles.insightEmoji}>⚡</Text>
            <View>
              <Text style={styles.insightTitle}>Revival Rate</Text>
              <Text style={styles.insightDesc}>You've revived {revivalRate} of your situationships</Text>
            </View>
          </View>
        </View>
        <View style={styles.notificationCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <View>
              <Text style={styles.notificationTitle}>This Month</Text>
              <Text style={styles.notificationText}>You've added {thisMonthCount} new grave{thisMonthCount === 1 ? '' : 's'}</Text>
            </View>
            <Text style={styles.notificationEmoji}>💀</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18171B',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#232228',
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: '#35343A',
  },
  statNumberPink: {
    color: '#FF6F9C',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statNumberGold: {
    color: '#FFD700',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    color: '#888',
    fontSize: 16,
    marginTop: 4,
  },
  section: {
    backgroundColor: '#232228',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#35343A',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionText: {
    color: '#aaa',
    fontSize: 15,
    marginBottom: 4,
  },
  sectionValue: {
    color: '#fff',
    fontWeight: 'bold',
  },
  causeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  causeLabel: {
    color: '#fff',
    fontSize: 15,
    flex: 1,
  },
  causeBarBg: {
    backgroundColor: '#35343A',
    height: 6,
    borderRadius: 3,
    flex: 2,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  causeBar: {
    backgroundColor: '#fff',
    height: 6,
    borderRadius: 3,
  },
  causeValue: {
    color: '#aaa',
    fontSize: 13,
    width: 54,
    textAlign: 'right',
  },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthBox: {
    alignItems: 'center',
    flex: 1,
  },
  monthValue: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  monthLabel: {
    color: '#888',
    fontSize: 13,
    marginTop: 2,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  insightTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  insightDesc: {
    color: '#aaa',
    fontSize: 13,
  },
  notificationCard: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    marginTop: 8,
  },
  notificationTitle: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
  },
  notificationText: {
    color: '#222',
    fontSize: 14,
  },
  notificationEmoji: {
    fontSize: 28,
    marginLeft: 8,
  },
}); 