import {Routes} from '@angular/router';
import {AuthGuard, redirectLoggedInTo, redirectUnauthorizedTo} from "@angular/fire/auth-guard";

const redirectLoggedInToAdmin = () => redirectLoggedInTo(['/admin']);
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/authentication']);
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/authentication',
  },
  {
    path: 'authentication',
    loadComponent: () => import('./features/authentication/login/login.component').then(_ => _.LoginComponent),
    canActivate: [AuthGuard], data: {authGuardPipe: redirectLoggedInToAdmin}
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./features/authentication/sign-up/sign-up.component').then(_ => _.SignUpComponent),

  },  {
    path: 'forget-password',
    loadComponent: () => import('./features/authentication/forgot-password/forgot-password.component').then(_ => _.ForgotPasswordComponent),

  },

  {
    path: 'admin',
    loadComponent: () => import('./core/layout/layout.component').then(_ => _.LayoutComponent),
    loadChildren: () => import('./core/routes').then(_ => _.routes),
    canActivate: [AuthGuard], data: {authGuardPipe: redirectUnauthorizedToLogin}
  },
/*  {
    path: '**',
    loadComponent: () => import('./features/system/access-denied-forbidden-403/access-denied-forbidden-403.component').then(_ => _.AccessDeniedForbidden403Component)
  },*/

];
