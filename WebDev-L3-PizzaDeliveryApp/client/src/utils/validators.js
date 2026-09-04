export const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); export const strongPassword = (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/.test(value);
