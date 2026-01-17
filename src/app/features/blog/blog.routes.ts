import { Routes } from '@angular/router';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogStore } from './blog.store';

export const routes: Routes = [
  {
    path: '',
    component: BlogListComponent,
    providers: [BlogStore],
  },
  {
    path: ':slug',
    component: BlogDetailComponent,
  },
];
