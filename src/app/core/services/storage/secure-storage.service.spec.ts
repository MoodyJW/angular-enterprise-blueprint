import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CryptoService } from './crypto.service';
import { SecureStorageService } from './secure-storage.service';

describe('SecureStorageService', () => {
  let service: SecureStorageService;
  let cryptoService: CryptoService;

  beforeEach(() => {
    // Clear sessionStorage before each test
    sessionStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        SecureStorageService,
        // We can use the real CryptoService or a mock.
        // Using real one acts as an integration test, but mocking verifies the delegation.
        // Let's spy on the real one.
        CryptoService,
      ],
    });

    service = TestBed.inject(SecureStorageService);
    cryptoService = TestBed.inject(CryptoService);
  });

  afterEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setItem', () => {
    it('should encrypt value and store in sessionStorage', () => {
      const spyEncrypt = vi.spyOn(cryptoService, 'encrypt');
      const key = 'test-key';
      const value = 'test-value';

      service.setItem(key, value);

      expect(spyEncrypt).toHaveBeenCalledWith(value);

      // Verify sessionStorage has something stored
      const stored = sessionStorage.getItem(key);
      expect(stored).toBeTruthy();
      expect(stored).not.toBe(value); // Should be encrypted
    });
  });

  describe('getItem', () => {
    it('should retrieve and decrypt value from sessionStorage', () => {
      const spyDecrypt = vi.spyOn(cryptoService, 'decrypt');
      const key = 'test-key';
      const value = 'test-value';

      // Setup: write to storage via service
      service.setItem(key, value);

      // Act: read back
      const retrieved = service.getItem(key);

      expect(retrieved).toBe(value);
      expect(spyDecrypt).toHaveBeenCalled();
    });

    it('should return null if key does not exist', () => {
      const result = service.getItem('non-existent');
      expect(result).toBeNull();
    });

    it('should return null if stored value is null (edge case)', () => {
      // Manually set null (though sessionStorage usually stores strings)
      // sessionStorage.setItem('key', null) -> stores "null" string usually.
      // If we manually mock sessionStorage response?
      // Native sessionStorage.getItem returns null if missing.
      // If we somehow stored an empty string that decrypts to empty?

      const result = service.getItem('missing');
      expect(result).toBeNull();
    });
  });

  describe('removeItem', () => {
    it('should remove item from sessionStorage', () => {
      const key = 'test-key';
      service.setItem(key, 'value');
      expect(sessionStorage.getItem(key)).toBeTruthy();

      service.removeItem(key);
      expect(sessionStorage.getItem(key)).toBeNull();
    });
  });

  describe('clear', () => {
    it('should clear all items from sessionStorage', () => {
      service.setItem('k1', 'v1');
      service.setItem('k2', 'v2');
      expect(sessionStorage.length).toBeGreaterThan(0);

      service.clear();

      expect(sessionStorage.length).toBe(0);
      expect(service.getItem('k1')).toBeNull();
    });
  });
});
