import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { Colors, BorderRadius } from '../../constants/theme';
import { SymbolView } from 'expo-symbols';
import { useRouter } from 'expo-router';

const CreateAccountScreen = () => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <SymbolView name="travel_explore" size={32} type="hierarchical" tintColor={Colors.light.primary} />
          </View>
          <Text style={styles.title}>Crea un nuovo account</Text>
          <Text style={styles.subtitle}>
            Registrati per monitorare il clima e viaggiare in sicurezza.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Il tuo indirizzo email"
              placeholderTextColor={Colors.dark.placeholder}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                placeholder="Crea una password sicura"
                placeholderTextColor={Colors.dark.placeholder}
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity onPress={() => setPasswordVisible(!isPasswordVisible)} style={styles.eyeIcon}>
                <SymbolView name={isPasswordVisible ? 'visibility_off' : 'visibility'} size={24} tintColor={Colors.dark.placeholder} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Conferma Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                placeholder="Reinserisci la password"
                placeholderTextColor={Colors.dark.placeholder}
                secureTextEntry={!isConfirmPasswordVisible}
              />
              <TouchableOpacity onPress={() => setConfirmPasswordVisible(!isConfirmPasswordVisible)} style={styles.eyeIcon}>
                <SymbolView name={isConfirmPasswordVisible ? 'visibility_off' : 'visibility'} size={24} tintColor={Colors.dark.placeholder} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.createAccountButton} onPress={() => router.replace('screens/MapScreen')}>
          <Text style={styles.createAccountButtonText}>Crea Account</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>Oppure continua con</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.socialLoginContainer}>
          <TouchableOpacity style={styles.socialButton} onPress={() => router.replace('screens/MapScreen')}>
            <Image source={require('../../assets/images/google-logo.png')} style={styles.socialIcon} />
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={() => router.replace('screens/MapScreen')}>
            <Image source={require('../../assets/images/apple-logo.png')} style={[styles.socialIcon, styles.appleIcon]} />
            <Text style={styles.socialButtonText}>Apple</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={() => router.replace('screens/MapScreen')}>
            <Image source={require('../../assets/images/facebook-logo.png')} style={styles.socialIcon} />
            <Text style={styles.socialButtonText}>Facebook</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.loginPrompt}>
          <Text style={styles.loginPromptText}>
            Hai già un account?{' '}
            <Text style={styles.loginLink} onPress={() => router.replace('screens/MapScreen')}>Accedi</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  content: {
    maxWidth: 448,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    backgroundColor: 'rgba(96, 122, 251, 0.2)',
    padding: 16,
    borderRadius: BorderRadius.full,
    marginBottom: 16,
  },
  title: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 28,
    color: Colors.dark.text,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 16,
    color: Colors.dark.placeholder,
    textAlign: 'center',
    marginTop: 8,
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'SpaceGrotesk-Medium',
    fontSize: 16,
    color: Colors.dark.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.dark.inputBackground,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: BorderRadius.lg,
    height: 56,
    paddingHorizontal: 16,
    color: Colors.dark.text,
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 16,
    flex: 1,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
  },
  createAccountButton: {
    backgroundColor: Colors.light.primary,
    height: 56,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createAccountButtonText: {
    color: Colors.dark.text,
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.dark.border,
  },
  dividerText: {
    marginHorizontal: 8,
    color: Colors.dark.placeholder,
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 14,
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.dark.inputBackground,
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  appleIcon: {
    tintColor: Colors.dark.text, // For dark mode
  },
  socialButtonText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 16,
    color: Colors.dark.text,
  },
  loginPrompt: {
    marginTop: 32,
    alignItems: 'center',
  },
  loginPromptText: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 14,
    color: Colors.dark.placeholder,
  },
  loginLink: {
    fontFamily: 'SpaceGrotesk-Bold',
    color: Colors.light.primary,
  },
});

export default CreateAccountScreen;
