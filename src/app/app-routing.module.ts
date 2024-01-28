import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./gallery/gallery-view/gallery-view.module').then( m => m.GalleryViewPageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'detail-view',
    loadChildren: () => import('./gallery/detail-view/detail-view.module').then( m => m.DetailViewPageModule)
  },
  {
    path: 'add-new',
    loadChildren: () => import('./gallery/add-new/add-new.module').then( m => m.AddNewPageModule)
  },
  // {
  //   path: 'gallery-view',
  //   loadChildren: () => import('./gallery/gallery-view/gallery-view.module').then( m => m.GalleryViewPageModule)
  // },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
