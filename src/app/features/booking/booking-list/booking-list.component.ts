import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe, NgClass, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgbDropdown, NgbDropdownAnchor, NgbDropdownItem, NgbDropdownMenu, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { toSignal } from '@angular/core/rxjs-interop';
import { UsersService, UserDisplay } from '../../../services/user.service';
import { TableLoadingComponent } from '../../table-loading/table-loading.component';
import { ModalContentComponent } from '../../modal-content/modal-content.component';
import { PaginationComponent } from '../../pagination/pagination.component';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterLinkActive,
    TableLoadingComponent,
    NgClass,
    NgIf,
    NgbDropdown,
    NgbDropdownAnchor,
    NgbDropdownItem,
    NgbDropdownMenu,
    ModalContentComponent,
    DatePipe,
    PaginationComponent
  ],
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss']
})
export class BookingListComponent implements OnInit {
  private modalService = inject(NgbModal);
  protected userServices = inject(UsersService);
  searchTerm: string = '';
  selectedCount = 0;
  private currentPageSubject = new BehaviorSubject<number>(1);
  private pageSizeSubject = new BehaviorSubject<number>(10);
  private searchSubject = new BehaviorSubject<string>('');
  protected allUsers = toSignal(this.userServices.users$, { initialValue: [] as UserDisplay[] });

  private filteredUsers$ = combineLatest([
    this.userServices.users$,
    this.searchSubject.asObservable()
  ]).pipe(
    map(([users, searchTerm]) => {
      if (!searchTerm) return users;
      const lowerSearch = searchTerm.toLowerCase();
      const searchNumber = parseFloat(searchTerm); // Convert searchTerm to number for amount comparison
      return users.filter(user =>
        user.fullName.toLowerCase().includes(lowerSearch) ||
        (user.appointmentDetails.email?.toLowerCase().includes(lowerSearch) ?? false) ||
        user.appointmentDetails.teamA.toLowerCase().includes(lowerSearch) ||
        user.appointmentDetails.appointment.toLowerCase().includes(lowerSearch) ||
        user.appointmentDetails.paymentReference.toLowerCase().includes(lowerSearch) ||
        user.appointmentDetails.teamB.toLowerCase().includes(lowerSearch) ||
        (!isNaN(searchNumber) && user.appointmentDetails.amount === searchNumber)
      );
    })
  );

  private pagination$ = combineLatest([
    this.filteredUsers$,
    this.currentPageSubject.asObservable(),
    this.pageSizeSubject.asObservable()
  ]).pipe(
    map(([users, currentPage, pageSize]) => {
      const start = (currentPage - 1) * pageSize;
      return {
        users: users.slice(start, start + pageSize),
        totalItems: users.length,
        currentPage,
        pageSize
      };
    })
  );

  paginatedUsers = toSignal(
    this.pagination$.pipe(map(p => p.users)),
    { initialValue: [] as UserDisplay[] }
  );
  totalItems = toSignal(
    this.pagination$.pipe(map(p => p.totalItems)),
    { initialValue: 0 }
  );
  currentPage = toSignal(
    this.pagination$.pipe(map(p => p.currentPage)),
    { initialValue: 1 }
  );
  pageSize = toSignal(
    this.pagination$.pipe(map(p => p.pageSize)),
    { initialValue: 10 }
  );

  ngOnInit() {
    console.log('BookingListComponent initialized');
    document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove());
  }

  updateSearch() {
    this.searchSubject.next(this.searchTerm);
    this.currentPageSubject.next(1);
  }

  onSearch() {
    this.updateSearch();
  }

  onPageChange(page: number) {
    this.currentPageSubject.next(page);
  }

  onPageSizeChange(pageSize: number) {
    this.pageSizeSubject.next(pageSize);
    this.currentPageSubject.next(1);
  }

  open(user: UserDisplay) {
    if (user) {
      const modalRef = this.modalService.open(ModalContentComponent, {
        size: 'md',
        backdrop: false,
      });
      modalRef.componentInstance.user = user;
      modalRef.result.then(
        (result) => {
          console.log('Modal closed with:', result);
          document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove());
        },
        (reason) => {
          console.log('Modal dismissed with:', reason);
          document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove());
        }
      );
    }
  }

  formatTime(startHour: number, duration: number): string {
    const startPeriod = startHour >= 12 ? 'PM' : 'AM';
    const startFormattedHour = startHour % 12 || 12;

    const endHour = startHour + duration;
    const endPeriod = endHour >= 12 ? 'PM' : 'AM';
    const endFormattedHour = endHour % 12 || 12;

    if (startPeriod === endPeriod) {
      return `${startFormattedHour}-${endFormattedHour} ${startPeriod}`;
    } else {
      return `${startFormattedHour} ${startPeriod}-${endFormattedHour} ${endPeriod}`;
    }
  }

  selectAll($event: Event) {
    // Implement select all logic if needed
  }

  trackByEmail(index: number, user: UserDisplay): string {
    return user.email;
  }
}
