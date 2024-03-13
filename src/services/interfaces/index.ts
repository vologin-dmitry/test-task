import { Job } from 'node-schedule';
import { SendPushRequest } from '../types';
import { PushFirebaseNotification } from '../types';

export interface Scheduler {
  scheduleNotifications(pushes: SendPushRequest[]): Promise<string[]>
}

export interface PushingService {
  sendPushes(pushes: PushFirebaseNotification[]): Promise<{ push: PushFirebaseNotification; success: boolean }[]>;
}
