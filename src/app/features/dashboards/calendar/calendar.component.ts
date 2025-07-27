import { Component, OnInit, inject } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import { UsersService, UserDisplay } from '../../../services/user.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    FullCalendarModule
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  private userService = inject(UsersService);
  private allUsers = toSignal(this.userService.users$, { initialValue: [] as UserDisplay[] });

  calendarOptions: CalendarOptions = {
    initialDate: '2025-05-29',
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, bootstrap5Plugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,listWeek',
    },
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    },
    events: [],
    eventDidMount: (info) => {
      info.el.setAttribute('title', `${info.event.title} at ${info.event.extendedProps['location']}`);
    }
  };

  ngOnInit(): void {
    this.userService.users$.pipe(
      map(users => users
        .filter(user => {
          // Ensure valid date and team data
          const hasValidDate = !isNaN(user.appointmentDetails.appointmentDate.getTime());
          const hasTeams = user.appointmentDetails.teamA && user.appointmentDetails.teamB;
          return hasValidDate && hasTeams;
        })
        .map(user => ({
          title: `${user.appointmentDetails.teamA} vs ${user.appointmentDetails.teamB}`,
          start: this.formatEventDateTime(user.appointmentDetails.appointmentDate, user.appointmentDetails.appointmentStartHour),
          end: this.formatEventDateTime(user.appointmentDetails.appointmentDate, user.appointmentDetails.appointmentStartHour + user.appointmentDetails.appointmentDuration),
          classNames: this.getEventClassNames(user.status),
          extendedProps: {
            location: user.appointmentDetails.location || 'Unknown',
            amount: user.appointmentDetails.amount || 0
          }
        }))
      )
    ).subscribe(events => {
      this.calendarOptions = {
        ...this.calendarOptions,
        events
      };
    });
  }

  private formatEventDateTime(date: Date, hour: number): string {
    const eventDate = new Date(date);
    eventDate.setHours(hour, 0, 0, 0);
    return eventDate.toISOString();
  }

  private getEventClassNames(status: string): string[] {
    const baseClasses = [
      'event-custom-style',
      'bg-light',
      'text-nav',
      'border-0',
      'rounded-1',
      'p-2',
      'ps-3',
      'border-start',
      'border-5'
    ];

    switch (status) {
      case 'Played':
        return [...baseClasses, 'border-success'];
      case 'On Progress':
        return [...baseClasses, 'border-warning'];
      case 'To Do':
        return [...baseClasses, 'border-primary'];
      default:
        return [...baseClasses, 'border-info'];
    }
  }
}
