/*
  Login.tsx
  React Native login screen with custom authentication against a user table.
  Requisitos:
    npm install react-native-get-random-values
    expo install react-native-get-random-values   # si usas Expo
*/

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { supabase } from '../../lib/supabase';
import bcrypt from 'bcryptjs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  mobile_number: string;
  avatar_url: string;
}

interface LoginProps {
  onLoginSuccess: (user: User) => void;
  onRegisterPress: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onRegisterPress}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focused, setFocused] = useState<string>('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);

  const emailError = (): string | null => {
    if (!email.trim()) return 'Email requerido';
    if (!EMAIL_RE.test(email)) return 'Formato de email inválido';
    return null;
  };

  const passwordError = (): string | null => {
    if (!password) return 'Contraseña requerida';
    if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    return null;
  };

  const validateAll = (): string | null => {
    const errs = [emailError(), passwordError()].filter(Boolean);
    return errs.length > 0 ? (errs[0] as string) : null;
  };

  const inputBorderColor = (name: string) =>
    focused === name ? styles.inputFocus.borderColor : styles.input.borderColor;

  const handleSignIn = async () => {
    // marcar touched para mostrar errores si no ha interactuado
    setTouched({ email: true, password: true });

    const err = validateAll();
    if (err) {
      Alert.alert('Validación', err);
      return;
    }

    try {
      setLoading(true);

      const userEmail = email.trim().toLowerCase();
      const userPassword = String(password);

      // 1. Buscar al usuario por email en tu tabla 'users'
      const { data: users, error: fetchError } = await supabase
        .from('users')
        .select('*') // Traemos todos los datos del usuario
        .eq('email', userEmail)
        .single(); // .single() devuelve un error si no se encuentra exactamente un usuario

      if (fetchError || !users) {
        throw new Error('Invalid login credentials'); // Error genérico por seguridad
      }

      // 2. Comparar la contraseña ingresada con el hash de la base de datos
      const storedHash = users.password;
      const passwordMatches = bcrypt.compareSync(userPassword, storedHash);

      if (!passwordMatches) {
        throw new Error('Invalid login credentials'); // Misma alerta para no dar pistas a atacantes
      }

      // 3. Login exitoso
      // Llamamos a onLoginSuccess con los datos del usuario (excluyendo la contraseña)
      const { password: _, ...userProfile } = users;
      Alert.alert('Éxito', 'Has iniciado sesión correctamente.');
      onLoginSuccess(userProfile);

    } catch (e: any) {
      const message = e.message || 'Ocurrió un error desconocido.';
      console.error('Login failed:', e);
      Alert.alert('Login failed', message);
    } finally {
      setLoading(false);
    }
  };

  // Optimización: Calcular errores una sola vez por renderizado
  const errors = {
    email: touched.email ? emailError() : null,
    password: touched.password ? passwordError() : null,
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.title}>Sign in</Text>
 
          <View style={styles.inputWrap}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="jane@example.com"
              placeholderTextColor="#FFFFFF99"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={[styles.input, { borderColor: inputBorderColor('email') }]}
              onFocus={() => setFocused('email')}
              onBlur={() => {
                setFocused('');
                setTouched((t) => ({ ...t, email: true }));
              }}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.inputWrap}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="#FFFFFF99"
              secureTextEntry
              style={[styles.input, { borderColor: inputBorderColor('password') }]}
              onFocus={() => setFocused('password')}
              onBlur={() => {
                setFocused('');
                setTouched((t) => ({ ...t, password: true }));
              }}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.6 }]}
            onPress={handleSignIn}
            disabled={loading}
          >
            {loading ? <ActivityIndicator /> : <Text style={styles.buttonText}>Sign in</Text>}
          </TouchableOpacity>

          <View style={{ marginTop: 12, alignItems: 'center' }}>
            <Text style={styles.helper}>
              Don't have an account?{' '}
              <Text style={styles.link} onPress={onRegisterPress}>
                Sign up
              </Text>
            </Text>
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.helperSmall}>
              By signing in you accept our terms and privacy policy.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputWrap: {
    width: '100%',
    marginVertical: 6,
  },
  label: {
    color: '#cbd5e1',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: 'white',
  },
  inputFocus: {
    borderColor: '#16a34a', // verde
  },
  button: {
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#0b1421',
    fontWeight: '700',
    fontSize: 16,
  },
  helper: {
    color: '#9ca3af',
    textAlign: 'center',
  },
  helperSmall: {
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 12,
  },
  link: {
    color: '#93c5fd',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: '#f87171',
    marginTop: 6,
    fontSize: 13,
  },
});

export default Login;