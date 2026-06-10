import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { spacing, typography, borderRadius, shadows } from '@attendance/ui';

const logoImg = require('../../assets/icon.png');

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const lineWidth = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  // Radar ripple animation values
  const rippleScale1 = useRef(new Animated.Value(0.9)).current;
  const rippleOpacity1 = useRef(new Animated.Value(0.6)).current;
  const rippleScale2 = useRef(new Animated.Value(0.9)).current;
  const rippleOpacity2 = useRef(new Animated.Value(0.4)).current;

  // Slow floating background orbs
  const orbScale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // 1. Entrance animation
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 650,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(lineWidth, {
        toValue: 100, // Line expands to 100 pixels
        duration: 750,
        useNativeDriver: false,
      }),
      Animated.spring(orbScale, {
        toValue: 1.1,
        tension: 8,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Loop radar ripple rings
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.parallel([
            Animated.timing(rippleScale1, {
              toValue: 2.6,
              duration: 1300,
              useNativeDriver: true,
            }),
            Animated.timing(rippleOpacity1, {
              toValue: 0,
              duration: 1300,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(rippleScale1, {
              toValue: 0.9,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(rippleOpacity1, {
              toValue: 0.6,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ]),
        Animated.sequence([
          Animated.delay(450),
          Animated.parallel([
            Animated.timing(rippleScale2, {
              toValue: 3.2,
              duration: 1300,
              useNativeDriver: true,
            }),
            Animated.timing(rippleOpacity2, {
              toValue: 0,
              duration: 1300,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(rippleScale2, {
              toValue: 0.9,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(rippleOpacity2, {
              toValue: 0.4,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ])
    ).start();

    // 3. Zoom-out camera push and fade-out transition (1.5 seconds total)
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(screenOpacity, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1.18, // Screen zoom effect on exit
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onFinish();
      });
    }, 1550);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      <LinearGradient
        colors={['#0B0F19', '#111827']} // Deepest Space Obsidian to Charcoal Dark Slate
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Floating background glowing ambient orbs */}
        <Animated.View style={[styles.bgOrb1, { transform: [{ scale: orbScale }] }]} />
        <Animated.View style={[styles.bgOrb2, { transform: [{ scale: orbScale }] }]} />

        <Animated.View
          style={[
            styles.centerContainer,
            {
              opacity: contentOpacity,
            },
          ]}
        >
          {/* Radar Wave Rings radiating outwards */}
          <Animated.View
            style={[
              styles.rippleRing,
              {
                transform: [{ scale: rippleScale1 }],
                opacity: rippleOpacity1,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.rippleRing,
              {
                transform: [{ scale: rippleScale2 }],
                opacity: rippleOpacity2,
              },
            ]}
          />

          {/* Glassmorphism Logo container */}
          <Animated.View
            style={[
              styles.logoBadge,
              shadows.lg,
              {
                transform: [{ scale: logoScale }],
              },
            ]}
          >
            <Image source={logoImg} style={styles.logoImage} resizeMode="contain" />
          </Animated.View>

          {/* Sleek App Name */}
          <Text style={styles.appName}>AMS</Text>
          
          {/* Expanding divider line */}
          <Animated.View style={[styles.brandLine, { width: lineWidth }]} />

          {/* Subtitle */}
          <Text style={styles.subtitle}>Attendance Management System</Text>
        </Animated.View>

        {/* Minimal Footer brand info */}
        <Animated.View style={[styles.footer, { opacity: contentOpacity }]}>
          <Text style={styles.version}>AMS SECURE • v1.0.0</Text>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  bgOrb1: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#4F46E5',
    opacity: 0.08,
    top: '25%',
    left: '-15%',
  },
  bgOrb2: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#06B6D4',
    opacity: 0.06,
    bottom: '20%',
    right: '-20%',
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  rippleRing: {
    position: 'absolute',
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 1.5,
    borderColor: 'rgba(99, 102, 241, 0.35)',
    top: 0, // matches the logo badge height offset positioning
    marginBottom: spacing.xs,
  },
  logoBadge: {
    width: 104,
    height: 104,
    borderRadius: borderRadius['2xl'],
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 10,
    marginBottom: spacing.md,
  },
  logoImage: {
    width: '80%',
    height: '80%',
    borderRadius: borderRadius.xl,
  },
  appName: {
    ...typography.h1,
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginTop: spacing.sm,
  },
  brandLine: {
    height: 2,
    backgroundColor: 'rgba(99, 102, 241, 0.75)',
    borderRadius: 1,
    marginVertical: spacing.sm,
  },
  subtitle: {
    ...typography.bodyMedium,
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.8,
  },
  footer: {
    position: 'absolute',
    bottom: spacing['3xl'],
    alignItems: 'center',
  },
  version: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.3)',
    fontWeight: '700',
    letterSpacing: 1.5,
  },
});
