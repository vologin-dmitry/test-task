const admin = require("firebase-admin");
const {chunk} = require("../utlis/array");

class PushClient {
  constructor(credential) {
    this.client = admin.messaging(admin.initializeApp({
      credential,
      databaseURL: `https://${credential.projectId}.firebaseio.com`,
      projectId: credential.projectId,
      storageBucket: `${credential.projectId}.appspot.com`,
    }));
    this.maxMesageLength = 500;
  }

  async sendPushes(pushes) {
    const result = await Promise.all(
      chunk(pushes, this.maxMesageLength)
        .map((c) => this.client.sendEach(c.map((p) => ({ notification: p, token: p.token }))))
    ).then((r) => r
      .flatMap((e) => e.responses)
    );
    return pushes.map((push, i) => ({
      push,
      success: result[i].success,
    }))
  }
}