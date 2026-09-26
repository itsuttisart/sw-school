import { mockUsers } from '@/lib/data';
import { User } from '@/lib/types';

const SESSION_KEY = 'sw-school:active-user';
const PIN_KEY_PREFIX = 'sw-school:pin:';
const PASSWORD_KEY_PREFIX = 'sw-school:password:';
const PROFILE_KEY_PREFIX = 'sw-school:profile:';
const PIN_ITERATIONS = 120_000;
const PASSWORD_ITERATIONS = 210_000;

type PinCredential = {
  salt: string;
  hash: string;
  iterations: number;
};

export type StartupAuth = {
  authenticatedUser: User | null;
  lockedUser: User | null;
};

const encodeBase64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));
const decodeBase64 = (value: string) => Uint8Array.from(atob(value), char => char.charCodeAt(0));

export function safeUser(user: User): User {
  const { password: _password, ...publicUser } = user;
  return publicUser;
}

export function getProfiledUser(user: User): User {
  const safe = safeUser(user);
  try {
    const savedProfile = localStorage.getItem(`${PROFILE_KEY_PREFIX}${user.id}`);
    if (!savedProfile) return safe;

    const profile = JSON.parse(savedProfile) as Partial<User>;
    return {
      ...safe,
      name: typeof profile.name === 'string' ? profile.name : safe.name,
      email: typeof profile.email === 'string' ? profile.email : undefined,
      phone: typeof profile.phone === 'string' ? profile.phone : safe.phone,
      avatar: typeof profile.avatar === 'string' ? profile.avatar : undefined,
      province: typeof profile.province === 'string' ? profile.province : undefined,
      district: typeof profile.district === 'string' ? profile.district : undefined,
      subdistrict: typeof profile.subdistrict === 'string' ? profile.subdistrict : undefined,
      address: typeof profile.address === 'string' ? profile.address : undefined
    };
  } catch {
    return safe;
  }
}

export function saveUserProfile(user: User) {
  const { id, name, email, phone, avatar, province, district, subdistrict, address } = user;
  localStorage.setItem(`${PROFILE_KEY_PREFIX}${id}`, JSON.stringify({ name, email, phone, avatar, province, district, subdistrict, address }));
}

export function rememberUser(user: User) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id }));
}

export function clearRememberedUser() {
  localStorage.removeItem(SESSION_KEY);
}

export function getStartupAuth(): StartupAuth {
  try {
    const session = localStorage.getItem(SESSION_KEY);
    if (!session) return { authenticatedUser: null, lockedUser: null };

    const { userId } = JSON.parse(session) as { userId?: string };
    const user = mockUsers.find(candidate => candidate.id === userId);
    if (!user || !getSavedPin(user.id)) {
      clearRememberedUser();
      return { authenticatedUser: null, lockedUser: null };
    }

    return { authenticatedUser: null, lockedUser: getProfiledUser(user) };
  } catch {
    clearRememberedUser();
    return { authenticatedUser: null, lockedUser: null };
  }
}

export function getSavedPin(userId: string): PinCredential | null {
  try {
    const stored = localStorage.getItem(`${PIN_KEY_PREFIX}${userId}`);
    return stored ? JSON.parse(stored) as PinCredential : null;
  } catch {
    return null;
  }
}

async function deriveSecretHash(secret: string, salt: Uint8Array, iterations: number) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256);
  return new Uint8Array(bits);
}

async function saveDerivedCredential(keyPrefix: string, userId: string, secret: string, iterations: number) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await deriveSecretHash(secret, salt, iterations);
  const credential: PinCredential = {
    salt: encodeBase64(salt),
    hash: encodeBase64(hash),
    iterations
  };
  localStorage.setItem(`${keyPrefix}${userId}`, JSON.stringify(credential));
}

async function verifyDerivedCredential(keyPrefix: string, userId: string, secret: string) {
  let credential: PinCredential | null = null;
  try {
    const stored = localStorage.getItem(`${keyPrefix}${userId}`);
    credential = stored ? JSON.parse(stored) as PinCredential : null;
  } catch {
    return false;
  }
  if (!credential) return false;

  try {
    const actualHash = await deriveSecretHash(secret, decodeBase64(credential.salt), credential.iterations);
    const expectedHash = decodeBase64(credential.hash);
    if (actualHash.length !== expectedHash.length) return false;

    let difference = 0;
    actualHash.forEach((value, index) => { difference |= value ^ expectedHash[index]; });
    return difference === 0;
  } catch {
    return false;
  }
}

export async function setUserPin(userId: string, pin: string) {
  await saveDerivedCredential(PIN_KEY_PREFIX, userId, pin, PIN_ITERATIONS);
}

export async function verifyUserPin(userId: string, pin: string) {
  return verifyDerivedCredential(PIN_KEY_PREFIX, userId, pin);
}

export async function setUserPassword(userId: string, password: string) {
  await saveDerivedCredential(PASSWORD_KEY_PREFIX, userId, password, PASSWORD_ITERATIONS);
}

export async function verifyUserPassword(userId: string, password: string) {
  const storedPassword = localStorage.getItem(`${PASSWORD_KEY_PREFIX}${userId}`);
  if (storedPassword !== null) return verifyDerivedCredential(PASSWORD_KEY_PREFIX, userId, password);
  return mockUsers.find(user => user.id === userId)?.password === password;
}