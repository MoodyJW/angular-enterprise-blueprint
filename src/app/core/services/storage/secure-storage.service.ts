import { inject, Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';

/**
 * Service for securely storing data in the browser's sessionStorage.
 *
 * It uses {@link CryptoService} to encrypt values before writing to storage
 * and decrypt them upon retrieval.
 *
 * Security Benefits:
 * 1. Data at rest (in browser storage) is obfuscated/encrypted.
 * 2. Using sessionStorage means data is cleared when the tab/window is closed,
 *    reducing the attack window compared to localStorage.
 */
@Injectable({ providedIn: 'root' })
export class SecureStorageService {
  private readonly _crypto = inject(CryptoService);

  /**
   * Encrypt and store a value in sessionStorage.
   *
   * @param key The storage key
   * @param value The value to store
   */
  setItem(key: string, value: string): void {
    const encrypted = this._crypto.encrypt(value);
    sessionStorage.setItem(key, encrypted);
  }

  /**
   * Retrieve and decrypt a value from sessionStorage.
   *
   * @param key The storage key
   * @returns The decrypted value or null if not found
   */
  getItem(key: string): string | null {
    const encrypted = sessionStorage.getItem(key);
    if (encrypted === null) {
      return null;
    }
    return this._crypto.decrypt(encrypted);
  }

  /**
   * Remove an item from sessionStorage.
   *
   * @param key The storage key
   */
  removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  /**
   * Clear all items from sessionStorage.
   */
  clear(): void {
    sessionStorage.clear();
  }
}
