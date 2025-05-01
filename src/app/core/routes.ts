import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('../features/dashboards/dashboard/dashboard.component').then(_ => _.DashboardComponent)
  },
  {
    path: 'booking',
    loadComponent: () => import('../features/booking/booking-list/booking-list.component').then(_ => _.BookingListComponent)
  },  {
    path: 'add-booking',
    loadComponent: () => import('../features/booking/add-booking/add-booking.component').then(_ => _.AddBookingComponent)
  },
  {
    path: 'bio/:id',
    loadComponent: () => import("../features/booking/update-booking/update-booking.component").then(m => m.UpdateBookingComponent)
  },
  // Add a catch-all route
  { path: '**', redirectTo: 'dashboard' }
];
