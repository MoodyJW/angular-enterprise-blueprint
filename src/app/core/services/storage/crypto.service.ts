import { Injectable } from '@angular/core';

/**
 * Service for handling encryption and decryption of sensitive data.
 *
 * NOTE: IN A REAL PRODUCTION APP, YOU SHOULD USE A MORE ROBUST LIBRARY
 * OR WEB CRYPTO API IF HIGH SECURITY IS REQUIRED CLIENT-SIDE.
 *
 * For this demo/blueprint, we are using simple Base64/XOR as a placeholder
 * to demonstrate the pattern of encrypting data before storage.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API
 */
@Injectable({ providedIn: 'root' })
export class CryptoService {
  /**
   * Session-specific key for "encryption".
   * This ensures data from one session (page load) cannot be read by another
   * if the user closes and reopens the browser.
   */
  private readonly _key = this._generateKey();

  /**
   * Encrypt a string value.
   *
   * @param value The plaintext value to encrypt
   * @returns The encrypted string (base64 encoded)
   */
  encrypt(value: string): string {
    if (value === '') {
      return '';
    }
    // Simple XOR with key for demo purposes
    // In production, use Web Crypto API (AES-GCM)
    const xor = this._xor(value, this._key);
    return btoa(xor);
  }

  /**
   * Decrypt an encrypted string value.
   *
   * @param encrypted The encrypted value (base64 encoded)
   * @returns The decrypted plaintext value
   */
  decrypt(encrypted: string): string {
    if (encrypted === '') {
      return '';
    }
    try {
      const xor = atob(encrypted);
      return this._xor(xor, this._key);
    } catch {
      console.warn('CryptoService: Failed to decrypt value. Returning empty string.');
      return '';
    }
  }

  /**
   * Generates a random session key.
   */
  private _generateKey(): string {
    return crypto.randomUUID();
  }

  /**
   * Simple XOR obfuscation.
   */
  private _xor(value: string, key: string): string {
    return value
      .split('')
      .map((char, i) => {
        return String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length));
      })
      .join('');
  }
}
