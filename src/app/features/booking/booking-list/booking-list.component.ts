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
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

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
export class BookingListComponent implements OnInit, OnDestroy {
  private modalService = inject(NgbModal);
  protected userServices = inject(UsersService);
  searchTerm: string = '';
  selectedCount = 0;
  selectedUsers = new Set<string>();
  allSelected = false;
  private destroy$ = new Subject<void>();
  private currentPageSubject = new BehaviorSubject<number>(1);
  private pageSizeSubject = new BehaviorSubject<number>(10);
  private searchSubject = new BehaviorSubject<string>('');
  private filterSubject = new BehaviorSubject<{
    startDate: Date | null;
    endDate: Date | null;
    status: string | null;
    location: string | null;
  }>({
    startDate: null,
    endDate: null,
    status: null,
    location: null
  });

  protected allUsers = toSignal(this.userServices.users$, { initialValue: [] as UserDisplay[] });

  filters = {
    startDate: null as Date | null,
    endDate: null as Date | null,
    status: '' as string | null,
    location: '' as string | null
  };

  private filteredUsers$ = combineLatest([
    this.userServices.users$,
    this.searchSubject.asObservable(),
    this.filterSubject.asObservable()
  ]).pipe(
    map(([users, searchTerm, filters]) => {
      let filtered = users;

      // Apply search filter
      if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        const searchNumber = parseFloat(searchTerm);
        filtered = filtered.filter(user =>
          user.fullName.toLowerCase().includes(lowerSearch) ||
          (user.appointmentDetails.email?.toLowerCase().includes(lowerSearch) ?? false) ||
          user.appointmentDetails.teamA.toLowerCase().includes(lowerSearch) ||
          user.appointmentDetails.appointment.toLowerCase().includes(lowerSearch) ||
          user.appointmentDetails.paymentReference.toLowerCase().includes(lowerSearch) ||
          user.appointmentDetails.teamB.toLowerCase().includes(lowerSearch) ||
          (!isNaN(searchNumber) && user.appointmentDetails.amount === searchNumber)
        );
      }

      // Apply date range filter
      if (filters.startDate || filters.endDate) {
        filtered = filtered.filter(user => {
          const appointmentDate = new Date(user.appointmentDetails.appointmentDate);
          if (isNaN(appointmentDate.getTime())) return false;

          const start = filters.startDate ? new Date(filters.startDate) : null;
          const end = filters.endDate ? new Date(filters.endDate) : null;

          if (start) start.setHours(0, 0, 0, 0);
          if (end) end.setHours(23, 59, 59, 999);

          return (!start || appointmentDate >= start) && (!end || appointmentDate <= end);
        });
      }

      // Apply status filter
      if (filters.status) {
        filtered = filtered.filter(user => user.status === filters.status);
      }

      // Apply location filter
      if (filters.location) {
        filtered = filtered.filter(user => user.appointmentDetails.location === filters.location);
      }

      return filtered;
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

  get activeFilterCount(): number {
    let count = 0;
    if (this.filters.startDate) count++;
    if (this.filters.endDate) count++;
    if (this.filters.status) count++;
    if (this.filters.location) count++;
    return count;
  }

  ngOnInit() {
    console.log('BookingListComponent initialized');
    document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove());

    // Update selectedCount when selectedUsers changes
    this.filteredUsers$.pipe(takeUntil(this.destroy$)).subscribe(users => {
      // Remove any selected users that are no longer in the filtered list
      const currentUserIds = new Set(users.map(user => user.id));
      this.selectedUsers.forEach(id => {
        if (!currentUserIds.has(id)) {
          this.selectedUsers.delete(id);
        }
      });
      this.selectedCount = this.selectedUsers.size;
      this.updateAllSelected();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateSearch() {
    this.searchSubject.next(this.searchTerm);
    this.currentPageSubject.next(1);
    this.clearSelection();
  }

  onSearch() {
    this.updateSearch();
  }

  onPageChange(page: number) {
    this.currentPageSubject.next(page);
    this.clearSelection();
  }

  onPageSizeChange(pageSize: number) {
    this.pageSizeSubject.next(pageSize);
    this.currentPageSubject.next(1);
    this.clearSelection();
  }

  applyFilters() {
    this.filterSubject.next({
      startDate: this.filters.startDate ? new Date(this.filters.startDate) : null,
      endDate: this.filters.endDate ? new Date(this.filters.endDate) : null,
      status: this.filters.status || null,
      location: this.filters.location || null
    });
    this.currentPageSubject.next(1);
    this.clearSelection();
  }

  resetFilters() {
    this.filters = {
      startDate: null,
      endDate: null,
      status: '',
      location: ''
    };
    this.filterSubject.next({
      startDate: null,
      endDate: null,
      status: null,
      location: null
    });
    this.currentPageSubject.next(1);
    this.clearSelection();
  }

  selectAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.allSelected = checked;
    const currentUsers = this.paginatedUsers();
    if (checked) {
      currentUsers.forEach(user => this.selectedUsers.add(user.id));
    } else {
      currentUsers.forEach(user => this.selectedUsers.delete(user.id));
    }
    this.selectedCount = this.selectedUsers.size;
  }

  toggleSelection(userId: string) {
    if (this.selectedUsers.has(userId)) {
      this.selectedUsers.delete(userId);
    } else {
      this.selectedUsers.add(userId);
    }
    this.selectedCount = this.selectedUsers.size;
    this.updateAllSelected();
  }

  private updateAllSelected() {
    const currentUsers = this.paginatedUsers();
    this.allSelected = currentUsers.length > 0 && currentUsers.every(user => this.selectedUsers.has(user.id));
  }

  private clearSelection() {
    this.selectedUsers.clear();
    this.selectedCount = 0;
    this.allSelected = false;
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

  trackByEmail(index: number, user: UserDisplay): string {
    return user.email;
  }
}
