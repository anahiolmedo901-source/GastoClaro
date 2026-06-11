// src/Context/Authcontext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

// Tipo de usuario: usamos el tipo oficial de Supabase
type User = SupabaseUser | null;

type AuthContextType = {
  user: User;
  login: (email: string, password: string) => Promise<boolean>;
  register: (nombre: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  // Mantener sesión activa al refrescar la página
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setUser(data.session.user);
      }
      setLoading(false);
    });

    // Escuchar cambios en el estado de autenticación
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🔑 Login con Supabase Auth + actualización de último acceso
  const login = async (email: string, password: string): Promise<boolean> => {
    // 1. Autenticar usuario con Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error("Error en login:", error.message);
      return false;
    }

    const userId = data.user?.id;

    // 2. Actualizar campo "ultimo_acceso" en la tabla usuarios
    if (userId) {
      const { error: dbError } = await supabase
        .from("usuarios")
        .update({ ultimo_acceso: new Date() }) // Fecha/hora actual
        .eq("id_usuario", userId);             // Buscar por UUID del usuario

      if (dbError) {
        console.error("Error al actualizar ultimo_acceso:", dbError.message);
        // No bloquea el login, solo muestra el error
      }
    }

    // 3. Guardar usuario en el contexto
    setUser(data.user);
    return true;
  };

  // 📝 Registro de usuario en Auth + tabla USUARIOS
  const register = async (nombre: string, email: string, password: string): Promise<boolean> => {
    // 1. Crear usuario en Supabase Auth
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error("Error en registro:", error.message);
      return false;
    }

    const userId = data.user?.id;

    // 2. Insertar datos en tabla "usuarios"
    if (userId) {
      const { error: dbError } = await supabase
        .from("usuarios")
        .insert({
          id_usuario: userId,          // UUID de Supabase Auth
          nombre: nombre,              // Nombre proporcionado en el registro
          correo: email,               // Correo electrónico
          fecha_registro: new Date(),  // Fecha de creación del usuario
          ultimo_acceso: new Date()    // Inicializar último acceso
          // ⚠️ NOTA: No guardar contraseña en texto plano en producción
        });

      if (dbError) {
        console.error("Error al insertar en tabla usuarios:", dbError.message);
        return false;
      }
    } else {
      console.warn("⚠️ Usuario creado en Auth pero no disponible aún para insertar en tabla.");
    }

    setUser(data.user);
    return true;
  };

  // 🚪 Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar el contexto en cualquier componente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
