import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

export function GradientBackground({ children }) {
  const color1 = '#264b89' + '40';
  const color2 = '#7eb6ff' + '20';
  const color3 = '#ffffff' + '10';

  return (
    <LinearGradient
      colors={[color1, color2, color3]}
      style={styles.container}
      locations={[0.00, 0.65, 1.00]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});