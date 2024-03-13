import { messaging } from 'firebase-admin';
import admin from 'firebase-admin';
import { Credential } from 'firebase-admin/lib/app/credential';
import { PushingService } from './interfaces';
import { PushFirebaseNotification } from './types';
import { slice } from './utlis/array';

export class PushClient implements PushingService {
  private maxMesageLength: number;
  private client: messaging.Messaging;
  constructor(credential: any) {
    if (!credential.project_id) {
      throw new Error('Error constructing PushClient: no project_id');
    }

    let creds: Credential;
    try {
      creds = admin.credential.cert(credential)
    } catch (e) {
      throw new Error(`Unable to get credentials cert ${JSON.stringify(e)}`);
    }

    this.client = admin.messaging(admin.initializeApp({
      credential: creds,
      databaseURL: `https://${credential.project_id}.firebaseio.com`,
      projectId: credential.project_id,
      storageBucket: `${credential.project_id}.appspot.com`,
    }));
    this.maxMesageLength = 500;
  }

  async sendPushes(pushes: PushFirebaseNotification[]) {
    console.log('here!');
    const result = await Promise.all(
      slice<PushFirebaseNotification>(pushes, this.maxMesageLength)
        .map((c) => this.client.sendEach(c.map((p) => ({
          notification: {
            title: p.title,
            body: p.body,
            imageUrl: p.imageUrl,
          },
          token: p.token
        }))))
    ).then((r) => r
      .flatMap((e: any) => e.responses)
    );
    console.log(JSON.stringify(result));
    return pushes.map((push, i) => ({
      push,
      success: result[i].success,
    }))
  }
}
