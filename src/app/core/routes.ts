import {Routes} from '@angular/router';


export const routes: Routes = [



  {
    path: 'dashboard',
    loadComponent: () => import('../features/dashboards/dashboard/dashboard.component').then(_ => _.DashboardComponent),
  },
];
