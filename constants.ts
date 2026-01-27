
import { User } from './types';

// The 4 fixed members of the group
export const FIXED_USERS: User[] = [
  { id: '1', name: 'Samuel', email: 'samuel@dev.com', role: 'ADMIN' },
  { id: '2', name: 'Bob', email: 'bob@dev.com', role: 'ADMIN' },
  { id: '3', name: 'Charlie', email: 'charlie@dev.com', role: 'ADMIN' },
  { id: '4', name: 'David', email: 'david@dev.com', role: 'ADMIN' },
];

export const PASSWORDS: Record<string, string> = {
  'samuel@dev.com': 'dev123',
  'pedro@dev.com': 'dev123',
  'carlos@dev.com': 'dev123',
  'falcon@dev.com': 'dev123',
};

export const POINT_RULES = {
  CREATE_POST: 10,
  POST_CODE: 5,
  VALIDATE_CODE: 2,
};
