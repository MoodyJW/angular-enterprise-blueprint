import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AnalyticsLoaderService {
  private readonly document = inject(DOCUMENT);

  loadScript(src: string, nonce?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = this.document.createElement('script');
      script.src = src;
      script.async = true;
      if (nonce !== undefined) {
        script.setAttribute('nonce', nonce);
      }

      script.onload = () => {
        resolve();
      };
      script.onerror = () => {
        reject(new Error(`Failed to load script: ${src}`));
      };

      this.document.head.appendChild(script);
    });
  }
}
