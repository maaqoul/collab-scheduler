import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  TrackByFunction,
  ViewChild,
} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
interface Activity {
  description: string;
  color: string;
  startHour: number;
  endHour: number;
  durationInHours: number;
  visualTop?: string;
  collaboratorId: string;
}

interface Colleague {
  id: number;
  name: string;
  activities: Activity[];
  dropListIds?: string[];
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  standalone: true,
  imports: [CommonModule, CdkDropList, CdkDrag],
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  startTime = 7; // 8 AM
  endTime = 22; // 10 PM
  timeSlots: string[] = [];

  collaborators: Colleague[] = [
    {
      id: 1,
      name: 'John Doe',
      activities: [
        {
          description: 'Parfumerie',
          color: 'bg-yellow-200',
          startHour: 8,
          endHour: 9.5,
          durationInHours: 1.5,
          collaboratorId: '1',
        },
        {
          description: 'Brief',
          color: 'bg-blue-200',
          startHour: 9.5,
          endHour: 11.5,
          durationInHours: 2,
          collaboratorId: '1',
        },
        {
          description: 'Épicerie',
          color: 'bg-red-200',
          startHour: 13,
          endHour: 14.5,
          durationInHours: 1.5,
          collaboratorId: '1',
        },
      ],
    },
    {
      id: 2,
      name: 'Jane Smith',
      activities: [
        {
          description: 'Brief',
          color: 'bg-blue-200',
          startHour: 8,
          endHour: 10,
          durationInHours: 2,
          collaboratorId: '2',
        },
        {
          description: 'Droguerie',
          color: 'bg-green-200',
          startHour: 11,
          endHour: 12,
          durationInHours: 1,
          collaboratorId: '2',
        },
      ],
    },
    {
      id: 3,
      name: 'Emily Johnson',
      activities: [
        {
          description: 'Épicerie',
          color: 'bg-red-200',
          startHour: 8,
          endHour: 9.5,
          durationInHours: 1.5,
          collaboratorId: '3',
        },
        {
          description: 'PLS',
          color: 'bg-purple-200',
          startHour: 12,
          endHour: 14,
          durationInHours: 2,
          collaboratorId: '3',
        },
      ],
    },
    {
      id: 4,
      name: 'Michael Brown',
      activities: [
        {
          description: 'Boissons',
          color: 'bg-orange-200',
          startHour: 9,
          endHour: 10,
          durationInHours: 1,
          collaboratorId: '4',
        },
        {
          description: 'Pause déjeuner',
          color: 'bg-green-200',
          startHour: 12,
          endHour: 13,
          durationInHours: 1,
          collaboratorId: '4',
        },
      ],
    },
    {
      id: 5,
      name: 'Jessica Davis',
      activities: [
        {
          description: 'Parfumerie',
          color: 'bg-yellow-200',
          startHour: 10,
          endHour: 11.5,
          durationInHours: 1.5,
          collaboratorId: '5',
        },
        {
          description: 'Épicerie',
          color: 'bg-red-200',
          startHour: 14,
          endHour: 15,
          durationInHours: 1,
          collaboratorId: '5',
        },
      ],
    },
    {
      id: 6,
      name: 'William Wilson',
      activities: [
        {
          description: 'Droguerie',
          color: 'bg-green-200',
          startHour: 10,
          endHour: 11,
          durationInHours: 1,
          collaboratorId: '6',
        },
        {
          description: 'PLS',
          color: 'bg-purple-200',
          startHour: 13,
          endHour: 15,
          durationInHours: 2,
          collaboratorId: '6',
        },
      ],
    },
    {
      id: 7,
      name: 'Sarah Miller',
      activities: [
        {
          description: 'Brief',
          color: 'bg-blue-200',
          startHour: 8,
          endHour: 10,
          durationInHours: 2,
          collaboratorId: '7',
        },
        {
          description: 'Boissons',
          color: 'bg-orange-200',
          startHour: 15,
          endHour: 16,
          durationInHours: 1,
          collaboratorId: '7',
        },
      ],
    },
  ];

  allDropListIds: string[] = [];

  constructor(private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.generateTimeSlots();
  }

  generateTimeSlots(): void {
    for (let hour = 7; hour <= 22; hour++) {
      // from 8 AM to 10 PM
      let time = hour < 10 ? `0${hour}:00` : `${hour}:00`;
      this.timeSlots.push(time);
    }
  }

  isActivityInTimeSlot(activity: Activity, timeSlot: string): boolean {
    const [hour, _] = timeSlot.split(':').map(Number);
    const slotStartInMinutes = hour * 60; // Slot start time in minutes
    const slotEndInMinutes = slotStartInMinutes + 60; // Slot end time in minutes
    const activityStartInMinutes =
      activity.startHour * 60 + (activity.startHour % 1) * 60; // Activity start time in minutes, considering half hours

    // Check if the activity starts within this time slot range
    return (
      activityStartInMinutes >= slotStartInMinutes &&
      activityStartInMinutes < slotEndInMinutes
    );
  }

  // Calculate the height and position of the activity based on its duration to fit in the calendar

  calculateHeight(activity: Activity): string {
    const durationInHours = activity.endHour - activity.startHour;
    return `${durationInHours * 64}px`;
  }

  isStartingTimeSlot(activity: Activity, timeSlot: string): boolean {
    const [hour, minute] = timeSlot.split(':').map(Number);
    const timeSlotInMinutes = hour * 60 + minute;
    const activityStartInMinutes = activity.startHour * 60;

    // Only return true if the timeslot is the start of the activity
    return timeSlotInMinutes === activityStartInMinutes;
  }

  calculateTopPosition(activity: Activity): string {
    // Assuming the day starts at 7 AM and each hour slot is 64 pixels high
    const startOfDayInMinutes = this.startTime * 60;
    const activityStartInMinutes = activity.startHour * 60;
    const topPositionInPixels =
      (activityStartInMinutes - startOfDayInMinutes) * (64 / 60);
    return `${topPositionInPixels}px`;
  }

  generateDropListIdsForCollaborator(collabId: number): string[] {
    return this.timeSlots.map(
      (timeSlot) => `dropList-${collabId}-${timeSlot.replace(':', '-')}`
    );
  }

  getAllDropListIdsForCollaborator(collabId: number): string[] {
    return this.generateDropListIdsForCollaborator(collabId);
  }

  getDropListIdForCollaborator = (id: number, time: string) =>
    `dropList-${id}-${time.replace(':', '-')}`;

  drop(event: CdkDragDrop<Activity[]>): void {
    if (event.previousContainer === event.container) {
      // If the activity is reordered within the same timeslot
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // If the activity is moved to a different timeslot
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // After transferring, update the activity's timeslot based on the new container's ID
      const newTimeslotId = event.container.id;
      const activity = event.container.data[event.currentIndex] as Activity;

      // Assuming timeslot ID format is 'dropList-collabId-time', extract the 'time' part
      const newTimeSlotHour = this.extractHourFromTimeslotId(newTimeslotId);
      if (newTimeSlotHour !== undefined) {
        activity.startHour = newTimeSlotHour;
        activity.endHour = newTimeSlotHour + activity.durationInHours;
      }
    }

    // Force update to refresh the view if Angular does not detect changes automatically
    this.cdr.detectChanges();
  }

  private extractHourFromTimeslotId(timeslotId: string): number | undefined {
    // Assuming ID format 'dropList-collabId-time', where 'time' is like '08-00' for 8 AM
    const parts = timeslotId.split('-');
    const hour = parseInt(parts[2], 10); // Extract and parse the hour part
    return isNaN(hour) ? undefined : hour;
  }
  trackActivity: TrackByFunction<Activity> = (
    index: number,
    activity: Activity
  ) => activity.collaboratorId;

  activitiesInTimeSlot(timeSlot: string, activities: Activity[]): Activity[] {
    return activities.filter((activity) =>
      this.isActivityInTimeSlot(activity, timeSlot)
    );
  }
}
