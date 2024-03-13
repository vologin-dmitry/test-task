import { Job } from 'node-schedule';
import * as schedule from 'node-schedule';
import { Scheduler } from './interfaces';
import { PushClient } from './senderService';
import { PushFirebaseNotification } from './types';
import { SendPushRequest } from './types';

export class SchedulerClient implements Scheduler {
  private readonly pusher;
  constructor(pusher: PushClient) {
    this.pusher = pusher;
  }

  async scheduleNotifications(pushes: SendPushRequest[]): Promise<string[]> {
    const groupedByDelay: Record<number, SendPushRequest[]> = pushes.reduce(
      (result: Record<number, SendPushRequest[]>, pushRequest: SendPushRequest) => {
        const { delay } = pushRequest;
        if (!result[delay]) {
          result[delay] = [];
        }
        result[delay].push(pushRequest);
        return result;
      },
      {}
    );

    const scheculedJobs: string[] = [];
    Object.keys(groupedByDelay).forEach((delay) => {
      const intDelay = parseInt(delay, 10);

      if (Number.isNaN(intDelay)) {
        throw new Error(`Wrong delay number: ${intDelay}`)
      }
      const date = new Date(Date.now() + intDelay * 1000);
      const firebaseNotifications: PushFirebaseNotification[] = groupedByDelay[intDelay].map((request: SendPushRequest) => {
        const { delay, ...notification } = request;
        return notification;
      });
      try {
        const job = schedule.scheduleJob(date, async () => {
          await this.pusher.sendPushes(
            firebaseNotifications
          );
        });

        scheculedJobs.push(`Notification: ${JSON.stringify(groupedByDelay[intDelay])}; Job: ${job.name}`);
      } catch (e: any) {
        scheculedJobs.push(`Error while scheduling job!
        Notification: ${JSON.stringify(groupedByDelay[intDelay])}.
        Error: ${JSON.stringify(e?.message)}`);
      }
    });

    return scheculedJobs;
  }
}
