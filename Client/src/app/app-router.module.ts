import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './Components/auth/signup/signup.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { CloudComponent } from './Components/cloud/cloud.component';
import { AuthGuard } from './components/auth/auth.guard';
import { ProfileComponent } from './components/cloud/profile/profile.component';
import { RootComponent } from './components/cloud/root/root.component';
import { CloudResolver } from './components/cloud/cloud.resolver';
import { FolderComponent } from './components/cloud/folder/folder.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [AuthGuard] },
  { path: 'not-found', component: NotFoundComponent },
  {
    path: 'cloud',
    component: CloudComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: RootComponent,
        pathMatch: 'full',
        resolve: { cloud: CloudResolver },
      },
      {
        path: 'setting',
        component: ProfileComponent,
      },
      {
        path: 'folder/:id',
        component: FolderComponent,
      },
    ],
  },
  { path: '**', redirectTo: 'not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRouterModule {}
