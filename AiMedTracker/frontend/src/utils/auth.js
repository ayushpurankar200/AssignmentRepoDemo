// src/utils/auth.js

export function getStoredUsers() {
    const raw = localStorage.getItem('users');
    return raw ? JSON.parse(raw) : {};
  }
  
  export function saveStoredUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
  }
  