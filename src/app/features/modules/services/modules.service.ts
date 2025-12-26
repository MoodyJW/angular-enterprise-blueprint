import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

/**
 * Module entity representing a reference module in the catalog.
 */
export interface Module {
  id: string;
  title: string;
  description: string;
  category: 'state-management' | 'security' | 'ui' | 'infrastructure';
  status: 'production' | 'beta' | 'experimental';
  tags: string[];
  repoUrl: string | null;
  demoUrl: string | null;
  features: string[];
  techStack: string[];
}

/**
 * Service for fetching module data from the mock API.
 */
@Injectable({
  providedIn: 'root',
})
export class ModulesService {
  private readonly _http = inject(HttpClient);
  private readonly _dataUrl = 'assets/data/modules.json';

  /**
   * Fetches all modules from the data source.
   */
  getModules(): Observable<Module[]> {
    return this._http.get<Module[]>(this._dataUrl);
  }

  /**
   * Fetches a single module by its ID.
   * Returns undefined if the module is not found.
   */
  getModuleById(id: string): Observable<Module | undefined> {
    return this.getModules().pipe(map((modules) => modules.find((m) => m.id === id)));
  }
}
