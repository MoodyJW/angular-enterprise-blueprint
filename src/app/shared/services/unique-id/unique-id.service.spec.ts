import { TestBed } from '@angular/core/testing';

import { UniqueIdService } from './unique-id.service';

describe('UniqueIdService', () => {
  let service: UniqueIdService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UniqueIdService],
    });
    service = TestBed.inject(UniqueIdService);
    service.resetAllCounters();
  });

  describe('Service Creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
    it('should be provided in root', () => {
      expect(service).toBeDefined();
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs with default prefix', () => {
      const id1 = service.generateId();
      const id2 = service.generateId();
      expect(id1).toBe('component-1');
      expect(id2).toBe('component-2');
    });

    it('should generate unique IDs with custom prefix', () => {
      const id1 = service.generateId('input');
      const id2 = service.generateId('input');
      expect(id1).toBe('input-1');
      expect(id2).toBe('input-2');
    });

    it('should keep counters separate for different prefixes', () => {
      const id1 = service.generateId('checkbox');
      const id2 = service.generateId('input');
      expect(id1).toBe('checkbox-1');
      expect(id2).toBe('input-1');
    });
  });

  describe('resetCounter', () => {
    it('should reset a specific counter', () => {
      service.generateId('input');
      service.generateId('input');
      service.resetCounter('input');
      const id = service.generateId('input');
      expect(id).toBe('input-1');
    });
  });

  describe('resetAllCounters', () => {
    it('should reset all counters', () => {
      service.generateId('input');
      service.generateId('checkbox');
      service.resetAllCounters();
      expect(service.generateId('input')).toBe('input-1');
      expect(service.generateId('checkbox')).toBe('checkbox-1');
    });
  });
});
