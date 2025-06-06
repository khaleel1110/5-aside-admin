// update-booking.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, doc, getDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserDisplay, UsersService } from '../../../services/user.service';
import { DateComponent } from '../../date/date.component';
import { DecimalPipe, NgClass, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Timestamp } from 'firebase/firestore';

interface BookingData {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  gender?: string;
  location?: string;
  localGovernment?: string;
  address?: string;
  teamA?: string;
  teamB?: string;
  appointmentDate?: Timestamp;
  appointmentStartHour?: number;
  appointmentDuration?: number;
  amount?: number;
  paymentMethod?: string;
  cashAmount?: number;
  appointment?: string;
  phoneType?: string;
}

@Component({
  selector: 'app-update-booking',
  templateUrl: './update-booking.component.html',
  styleUrls: ['./update-booking.component.scss'],
  standalone: true,
  imports: [
    DateComponent,
    DecimalPipe,
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    NgClass
  ]
})
export class UpdateBookingComponent implements OnInit {
  private firestore = inject(Firestore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private usersService = inject(UsersService);

  userId: string | null = null;
  user: BookingData | null = null;
  isLoading = true;
  isProcessingPayment = false;
  isDeleting = false;

  profileForm!: FormGroup;

  async ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      this.userId = params.get('id');

      if (!this.userId) {
        this.router.navigate(['/admin/bookings']);
        return;
      }

      await this.loadBookingData();
    });
  }

  private async loadBookingData() {
    try {
      const docRef = doc(this.firestore, 'bookings', this.userId!);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.user = { id: docSnap.id, ...docSnap.data() } as BookingData;
        this.populateForm();
      } else {
        this.router.navigate(['/admin/bookings']);
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      alert('Failed to load booking. Please try again.');
      this.router.navigate(['/admin/bookings']);
    } finally {
      this.isLoading = false;
    }
  }

  private populateForm() {
    if (!this.user) {
      this.router.navigate(['/admin/bookings']);
      return;
    }

    const formattedDate = this.user.appointmentDate?.toDate().toISOString().split('T')[0] || '';

    this.profileForm = new FormGroup({
      firstName: new FormControl(this.user.firstName || '', Validators.required),
      lastName: new FormControl(this.user.lastName || '', Validators.required),
      email: new FormControl(this.user.email || '', [Validators.required, Validators.email]),
      phone: new FormControl(this.user.phone || ''),
      gender: new FormControl(this.user.gender || '', Validators.required),
      location: new FormControl(this.user.location || '', Validators.required),
      localGovernment: new FormControl(this.user.localGovernment || '', Validators.required),
      address: new FormControl(this.user.address || '', Validators.required),
      teamA: new FormControl(this.user.teamA || '', Validators.required),
      teamB: new FormControl(this.user.teamB || '', Validators.required),
      appointmentDate: new FormControl(formattedDate, [
        Validators.required,
        Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)
      ]),
      appointmentStartHour: new FormControl<number | null>(
        this.user.appointmentStartHour ?? null,
        Validators.required
      ),
      appointmentDuration: new FormControl<number | null>(
        this.user.appointmentDuration ?? null,
        Validators.required
      ),
      paymentMethod: new FormControl(
        this.user.paymentMethod === 'Cash/Transfer' ? 'cash' : this.user.paymentMethod || '',
        Validators.required
      ),
      cashAmount: new FormControl<number | null>({
        value: this.user.cashAmount ?? null,
        disabled: this.user.paymentMethod !== 'Cash/Transfer'
      })
    });

    this.setupPaymentMethodControls();
  }

  private setupPaymentMethodControls() {
    const paymentMethodControl = this.profileForm.get('paymentMethod');
    const cashAmountControl = this.profileForm.get('cashAmount');

    paymentMethodControl?.valueChanges.subscribe(value => {
      if (value === 'cash') {
        cashAmountControl?.enable();
        cashAmountControl?.setValidators([Validators.required, Validators.min(0)]);
      } else {
        cashAmountControl?.disable();
        cashAmountControl?.clearValidators();
        cashAmountControl?.setValue(null);
      }
      cashAmountControl?.updateValueAndValidity();
    });

    // Trigger initial validation
    paymentMethodControl?.updateValueAndValidity();
  }

  onAppointmentChange(event: { date: string; startHour: number; duration: number }) {
    this.profileForm.patchValue({
      appointmentDate: event.date,
      appointmentStartHour: event.startHour,
      appointmentDuration: event.duration
    });
  }

  async handleSubmit() {
    if (this.profileForm.invalid || !this.userId) {
      this.profileForm.markAllAsTouched();
      alert('Please fill out all required fields correctly.');
      return;
    }

    this.isProcessingPayment = true;
    const formData = this.profileForm.value;

    try {
      const updateData = this.createUpdatePayload(formData);
      await updateDoc(doc(this.firestore, `bookings/${this.userId}`), updateData);

      alert('Booking updated successfully!');
      this.router.navigate(['/admin/bookings']);
    } catch (error: any) {
      console.error('Error updating booking:', error);
      alert(`Error updating booking: ${error.message || 'Unknown error'}`);
    } finally {
      this.isProcessingPayment = false;
    }
  }

  private createUpdatePayload(formData: any): Partial<BookingData> {
    const appointmentDate = new Date(formData.appointmentDate);

    return {
      ...formData,
      appointmentDate: Timestamp.fromDate(appointmentDate),
      amount: formData.appointmentDuration * 5000,
      paymentMethod: formData.paymentMethod === 'cash' ? 'Cash/Transfer' : formData.paymentMethod,
      cashAmount: formData.paymentMethod === 'cash' ? formData.cashAmount : null,
      phoneType: this.user?.phoneType || 'Mobile'
    };
  }

  async delete() {
    if (!this.userId || !confirm('Are you sure you want to delete this booking?')) return;

    this.isDeleting = true;
    try {
      await deleteDoc(doc(this.firestore, `bookings/${this.userId}`));
      alert('Booking deleted successfully!');
      this.router.navigate(['/admin/bookings']);
    } catch (error: any) {
      console.error('Error deleting booking:', error);
      alert(`Error deleting booking: ${error.message || 'Unknown error'}`);
    } finally {
      this.isDeleting = false;
    }
  }
}
