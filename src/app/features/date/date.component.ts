
import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NgForOf, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { UserDisplay, UsersService } from '../../services/user.service';

@Component({
  selector: 'app-date',
  standalone: true,
  imports: [
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    FormsModule,
    MatSelectModule,
    NgIf,
    NgForOf
  ],
  template: `
<div class="date-time-container">
<div class="d-flex row row-cols-lg-2 row-cols-md-1">
  <div class="col-sm-6 mt-4">
    <mat-form-field appearance="fill">
      <mat-label>Choose a date</mat-label>
      <input
        matInput
        [matDatepicker]="picker"
        [(ngModel)]="selectedDate"
        (dateChange)="onDateChange()"
        required
      >
      <mat-hint>MM/DD/YYYY</mat-hint>
      <mat-error *ngIf="!selectedDate">Date is required</mat-error>
        <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
    </mat-form-field>
    <div
      *ngIf="selectedDate && selectedStartHour != null && selectedDuration != null"
      class="selected-info mt-4"
    >
      <p><strong>Selected:</strong> {{ formatSelectedDateTime() }}</p>
    </div>
  </div>

  <div class="col-sm-6">

    <div *ngIf="selectedDate" class="time-picker mt-4">
      <mat-form-field appearance="fill" class="mr-2">
        <mat-label>Start Time</mat-label>
        <mat-select
          [(ngModel)]="selectedStartHour"
          (selectionChange)="updateTime()"
          required
        >
          <mat-option
            *ngFor="let slot of timeSlots"
            [value]="slot.startHour"
            [disabled]="slot.isBooked"
          >
            {{ formatTime(slot.startHour) }}
            <span *ngIf="slot.isBooked" class="booked-badge">Booked</span>
          </mat-option>
        </mat-select>
        <mat-error *ngIf="selectedStartHour == null">Start time is required</mat-error>
      </mat-form-field>

      <mat-form-field appearance="fill">
        <mat-label>Duration (hours)</mat-label>
        <mat-select
          [(ngModel)]="selectedDuration"
          (selectionChange)="updateTime()"
          required
        >
          <mat-option
            *ngFor="let duration of availableDurations"
            [value]="duration.value"
            [disabled]="duration.isBlocked"
          >
            {{ duration.value }} {{ duration.value === 1 ? 'hour' : 'hours' }}
            <span *ngIf="duration.isBlocked" class="blocked-badge">Blocked</span>
          </mat-option>
        </mat-select>
        <mat-error *ngIf="selectedDuration == null">Duration is required</mat-error>
      </mat-form-field>
    </div>
  </div>


</div>



</div>
  `,
  styles: [`
  .date-time-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mat-form-field {
  width: 100%;
  max-width: 300px;
  margin: 16px;
}

.time-picker {
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 300px;
}

.time-picker .mat-form-field {
  width: 140px;
}

.selected-info {
  width: 100%;
  max-width: 300px;
  text-align: center;
}

.mr-2 {
  margin-right: 8px;
}

.booked-badge,
.blocked-badge {
  background-color: #dc3545;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  margin-left: 8px;
}

.mat-option.mat-option-disabled .booked-badge,
.mat-option.mat-option-disabled .blocked-badge {
  opacity: 0.7;
}
`]
})
export class DateComponent implements OnInit, OnDestroy {
  @Input() initialDate: string = '';
  @Input() initialStartHour: number | null = null;
  @Input() initialDuration: number | null = null;
  @Output() appointmentChange = new EventEmitter<{
    date: string;
    startHour: number;
    duration: number;
  }>();

  selectedDate: Date | null = null;
  selectedStartHour: number | null = null;
  selectedDuration: number | null = null;
  timeSlots: { startHour: number; isBooked: boolean }[] = Array.from(
    { length: 17 },
    (_, i) => ({
      startHour: 7 + i,
      isBooked: false
    })
  );
  availableDurations: { value: number; isBlocked: boolean }[] = [
    { value: 1, isBlocked: false },
    { value: 2, isBlocked: false },
    { value: 3, isBlocked: false },
    { value: 4, isBlocked: false },
    { value: 5, isBlocked: false },
    { value: 6, isBlocked: false }
  ];

  private subscription: Subscription | null = null;

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    // Initialize with input values
    if (this.initialDate) {
      const parsedDate = new Date(this.initialDate);
      if (!isNaN(parsedDate.getTime())) {
        this.selectedDate = parsedDate;
      } else {
        console.warn(`Invalid initialDate provided: ${this.initialDate}`);
      }
    }
    this.selectedStartHour = this.initialStartHour ?? null;
    this.selectedDuration = this.initialDuration ?? null;

    // Subscribe to users for slot availability
    this.subscription = this.usersService.futureUsers$.subscribe((users) => {
      this.updateTimeSlotAvailability(users);
      this.updateAvailableDurations(users);
      this.emitAppointment();
    });

    // Initial emit if values are set
    this.emitAppointment();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onDateChange() {
    if (this.selectedDate) {
      const users = this.usersService.userSubject.getValue();
      this.updateTimeSlotAvailability(users);
      this.updateAvailableDurations(users);
      this.updateTime();
    }
    this.emitAppointment();
  }

  updateTimeSlotAvailability(users: UserDisplay[]) {
    if (!this.selectedDate) {
      this.timeSlots.forEach(slot => (slot.isBooked = false));
      return;
    }

    const selectedDateStart = new Date(this.selectedDate);
    selectedDateStart.setHours(0, 0, 0, 0);

    this.timeSlots.forEach(slot => (slot.isBooked = false));

    users.forEach(user => {
      const booking = user.appointmentDetails;
      const bookingDate = new Date(booking.appointmentDate);
      if (isNaN(bookingDate.getTime())) {
        console.warn(`Invalid booking.appointmentDate: ${booking.appointmentDate}`);
        return;
      }
      bookingDate.setHours(0, 0, 0, 0);

      if (bookingDate.getTime() === selectedDateStart.getTime()) {
        const bookingStartHour = booking.appointmentStartHour;
        const bookingEndHour = booking.appointmentStartHour + booking.appointmentDuration;

        this.timeSlots.forEach(slot => {
          if (slot.startHour >= bookingStartHour && slot.startHour < bookingEndHour) {
            slot.isBooked = true;
          }
        });
      }
    });
  }

  updateAvailableDurations(users: UserDisplay[]) {
    if (!this.selectedDate || this.selectedStartHour === null) {
      this.availableDurations.forEach(duration => (duration.isBlocked = false));
      return;
    }

    const selectedDateStart = new Date(this.selectedDate);
    selectedDateStart.setHours(0, 0, 0, 0);
    const startTime = new Date(this.selectedDate);
    startTime.setHours(this.selectedStartHour, 0, 0, 0);

    this.availableDurations.forEach(duration => {
      duration.isBlocked = false;
      if (this.selectedDate) {
        const endTime = new Date(this.selectedDate);
        endTime.setHours(this.selectedStartHour! + duration.value, 0, 0, 0);

        users.forEach(user => {
          const booking = user.appointmentDetails;
          const bookingDate = new Date(booking.appointmentDate);
          if (isNaN(bookingDate.getTime())) {
            console.warn(`Invalid booking.appointmentDate: ${booking.appointmentDate}`);
            return;
          }
          bookingDate.setHours(0, 0, 0, 0);

          if (bookingDate.getTime() === selectedDateStart.getTime()) {
            const bookingStartTime = new Date(booking.appointmentDate);
            bookingStartTime.setHours(booking.appointmentStartHour, 0, 0, 0);

            const bookingEndTime = new Date(booking.appointmentDate);
            bookingEndTime.setHours(
              booking.appointmentStartHour + booking.appointmentDuration,
              0,
              0,
              0
            );

            if (
              (startTime < bookingEndTime && endTime > bookingStartTime) ||
              (startTime <= bookingStartTime && endTime >= bookingEndTime)
            ) {
              duration.isBlocked = true;
            }
          }
        });
      }
    });
  }

  updateTime() {
    if (
      this.selectedDate &&
      this.selectedStartHour !== null &&
      this.selectedDuration !== null
    ) {
      const updatedDate = new Date(this.selectedDate);
      updatedDate.setHours(this.selectedStartHour, 0, 0, 0);
      this.selectedDate = updatedDate;
      const users = this.usersService.userSubject.getValue();
      this.updateAvailableDurations(users);
      this.emitAppointment();
    }
  }

  formatTime(hour: number): string {
    const date = new Date();
    date.setHours(hour, 0, 0, 0);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  formatSelectedDateTime(): string {
    if (
      !this.selectedDate ||
      this.selectedStartHour === null ||
      this.selectedDuration === null
    ) {
      return '';
    }

    const startDate = new Date(this.selectedDate);
    startDate.setHours(this.selectedStartHour, 0, 0, 0);

    const endDate = new Date(this.selectedDate);
    endDate.setHours(this.selectedStartHour + this.selectedDuration, 0, 0, 0);

    const timeString =
      startDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }) +
      ' - ' +
      endDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    const dateString = startDate.toLocaleDateString([], {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });

    return `${timeString}, ${dateString}`;
  }

  private emitAppointment() {
    if (
      this.selectedDate &&
      this.selectedStartHour !== null &&
      this.selectedDuration !== null
    ) {
      this.appointmentChange.emit({
        date: this.selectedDate.toISOString().split('T')[0], // Convert to YYYY-MM-DD
        startHour: this.selectedStartHour,
        duration: this.selectedDuration
      });
    }
  }
}
