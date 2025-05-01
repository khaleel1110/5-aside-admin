// table-loading.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card shadow-none p-3">
      <!-- Header -->
      <div class="card-header card-header-content-md-between">
        <div class="mb-2 mb-md-0">
          <!-- Search Bar Placeholder -->
          <div class="input-group input-group-merge input-group-flush">
            <div class="input-group-prepend input-group-text">
              <div class="shimmer" style="width: 1.5rem; height: 1.5rem;"></div>
            </div>
            <div class="shimmer" style="width: 12rem; height: 2.5rem; border-radius: 0.25rem;"></div>
            <div class="shimmer" style="width: 6rem; height: 2.5rem; border-radius: 0.25rem; margin-left: 0.5rem;"></div>
          </div>
        </div>

        <div class="d-grid d-sm-flex justify-content-md-end align-items-sm-center gap-2">
          <!-- Export Dropdown Placeholder -->
          <div class="shimmer" style="width: 6rem; height: 2rem; border-radius: 0.25rem;"></div>
          <!-- Filter Dropdown Placeholder -->
          <div class="shimmer" style="width: 6rem; height: 2rem; border-radius: 0.25rem;"></div>
        </div>
      </div>
      <!-- End Header -->

      <!-- Table -->
      <div class="table-responsive datatable-custom">
        <table
          class="table table-borderless table-thead-bordered table-nowrap table-align-middle card-table"
        >
          <thead>
          <tr>
            <th class="table-column-ps-1">
              <div class="shimmer" style="width: 2rem; height: 0.6rem; border-radius: 0.25rem;"></div>
            </th>
            <th>
              <div class="shimmer" style="width: 8rem; height: 0.6rem; border-radius: 0.25rem;"></div>
            </th>
            <th>
              <div class="shimmer" style="width: 6rem; height: 0.6rem; border-radius: 0.25rem;"></div>
            </th>
            <th>
              <div class="shimmer" style="width: 6rem; height: 0.6rem; border-radius: 0.25rem;"></div>
            </th>
            <th>
              <div class="shimmer" style="width: 4rem; height: 0.6rem; border-radius: 0.25rem;"></div>
            </th>
            <th>
              <div class="shimmer" style="width: 4rem; height: 0.6rem; border-radius: 0.25rem;"></div>
            </th>
            <th>
              <div class="shimmer" style="width: 4rem; height: 0.6rem; border-radius: 0.25rem;"></div>
            </th>
            <th>
              <div class="shimmer" style="width: 4rem; height: 0.6rem; border-radius: 0.25rem;"></div>
            </th>
          </tr>
          </thead>
          <tbody>
            @for (item of [1, 2, 3, 4]; track item) {
              <tr class="form-control-hover-light">
                <td class="table-column-ps-2">
                  <div class="form-check">
                    <div class="shimmer" style="width: 1.5rem; height: 1.5rem; border-radius: 0.25rem;"></div>
                  </div>
                </td>
                <td class="table-column-ps-0">
                  <div class="d-flex align-items-center">
                    <div class="avatar avatar-soft-dark avatar-circle">
                      <div class="shimmer" style="width: 2.5rem; height: 2.5rem; border-radius: 50%;"></div>
                    </div>
                    <div class="ms-3">
                      <div class="shimmer" style="width: 8rem; height: 0.6rem; border-radius: 0.25rem;"></div>
                      <div class="shimmer" style="width: 6rem; height: 0.6rem; border-radius: 0.25rem; margin-top: 0.5rem;"></div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="shimmer" style="width: 6rem; height: 0.6rem; border-radius: 0.25rem;"></div>
                </td>
                <td>
                  <div class="shimmer" style="width: 6rem; height: 0.6rem; border-radius: 0.25rem;"></div>
                </td>
                <td>
                  <div class="shimmer" style="width: 4rem; height: 0.6rem; border-radius: 0.25rem;"></div>
                </td>
                <td>
                  <div class="shimmer" style="width: 4rem; height: 0.6rem; border-radius: 0.25rem;"></div>
                </td>
                <td>
                  <div class="shimmer" style="width: 4rem; height: 0.6rem; border-radius: 0.25rem;"></div>
                </td>
                <td>
                  <div class="d-flex gap-2">
                    <div class="shimmer" style="width: 4rem; height: 2rem; border-radius: 0.25rem;"></div>
                    <div class="shimmer" style="width: 4rem; height: 2rem; border-radius: 0.25rem;"></div>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      <!-- End Table -->

      <!-- Footer -->
      <div class="card-footer">
        <div class="row justify-content-center justify-content-sm-between align-items-sm-center">
          <div class="col-sm mb-2 mb-sm-0">
            <div class="d-flex justify-content-center justify-content-sm-start align-items-center">
              <div class="shimmer" style="width: 4rem; height: 0.6rem; border-radius: 0.25rem;"></div>
              <div class="shimmer" style="width: 3rem; height: 1.5rem; border-radius: 0.25rem; margin-left: 0.5rem;"></div>
              <div class="shimmer" style="width: 2rem; height: 0.6rem; border-radius: 0.25rem; margin-left: 0.5rem;"></div>
              <div class="shimmer" style="width: 2rem; height: 0.6rem; border-radius: 0.25rem; margin-left: 0.5rem;"></div>
            </div>
          </div>
          <div class="col-sm-auto">
            <div class="d-flex justify-content-center justify-content-sm-end">
              <div class="shimmer" style="width: 8rem; height: 1.5rem; border-radius: 0.25rem;"></div>
            </div>
          </div>
        </div>
      </div>
      <!-- End Footer -->
    </div>
  `,
  styles: [
    `
      .card {
        position: relative;
        z-index: 1;
      }
      .table-responsive {
        overflow-x: auto;
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
export class TableLoadingComponent {
  @Input() showTabsSection: boolean = false;
}
