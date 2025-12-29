import { TestBed } from '@angular/core/testing';
import { CryptoService } from './crypto.service';

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CryptoService],
    });
    service = TestBed.inject(CryptoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('encrypt', () => {
    it('should return empty string if value is empty', () => {
      expect(service.encrypt('')).toBe('');
    });

    it('should encrypt a value', () => {
      const original = 'test-value';
      const encrypted = service.encrypt(original);

      expect(encrypted).toBeTruthy();
      expect(encrypted).not.toBe(original);
      // specific to the Base64 implementation
      expect(() => atob(encrypted)).not.toThrow();
    });

    it('should produce different outputs for different inputs', () => {
      const val1 = service.encrypt('value1');
      const val2 = service.encrypt('value2');
      expect(val1).not.toBe(val2);
    });
  });

  describe('decrypt', () => {
    it('should return empty string if value is empty', () => {
      expect(service.decrypt('')).toBe('');
    });

    it('should decrypt an encrypted value back to original', () => {
      const original = 'secret-message';
      const encrypted = service.encrypt(original);
      const decrypted = service.decrypt(encrypted);

      expect(decrypted).toBe(original);
    });

    it('should return empty string if decryption fails (invalid base64)', () => {
      // 'not-base-64!' might be valid base64 depending on implementation, but likely garbage.
      // atob throws on invalid char.
      const invalid = '!!!not-base64!!!';
      const result = service.decrypt(invalid);
      expect(result).toBe('');
    });
  });

  describe('key generation', () => {
    it('should use consistent key for the same service instance', () => {
      const val = 'test';
      const enc1 = service.encrypt(val);
      const enc2 = service.encrypt(val);
      expect(enc1).toBe(enc2);
    });

    it('should use different keys for different service instances (session scopes)', () => {
      // 1. Encrypt with first instance
      const val = 'test';
      const enc1 = service.encrypt(val);

      // 2. Create new instance (simulating refresh/new session)
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({ providers: [CryptoService] });
      const newService = TestBed.inject(CryptoService);

      // 3. Encrypt same value
      const enc2 = newService.encrypt(val);

      // 4. They should likely be different because randomUUID key changes
      // NOTE: This test statistically passes (random UUID collision is negligible)
      expect(enc1).not.toBe(enc2);

      // 5. Verify cross-instance decryption fails (or produces garbage)
      // Decrypting enc1 with newService should not result in 'test'
      const decCross = newService.decrypt(enc1);
      expect(decCross).not.toBe(val);
    });
  });
});
