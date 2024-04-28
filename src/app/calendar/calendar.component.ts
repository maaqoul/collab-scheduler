import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Activity {
  description: string;
  color: string;
  startHour: number;
  durationInHours: number;
}

interface Colleague {
  id: string;
  name: string;
  activities: Activity[];
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  startTime = 8; // 8 AM
  endTime = 22; // 10 PM
  timeSlots: string[] = [];

  collaborators: Colleague[] = [
    {
      id: 'john-doe',
      name: 'John Doe',
      activities: [
        {
          description: 'Parfumerie',
          color: 'bg-yellow-200',
          startHour: 8,
          durationInHours: 1.5,
        },
        {
          description: 'Brief',
          color: 'bg-blue-200',
          startHour: 9.5,
          durationInHours: 2,
        },
        {
          description: 'Épicerie',
          color: 'bg-red-200',
          startHour: 13,
          durationInHours: 1.5,
        },
      ],
    },
    {
      id: 'jane-smith',
      name: 'Jane Smith',
      activities: [
        {
          description: 'Brief',
          color: 'bg-blue-200',
          startHour: 8,
          durationInHours: 2,
        },
        {
          description: 'Droguerie',
          color: 'bg-green-200',
          startHour: 11,
          durationInHours: 1,
        },
      ],
    },
    {
      id: 'emily-johnson',
      name: 'Emily Johnson',
      activities: [
        {
          description: 'Épicerie',
          color: 'bg-red-200',
          startHour: 8,
          durationInHours: 1.5,
        },
        {
          description: 'PLS',
          color: 'bg-purple-200',
          startHour: 12,
          durationInHours: 2,
        },
      ],
    },
    {
      id: 'michael-brown',
      name: 'Michael Brown',
      activities: [
        {
          description: 'Boissons',
          color: 'bg-orange-200',
          startHour: 9,
          durationInHours: 1,
        },
        {
          description: 'Pause déjeuner',
          color: 'bg-green-200',
          startHour: 12,
          durationInHours: 1,
        },
      ],
    },
    {
      id: 'jessica-davis',
      name: 'Jessica Davis',
      activities: [
        {
          description: 'Parfumerie',
          color: 'bg-yellow-200',
          startHour: 10,
          durationInHours: 1.5,
        },
        {
          description: 'Épicerie',
          color: 'bg-red-200',
          startHour: 14,
          durationInHours: 1,
        },
      ],
    },
    {
      id: 'william-wilson',
      name: 'William Wilson',
      activities: [
        {
          description: 'Droguerie',
          color: 'bg-green-200',
          startHour: 10,
          durationInHours: 1,
        },
        {
          description: 'PLS',
          color: 'bg-purple-200',
          startHour: 13,
          durationInHours: 2,
        },
      ],
    },
    {
      id: 'sarah-miller',
      name: 'Sarah Miller',
      activities: [
        {
          description: 'Brief',
          color: 'bg-blue-200',
          startHour: 8,
          durationInHours: 2,
        },
        {
          description: 'Boissons',
          color: 'bg-orange-200',
          startHour: 15,
          durationInHours: 1,
        },
      ],
    },
  ];

  constructor() {
    this.generateTimeSlots();
  }

  generateTimeSlots(): void {
    for (let hour = 8; hour <= 22; hour++) {
      // from 8 AM to 10 PM
      let time = hour < 10 ? `0${hour}:00` : `${hour}:00`;
      this.timeSlots.push(time);
    }
  }

  getActivitySpan(activity: Activity): number {
    // Convert duration in hours to the number of grid rows it should span.
    return activity.durationInHours * 2; // assuming each row is half an hour
  }
  getActivityHeight(activity: Activity) {
    // Assuming each row is 60px tall and each hour is represented by one row.
    const rowHeight = 60; // Adjust this value based on your actual row height
    console.log(activity.durationInHours * rowHeight);
  }
  isActivityInTimeslot(activity: Activity, slotHour: number) {
    // Check if the activity should be displayed in this timeslot.
    const activityStart = activity.startHour;
    const activityEnd = activity.startHour + activity.durationInHours;
  }

  isNoActivityInTimeslot(collaborator: Colleague, timeslot: number): boolean {
    return collaborator.activities.some((a) =>
      this.isActivityInTimeslot(a, timeslot)
    );
  }
}
