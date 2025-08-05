
import { Component, inject, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe, NgClass, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DateComponent } from '../../date/date.component';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { NgbDropdown, NgbDropdownAnchor, NgbDropdownItem, NgbDropdownMenu } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TableLoadingComponent } from '../../table-loading/table-loading.component';
import { UsersService } from '../../../services/user.service';
import { FormLoadingComponent } from '../../form-loading/form-loading.component';

@Component({
  selector: 'app-add-booking',
  standalone: true,
  imports: [
    DateComponent,
    DecimalPipe,
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    NgClass,
    DatePipe,
    NgbDropdown,
    NgbDropdownAnchor,
    NgbDropdownItem,
    NgbDropdownMenu,
    RouterLink,
    RouterLinkActive,
    TableLoadingComponent,
    FormLoadingComponent
  ],
  templateUrl: './add-booking.component.html',
  styleUrls: ['./add-booking.component.scss']
})
export class AddBookingComponent implements OnInit {
  private firestore = inject(Firestore);
  private router = inject(Router);
  protected userServices = inject(UsersService);
  profileForm: FormGroup;
  appointmentData: { date: string; startHour: number; duration: number } | null = null;
  isProcessingPayment = false;

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      gender: ['', Validators.required],
      location: ['', Validators.required],
      localGovernment: ['', Validators.required],
      address: ['', Validators.required],
      teamA: ['', Validators.required],
      teamB: ['', Validators.required],
      appointmentDate: ['', [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]],
      appointmentStartHour: [null, Validators.required],
      appointmentDuration: [null, Validators.required],
      paymentMethod: ['', Validators.required],
      cashAmount: [{ value: null, disabled: true }, [Validators.min(0)]]
    });

    // Enable/disable cashAmount based on paymentMethod
    this.profileForm.get('paymentMethod')?.valueChanges.subscribe(value => {
      const cashAmountControl = this.profileForm.get('cashAmount');
      const duration = this.profileForm.get('appointmentDuration')?.value;
      if (value === 'cash') {
        cashAmountControl?.enable();
        cashAmountControl?.setValidators([Validators.required, Validators.min(0)]);
        if (duration) {
          cashAmountControl?.setValue(duration * 5000);
        }
      } else {
        cashAmountControl?.disable();
        cashAmountControl?.clearValidators();
        cashAmountControl?.setValue(null);
      }
      cashAmountControl?.updateValueAndValidity();
    });

    // Update cashAmount when appointmentDuration changes, if paymentMethod is cash
    this.profileForm.get('appointmentDuration')?.valueChanges.subscribe(duration => {
      const paymentMethod = this.profileForm.get('paymentMethod')?.value;
      if (paymentMethod === 'cash' && duration) {
        this.profileForm.get('cashAmount')?.setValue(duration * 5000);
      }
    });
  }

  ngOnInit() {
    // Preload Paystack script
    this.loadPaystack();
  }

  onAppointmentChange(data: { date: string; startHour: number; duration: number }) {
    this.appointmentData = data;
    this.profileForm.patchValue({
      appointmentDate: data.date,
      appointmentStartHour: data.startHour,
      appointmentDuration: data.duration
    });
  }

  private formatAppointment(): string {
    if (!this.appointmentData) return '';

    const { date, startHour, duration } = this.appointmentData;
    const startDate = new Date(date);
    const adjustedStartHour = startHour % 24;
    startDate.setHours(adjustedStartHour, 0, 0, 0);

    const endDate = new Date(date);
    const endHour = (startHour + duration) % 24;
    const endDayOffset = Math.floor((startHour + duration) / 24);
    endDate.setDate(endDate.getDate() + endDayOffset);
    endDate.setHours(endHour, 0, 0, 0);

    const timeString =
      startDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }) +
      ' - ' +
      endDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    const dateString = startDate.toLocaleDateString([], { month: '2-digit', day: '2-digit', year: 'numeric' });

    return `${timeString}, ${dateString}`;
  }

  async handleSubmit() {
    if (this.isProcessingPayment) return;

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      alert('Form is invalid. Please check your input.');
      return;
    }

    this.isProcessingPayment = true;

    try {
      const paymentMethod = this.profileForm.get('paymentMethod')?.value;
      const duration = this.profileForm.get('appointmentDuration')?.value;

      if (!duration || duration < 1 || duration > 8) {
        alert('Invalid duration. Please select 1 to 8 hours.');
        this.isProcessingPayment = false;
        return;
      }

      if (paymentMethod === 'card') {
        if (typeof window['PaystackPop'] === 'undefined') {
          alert('Paystack is not loaded. Please check your internet connection and try again.');
          this.isProcessingPayment = false;
          return;
        }

        const amount = duration * 5000 * 100; // 5000 NGN per hour, converted to kobo
        const reference = `ref-${Math.ceil(Math.random() * 10e13)}`;

        const handler = window['PaystackPop'].setup({
          key: environment.paystackPublicKey,
          email: this.profileForm.get('email')?.value,
          amount: amount,
          ref: reference,
          onClose: () => {
            alert('Payment cancelled.');
            this.isProcessingPayment = false;
          },
          callback: (response: { reference: string; [key: string]: any }) => {
            this.saveBooking(response.reference, amount / 100, 'card');
          }
        });

        handler.openIframe();
      } else if (paymentMethod === 'cash') {
        const cashAmount = this.profileForm.get('cashAmount')?.value;
        if (!cashAmount || cashAmount <= 0) {
          alert('Please enter a valid amount for cash/transfer payment.');
          this.isProcessingPayment = false;
          return;
        }

        const reference = `cash-ref-${Math.ceil(Math.random() * 10e13)}`;
        this.saveBooking(reference, cashAmount, 'cash');
      }
    } catch (error) {
      console.error('Error processing booking:', error);
      this.isProcessingPayment = false;
      alert('An error occurred while processing the booking. Please try again.');
    }
  }

  private loadPaystack(): Promise<void> {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => resolve();
      document.head.appendChild(script);
    });
  }

  private async saveBooking(reference: string, amount: number, paymentMethod: string) {
    const formData = this.profileForm.value as {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      gender: string;
      location: string;
      localGovernment: string;
      address: string;
      teamA: string;
      teamB: string;
      appointmentDate: string;
      appointmentStartHour: number;
      appointmentDuration: number;
      paymentMethod: string;
      cashAmount: number | null;
    };

    const bookingData = {
      fullName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      status: 'Completed',
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || '',
        gender: formData.gender,
        location: formData.location,
        localGovernment: formData.localGovernment,
        address: formData.address,
        teamA: formData.teamA,
        teamB: formData.teamB,
        appointmentDate: formData.appointmentDate,
        appointmentStartHour: formData.appointmentStartHour,
        appointmentDuration: formData.appointmentDuration,
        amount: formData.appointmentDuration * 5000,
      paymentMethod: paymentMethod === 'cash' ? 'Cash/Transfer' : 'Card',
      cashAmount: paymentMethod === 'cash' ? formData.cashAmount : null,
      paymentReference: reference,
      appointment: this.formatAppointment()
    };

    const emailData = { ...bookingData };

    try {
      const userCollection = collection(this.firestore, 'bookings');
      const [firestoreResult, emailResult] = await Promise.all([
        addDoc(userCollection, bookingData),
        this.http.post('http://localhost:3000/send-booking-email', emailData).toPromise()
      ]);

      alert('Booking successful! A confirmation has been sent to your email.');
      this.profileForm.reset();
      this.appointmentData = null;
      this.router.navigate(['/admin/bookings']);
    } catch (error) {
      console.error('Error processing booking:', error);
      alert('Booking was successful but we couldn\'t send the confirmation email. Please contact support with reference: ' + reference);
    } finally {
      this.isProcessingPayment = false;
    }
  }
}
