import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-modal-content',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
<div class="card card">
<div class="profile-cover">
<div style="height: 110px" class="profile-cover-img-wrapper">
<img class="profile-cover-img" src="/assets/img/1920x400/img2.jpg" alt="Image Description">
  </div>
  </div>
  <!-- End Profile Cover -->

  <!-- Avatar -->
  <div class="avatar avatar-xl avatar-circle avatar-border-xl mt-n6 profile-cover-avatar">
<div class="avatar-soft-dark avatar-circle align-items-center mx-n1 mt-n1 justify-content-center">
<span class="avatar-initials">{{ user.appointmentDetails.firstName ? user.appointmentDetails.firstName.substring(0, 2).toUpperCase() : 'UN' }}</span>
</div>
</div>

<!-- Body -->
  <div class="card-body">
    <dl class="row">
      <dt class="col-sm-5 text-sm-end">Full Name:</dt>
      <dd class="col-sm-6 mx-3">{{ user.fullName }}</dd>

      <dt class="col-sm-5 text-sm-end">Email:</dt>
      <dd class="col-sm-6 mx-3">{{ user.appointmentDetails.email }}</dd>

      <dt class="col-sm-5 text-sm-end">ID:</dt>
      <dd class="col-sm-6 mx-3">{{ user.appointmentDetails.id }}</dd>

      <dt class="col-sm-5 text-sm-end">Phone:</dt>
      <dd class="col-sm-6 mx-3">{{ user.appointmentDetails.phone || '-' }}</dd>

      <dt class="col-sm-5 text-sm-end">Appointment:</dt>
      <dd class="col-sm-6 mx-3">{{ user.appointmentDetails.appointment }}</dd>

      <dt class="col-sm-5 text-sm-end">Appointment Date:</dt>
      <dd class="col-sm-6 mx-3">
        {{ user.appointmentDetails.appointmentDate | date: 'medium' }}
      </dd>

      <dt class="col-sm-5 text-sm-end">Location:</dt>
      <dd class="col-sm-6 mx-3">{{ user.appointmentDetails.location }}</dd>

      <dt class="col-sm-5 text-sm-end">Local Government:</dt>
      <dd class="col-sm-6 mx-3">{{ user.appointmentDetails.localGovernment || '-' }}</dd>

      <dt class="col-sm-5 text-sm-end">Address:</dt>
      <dd class="col-sm-6 mx-3">{{ user.appointmentDetails.address || '-' }}</dd>

      <dt class="col-sm-5 text-sm-end">Amount:</dt>
      <dd class="col-sm-6 mx-3 "> ₦ {{ user.appointmentDetails.amount | currency }}</dd>

      <dt class="col-sm-5 text-sm-end">Payment Reference:</dt>
      <dd class="col-sm-6 mx-3">{{ user.appointmentDetails.paymentReference || '-' }}</dd>

<!--      <dt class="col-sm-5 text-sm-end">Team A:</dt>
      <dd class="col-sm-6 mx-3">{{ user.appointmentDetails.teamA || '-' }}</dd>

      <dt class="col-sm-5 text-sm-end">Team B:</dt>
      <dd class="col-sm-6 mx-3">{{ user.appointmentDetails.teamB || '-' }}</dd>-->
      <dt class="col-sm-5 text-sm-end">Match:</dt>
      <dd class="col-sm-6 mx-3">{{ user.appointmentDetails.teamA || '-' }} Vs {{ user.appointmentDetails.teamB || '-' }}</dd>

    </dl>
  </div>
<!-- End Body -->

<!-- Footer -->
<div class="card-footer d-sm-flex align-items-sm-center">
<button
  type="button"
class="btn btn-ghost-secondary mb-2 mb-sm-0"
(click)="activeModal.dismiss('Cancel')"
>
<i class="bi-chevron-left"></i> Cancel
  </button>
  <div class="ms-auto">
<button
  type="button"
class="btn btn-white me-2"
  [routerLink]="['/admin/bio', user.id]"
  (click)="activeModal.close('Update')"
>
<i class="bi-pencil-fill me-1"></i> Update
  </button>
  </div>
  </div>
  <!-- End Footer -->
  </div>
    `,
  styles: [`
    .card {
  max-width: 600px;
  margin: 0 auto;
}
.profile-cover {
  height: 120px;
}
.profile-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.avatar.avatar-lg {
  width: 80px;
  height: 80px;
  font-size: 1.2rem;
}
.profile-cover-avatar {
  margin-top: -40px;
}
.card-body {
  padding: 1.5rem;
  font-size: 0.9rem;
}
.card-footer {
  padding: 1rem;
}
.btn {
  font-size: 0.85rem;
  padding: 0.3rem 0.6rem;
}
dl.row {
  margin-bottom: 0;
}
dt, dd {
  padding: 0.3rem 0;
}
`]
})
export class ModalContentComponent {
  @Input() user: any = {};
  constructor(public activeModal: NgbActiveModal) {}
}
