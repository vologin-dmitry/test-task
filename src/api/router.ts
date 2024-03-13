import { Router ,Request, Response } from 'express';
import { SchedulerClient } from '../services/scheduler';
import { PushClient } from '../services/senderService';
import { SendPushRequest } from '../services/types';
import credential from '../../service-account.json';
import { sendPushRequest } from './middlewares';

const router = Router();

router.post('/sendPushRequest', async (req: Request, res: Response) => {
  const body: SendPushRequest[] = req.body;

  if (!Array.isArray(body)) {
    throw new Error('Input must be an array');
  }
  const results = await sendPushRequest(body)

  return (res.json(results));
});

export default router;
