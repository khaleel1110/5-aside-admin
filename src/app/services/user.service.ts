import { inject, Injectable, DestroyRef } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { BehaviorSubject, map, Observable, interval } from 'rxjs';
import { Timestamp } from 'firebase/firestore';
import { toSignal } from '@angular/core/rxjs-interop';

export interface Status {
  value: 'Played' | 'On Progress' | 'To Do';
}

export interface AppointmentDetails {
  id: string;
  address: string;
  amount: number;
  appointment: string;
  appointmentDate: Date;
  appointmentDuration: number;
  appointmentStartHour: number;
  email: string;
  firstName: string;
  gender: string;
  lastName: string;
  localGovernment: string;
  location: string;
  event: string;
  paymentReference: string;
  phone: string;
  phoneType: string;
  teamA: string;
  teamB: string;
}

export interface UserDisplay {
  id: string;
  fullName: string;
  email: string;
  position: string;
  country: string;
  status: Status['value'];
  role: string;
  event: string;
  phone?: string;
  organization?: string;
  department?: string;
  accountType?: string;
  city?: string;
  addressLine1?: string;
  zipCode?: string;
  appointmentDetails: AppointmentDetails;
  paymentMethod?: string; // Added
  cashAmount?: number; // Added
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private firestore = inject(Firestore);
  private destroyRef = inject(DestroyRef);
  private isLoadingSubject = new BehaviorSubject<boolean>(true);
  public isLoading = toSignal(this.isLoadingSubject.asObservable(), { initialValue: true });

  userSubject = new BehaviorSubject<UserDisplay[]>([]);
  users$ = this.userSubject.asObservable();

  todayUsers$: Observable<UserDisplay[]> = this.users$.pipe(
    map((users) =>
      users.filter((user) => {
        try {
          const appointmentDate = user.appointmentDetails.appointmentDate;
          if (isNaN(appointmentDate.getTime())) return false;
          const today = new Date();
          const todayString = today.toISOString().split('T')[0];
          const appointmentDateString = appointmentDate.toISOString().split('T')[0];
          return appointmentDateString === todayString;
        } catch {
          return false;
        }
      })
    )
  );

  futureUsers$: Observable<UserDisplay[]> = this.users$.pipe(
    map((users) =>
      users.filter((user) => {
        try {
          const appointmentDate = user.appointmentDetails.appointmentDate;
          if (isNaN(appointmentDate.getTime())) return false;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return appointmentDate >= today;
        } catch {
          return false;
        }
      })
    )
  );

  constructor() {
    const userCollection = collection(this.firestore, 'bookings');

    const subscription = collectionData(userCollection, { idField: 'id' })
      .pipe(
        map((data: any[]) =>
          data.map((item) => {
            const appointmentDetails: AppointmentDetails = {
              id: item.id,
              address: item.address || '',
              amount: item.amount || 0,
              appointment: item.appointment || 'Unknown',
              appointmentDate: item.appointmentDate instanceof Timestamp
                ? item.appointmentDate.toDate()
                : item.appointmentDate
                  ? new Date(item.appointmentDate)
                  : new Date(),
              appointmentDuration: item.appointmentDuration || 0,
              appointmentStartHour: item.appointmentStartHour || 0,
              email: item.email || 'N/A',
              firstName: item.firstName || '',
              gender: item.gender || '',
              event: item.event || '',
              lastName: item.lastName || '',
              localGovernment: item.localGovernment || '',
              location: item.location || 'Unknown',
              paymentReference: item.paymentReference || '',
              phone: item.phone || '',
              phoneType: item.phoneType || '',
              teamA: item.teamA || '',
              teamB: item.teamB || '',
            };

            const status = this.calculateStatus(appointmentDetails);

            return {
              id: item.id,
              fullName: `${item.firstName || ''} ${item.lastName || ''}`.trim() || 'Unknown',
              email: item.email || 'N/A',
              position: item.appointment || 'Unknown',
              country: item.location || 'Unknown',
              status,
              role: 'Staff',
              phone: item.phone,
              organization: 'Htmlstream',
              department: '',
              accountType: 'Individual',
              city: item.localGovernment || '',
              addressLine1: item.address || '',
              zipCode: '',
              appointmentDetails,
            } as UserDisplay;
          })
        )
      )
      .subscribe({
        next: (users: UserDisplay[]) => {
          this.userSubject.next(users);
          this.isLoadingSubject.next(false);
        },
        error: (error: any) => {
          console.error('Error fetching bookings:', error);
          this.userSubject.next([]);
          this.isLoadingSubject.next(false);
        },
      });

    const statusUpdateSubscription = interval(60000).subscribe(() => {
      const currentUsers = this.userSubject.getValue();
      const updatedUsers = currentUsers.map((user) => ({
        ...user,
        status: this.calculateStatus(user.appointmentDetails),
      }));
      this.userSubject.next(updatedUsers);
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
      statusUpdateSubscription.unsubscribe();
    });
  }

  private calculateStatus(details: AppointmentDetails): Status['value'] {
    const now = new Date();
    const appointmentDate = new Date(details.appointmentDate);

    appointmentDate.setHours(details.appointmentStartHour, 0, 0, 0);

    const appointmentEnd = new Date(appointmentDate);
    appointmentEnd.setHours(details.appointmentStartHour + details.appointmentDuration);

    if (now > appointmentEnd) {
      return 'Played';
    } else if (now >= appointmentDate && now <= appointmentEnd) {
      return 'On Progress';
    } else {
      return 'To Do';
    }
  }
}
