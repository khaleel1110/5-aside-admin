// form-loading.component.ts
import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card shadow-none p-3">
      <!-- Header -->
      <div class="card-header border-bottom py-4">
        <div class="shimmer" style="width: 10rem; height: 1.5rem; border-radius: 0.25rem;"></div>
      </div>

      <!-- Body -->
      <div class="card-body">
        <!-- Full Name -->
        <div class="row mb-4">
          <div class="col-sm-3">
            <div class="shimmer" style="width: 6rem; height: 1rem; border-radius: 0.25rem;"></div>
          </div>
          <div class="col-sm-9">
            <div class="input-group">
              <div class="shimmer" style="width: 100%; height: 2.5rem; border-radius: 0.25rem; margin-right: 0.5rem;"></div>
              <div class="shimmer" style="width: 100%; height: 2.5rem; border-radius: 0.25rem;"></div>
            </div>
          </div>
        </div>

        <!-- Email -->
        <div class="row mb-4">
          <div class="col-sm-3">
            <div class="shimmer" style="width: 4rem; height: 1rem; border-radius: 0.25rem;"></div>
          </div>
          <div class="col-sm-9">
            <div class="shimmer" style="width: 100%; height: 2.5rem; border-radius: 0.25rem;"></div>
          </div>
        </div>

        <!-- Phone -->
        <div class="row mb-4">
          <div class="col-sm-3">
            <div class="shimmer" style="width: 4rem; height: 1rem; border-radius: 0.25rem;"></div>
          </div>
          <div class="col-sm-9">
            <div class="shimmer" style="width: 100%; height: 2.5rem; border-radius: 0.25rem;"></div>
          </div>
        </div>

        <!-- Gender -->
        <div class="row mb-4">
          <div class="col-sm-3">
            <div class="shimmer" style="width: 4rem; height: 1rem; border-radius: 0.25rem;"></div>
          </div>
          <div class="col-sm-9">
            <div class="input-group input-group-md-down-break">
              <div class="shimmer" style="width: 6rem; height: 2.5rem; border-radius: 0.25rem; margin-right: 0.5rem;"></div>
              <div class="shimmer" style="width: 6rem; height: 2.5rem; border-radius: 0.25rem; margin-right: 0.5rem;"></div>
              <div class="shimmer" style="width: 6rem; height: 2.5rem; border-radius: 0.25rem;"></div>
            </div>
          </div>
        </div>

        <!-- Location -->
        <div class="row mb-4">
          <div class="col-sm-3">
            <div class="shimmer" style="width: 5rem; height: 1rem; border-radius: 0.25rem;"></div>
          </div>
          <div class="col-sm-9">
            <div class="shimmer" style="width: 100%; height: 2.5rem; border-radius: 0.25rem;"></div>
          </div>
        </div>

        <!-- Local Government -->
        <div class="row mb-4">
          <div class="col-sm-3">
            <div class="shimmer" style="width: 8rem; height: 1rem; border-radius: 0.25rem;"></div>
          </div>
          <div class="col-sm-9">
            <div class="shimmer" style="width: 100%; height: 2.5rem; border-radius: 0.25rem;"></div>
          </div>
        </div>

        <!-- Address -->
        <div class="row mb-4">
          <div class="col-sm-3">
            <div class="shimmer" style="width: 6rem; height: 1rem; border-radius: 0.25rem;"></div>
          </div>
          <div class="col-sm-9">
            <div class="shimmer" style="width: 100%; height: 2.5rem; border-radius: 0.25rem;"></div>
          </div>
        </div>

        <!-- Team A -->
        <div class="row mb-4">
          <div class="col-sm-3">
            <div class="shimmer" style="width: 5rem; height: 1rem; border-radius: 0.25rem;"></div>
          </div>
          <div class="col-sm-9">
            <div class="shimmer" style="width: 100%; height: 2.5rem; border-radius: 0.25rem;"></div>
          </div>
        </div>

        <!-- Team B -->
        <div class="row mb-4">
          <div class="col-sm-3">
            <div class="shimmer" style="width: 7rem; height: 1rem; border-radius: 0.25rem;"></div>
          </div>
          <div class="col-sm-9">
            <div class="shimmer" style="width: 100%; height: 2.5rem; border-radius: 0.25rem;"></div>
          </div>
        </div>

        <!-- Appointment Date & Time -->
        <div class="row mb-4">
          <div class="col-sm-3">
            <div class="shimmer" style="width: 10rem; height: 1rem; border-radius: 0.25rem;"></div>
          </div>
          <div class="col-sm-9">
            <div class="shimmer" style="width: 100%; height: 2.5rem; border-radius: 0.25rem;"></div>
          </div>
        </div>

        <!-- Payment Amount Display -->
        <div class="row mb-4">
          <div class="col-sm-3">
            <div class="shimmer" style="width: 6rem; height: 1rem; border-radius: 0.25rem;"></div>
          </div>
          <div class="col-sm-9">
            <div class="shimmer" style="width: 12rem; height: 1rem; border-radius: 0.25rem;"></div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="card-footer align-items-center justify-content-center">
        <div class="shimmer" style="width: 8rem; height: 2.5rem; border-radius: 0.25rem;"></div>
      </div>
    </div>
  `,
  styles: [
    `
      .card {
        position: relative;
        z-index: 1;
      }
      .shimmer {
        background: #f6f7f8;
        background-image: linear-gradient(
          to right,
          #f6f7f8 0%,
          #edeef1 20%,
          #f6f7f8 40%,
          #f6f7f8 100%
        );
        background-size: 800px 104px;
        animation: shimmer 1.5s infinite linear;
        position: relative;
      }
      @keyframes shimmer {
        0% {
          background-position: -468px 0;
        }
        100% {
          background-position: 468px 0;
        }
      }
    `
  ]
})
export class FormLoadingComponent {
  @Input() showTabsSection: boolean = false;
}
