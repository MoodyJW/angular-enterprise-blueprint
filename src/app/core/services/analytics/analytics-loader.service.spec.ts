import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AnalyticsLoaderService } from './analytics-loader.service';

describe('AnalyticsLoaderService', () => {
  let service: AnalyticsLoaderService;
  let mockDocument: {
    createElement: ReturnType<typeof vi.fn>;
    head: { appendChild: ReturnType<typeof vi.fn> };
  };
  let mockScript: {
    src: string;
    async: boolean;
    setAttribute: ReturnType<typeof vi.fn>;
    onload: (() => void) | null;
    onerror: (() => void) | null;
  };

  beforeEach(() => {
    mockScript = {
      src: '',
      async: false,
      setAttribute: vi.fn(),
      onload: null,
      onerror: null,
    };

    mockDocument = {
      createElement: vi.fn().mockReturnValue(mockScript),
      head: { appendChild: vi.fn() },
    };

    TestBed.configureTestingModule({
      providers: [AnalyticsLoaderService, { provide: DOCUMENT, useValue: mockDocument }],
    });

    service = TestBed.inject(AnalyticsLoaderService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('loadScript', () => {
    it('should create and append script with correct src', async () => {
      const src = 'https://example.com/analytics.js';
      const loadPromise = service.loadScript(src);

      expect(mockDocument.createElement).toHaveBeenCalledWith('script');
      expect(mockScript.src).toBe(src);
      expect(mockScript.async).toBe(true);
      expect(mockDocument.head.appendChild).toHaveBeenCalledWith(mockScript);

      // Simulate success
      mockScript.onload?.();
      await expect(loadPromise).resolves.toBeUndefined();
    });

    it('should set nonce if provided', () => {
      const src = 'https://example.com/analytics.js';
      const nonce = 'random-nonce-value';

      void service.loadScript(src, nonce);

      expect(mockScript.setAttribute).toHaveBeenCalledWith('nonce', nonce);
    });

    it('should reject promise on script load error', async () => {
      const src = 'https://example.com/analytics.js';
      const loadPromise = service.loadScript(src);

      // Simulate error
      mockScript.onerror?.();

      await expect(loadPromise).rejects.toThrow(`Failed to load script: ${src}`);
    });
  });
});
