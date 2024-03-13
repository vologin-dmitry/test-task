export type SendPushRequest = {
  delay: number;
  title: string,
  body: string,
  imageUrl?: string,
  token: string,
};

export type PushFirebaseNotification = {
  title: string,
  body: string,
  imageUrl?: string,
  token: string,
};
