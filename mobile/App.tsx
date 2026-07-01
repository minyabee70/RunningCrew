import './src/tasks/locationTask';
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useRunningTracker } from './src/hooks/useRunningTracker';

export default function App() {
  const [apiToken, setApiToken] = useState('');
  const [userId, setUserId] = useState('');
  const tracker = useRunningTracker(apiToken, userId);

  const pace =
    tracker.distanceMeters > 0
      ? (tracker.durationSeconds / (tracker.distanceMeters / 1000)).toFixed(0)
      : '-';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>RunningCrew</Text>
      <TextInput
        style={styles.input}
        placeholder="API Token (JWT)"
        placeholderTextColor="#6b7280"
        value={apiToken}
        onChangeText={setApiToken}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="User ID"
        placeholderTextColor="#6b7280"
        value={userId}
        onChangeText={setUserId}
        autoCapitalize="none"
      />

      <View style={styles.stats}>
        <Stat label="거리" value={`${(tracker.distanceMeters / 1000).toFixed(2)} km`} />
        <Stat label="시간" value={`${Math.floor(tracker.durationSeconds / 60)}:${String(tracker.durationSeconds % 60).padStart(2, '0')}`} />
        <Stat label="페이스" value={pace !== '-' ? `${pace}s/km` : '-'} />
        <Stat label="포인트" value={String(tracker.route.length)} />
      </View>

      {tracker.error && <Text style={styles.error}>{tracker.error}</Text>}

      <View style={styles.buttons}>
        {!tracker.isTracking ? (
          <Btn label="시작" onPress={tracker.startTracking} color="#3b82f6" />
        ) : (
          <>
            {tracker.isPaused ? (
              <Btn label="재개" onPress={tracker.resumeTracking} color="#22c55e" />
            ) : (
              <Btn label="일시정지" onPress={tracker.pauseTracking} color="#eab308" />
            )}
            <Btn label="종료" onPress={tracker.stopTracking} color="#ef4444" />
          </>
        )}
      </View>
      <StatusBar style="light" />
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function Btn({ label, onPress, color }: { label: string; onPress: () => void; color: string }) {
  return (
    <TouchableOpacity style={[styles.btn, { backgroundColor: color }]} onPress={onPress}>
      <Text style={styles.btnText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#0f1419', padding: 24, paddingTop: 56 },
  title: { color: '#e6edf3', fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  input: {
    backgroundColor: '#1a1f26',
    borderColor: '#2d333b',
    borderWidth: 1,
    borderRadius: 8,
    color: '#e6edf3',
    padding: 12,
    marginBottom: 8,
  },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 16 },
  stat: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1a1f26',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2d333b',
  },
  statLabel: { color: '#8b949e', fontSize: 12 },
  statValue: { color: '#e6edf3', fontSize: 20, fontWeight: '600', marginTop: 4 },
  buttons: { flexDirection: 'row', gap: 12, marginTop: 8 },
  btn: { flex: 1, padding: 16, borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  error: { color: '#ef4444', marginBottom: 8 },
});
