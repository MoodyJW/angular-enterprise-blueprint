import { Routes } from '@angular/router';
import { provideMarkdown } from 'ngx-markdown';

export const ARCHITECTURE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./architecture.component').then((m) => m.ArchitectureComponent),
    title: 'Architecture Decisions | Enterprise Blueprint',
    providers: [
      provideMarkdown(), // Only loaded when architecture route is accessed
    ],
  },
  {
    path: ':id',
    loadComponent: () => import('./viewer/adr-viewer.component').then((m) => m.AdrViewerComponent),
    title: 'ADR Details | Enterprise Blueprint',
  },
];
