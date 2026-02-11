import type {LoginResponse} from '@/entities/user';
import {apiFetch} from './client';

export function login(email: string, password: string) {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: {email, password},
  });
}

export function register(email: string, password: string) {
  return apiFetch<LoginResponse>('/auth/register', {
    method: 'POST',
    body: {email, password},
  });
}

export function getProfile(token: string) {
  return apiFetch<{user: {id: number; email: string; role: 'client' | 'manager'}}>('/auth/profile', {
    token,
  });
}

export function logout() {
  return apiFetch<{message: string}>('/auth/logout', {method: 'POST'});
}
