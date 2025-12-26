import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Architecture Decision Record entity.
 */
export interface Adr {
  id: string;
  number: string;
  title: string;
  status: 'accepted' | 'deprecated' | 'superseded';
  date: string;
  summary: string;
}

/**
 * Service for fetching Architecture Decision Records.
 */
@Injectable({
  providedIn: 'root',
})
export class ArchitectureService {
  private readonly _http = inject(HttpClient);
  private readonly _metadataUrl = 'assets/data/architecture.json';
  private readonly _contentBaseUrl = 'assets/docs/';

  /**
   * Fetches all ADR metadata.
   */
  getAdrs(): Observable<Adr[]> {
    return this._http.get<Adr[]>(this._metadataUrl);
  }

  /**
   * Fetches the markdown content for a specific ADR.
   */
  getAdrContent(id: string): Observable<string> {
    return this._http.get(`${this._contentBaseUrl}${id}.md`, {
      responseType: 'text',
    });
  }
}
