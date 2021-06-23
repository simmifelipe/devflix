import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';

interface AuthState {
  user: object;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface SignUpCredentials {
  name: string;
  email: string;
  password: string;
}

interface AuthContextData {
  user: object;
  signIn(credentials: SignInCredentials): Promise<void>;
  signUp(credentials: SignUpCredentials): Promise<void>;
  signOut(): void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData(): Promise<void> {
      const user = await AsyncStorage.getItem('@NerdFlix:user');

      if (user) {
        setData({ user: JSON.parse(user) });
      }

      setLoading(false);
    }

    loadStorageData();
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const { user } = await auth().signInWithEmailAndPassword(email, password);

    await AsyncStorage.setItem('@NerdFlix:user', JSON.stringify(user));

    setData({ user });
    setLoading(false);
  }, []);

  const signUp = useCallback(async ({ name, email, password }) => {
    let user: any;
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(result => {
        result.user.updateProfile({ displayName: name });
        user = result.user;
        console.log(user);

        AsyncStorage.setItem('@NerdFlix:user', JSON.stringify(user));

        setData({ user });
        setLoading(false);
        return user;
      });
  }, []);

  const signOut = useCallback(async () => {
    await auth().signOut();

    await AsyncStorage.removeItem('@NerdFlix:user');

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user: data.user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth precisa de um AuthProvider');
  }
  return context;
}
