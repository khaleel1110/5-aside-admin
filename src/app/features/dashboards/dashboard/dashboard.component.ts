import { Component } from '@angular/core';
import { CalendarComponent } from '../calendar/calendar.component';
import {UsersService} from '../../../services/user.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CalendarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  totalBookings: number = 0;
  todayMatches: number = 0;
  matchesPlayed: number = 0;
  matchesToPlay: number = 0;

  constructor(private usersService: UsersService) {
    // Total Bookings
    this.usersService.users$.subscribe(users => {
      this.totalBookings = users.length;
    });

    // Today's Matches
    this.usersService.todayUsers$.subscribe(users => {
      this.todayMatches = users.length;
    });

    // Matches Played
    this.usersService.users$.subscribe(users => {
      this.matchesPlayed = users.filter(user => user.status === 'Played').length;
    });

    // Matches to Play
    this.usersService.futureUsers$.subscribe(users => {
      this.matchesToPlay = users.length;
    });
  }
}
