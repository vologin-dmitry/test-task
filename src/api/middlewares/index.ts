import credential from '../../../service-account.json';
import { SchedulerClient } from '../../services/scheduler';
import { PushClient } from '../../services/senderService';
import { SendPushRequest } from '../../services/types';

const pusher = new PushClient(credential);
const scheduler = new SchedulerClient(pusher);

export async function sendPushRequest(data: SendPushRequest[]) {
  const schedulingResults = await scheduler.scheduleNotifications(data);

  return schedulingResults;
}

