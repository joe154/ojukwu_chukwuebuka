"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, googleProvider } from "../../lib/firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegister, setIsRegister] = useState(false);

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/admin');
    } catch (e: any) {
      setError(e.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push('/admin');
    } catch (e: any) {
      setError(e.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-md mx-auto py-12">
      <h2 className="text-2xl font-semibold mb-4">Sign {isRegister ? 'up' : 'in'}</h2>
      {error && <div className="mb-3 text-red-600">{error}</div>}
      <form onSubmit={handleEmail} className="space-y-3">
        <input
          className="w-full border rounded px-3 py-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full border rounded px-3 py-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="flex items-center justify-between">
          <label className="text-sm">
            <input type="checkbox" checked={isRegister} onChange={(e) => setIsRegister(e.target.checked)} />{' '}
            Create account
          </label>
          <button className="px-3 py-2 bg-blue-600 text-white rounded" disabled={loading}>
            {loading ? 'Please wait...' : isRegister ? 'Register' : 'Sign in'}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="text-sm text-gray-600 mb-2">Or continue with</div>
        <button onClick={handleGoogle} className="w-full px-3 py-2 border rounded flex items-center justify-center">
          {loading ? 'Please wait...' : 'Sign in with Google'}
        </button>
      </div>

      <p className="mt-4 text-sm text-gray-600">
        After signing in, if you need admin access add your Firebase UID or email to the backend `admins` table.
      </p>
    </section>
  );
}
