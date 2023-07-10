import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const rootRouterConfig: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
    data: { preload: true },
  },
  {
    path: 'home/news-details/:id',
    loadChildren: () =>
      import('./news-details/news-details.module').then(
        (m) => m.NewsDetailsModule
      ),
  },
  {
    path: 'search',
    loadChildren: () =>
      import('./search/search.module').then((m) => m.SearchModule),
  },
  {
    path: 'allusers/user/:id',
    loadChildren: () =>
      import('./public-profile/public-profile.module').then(
        (m) => m.PublicProfileModule
      ),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./register/register.module').then((m) => m.RegisterModule),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./user-management/user-management.module').then(
        (m) => m.UserManagementModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(rootRouterConfig, {
      useHash: false,
    }),
  ],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
