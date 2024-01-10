type push = {
  title: string,
  body: string,
  imageUrl: string | null,
  token: string,
}
export class PushClient {
  public constructor(credential: Record<string, any>);
  public sendPushes(pushes: push[]): Promise<{ push: push, success: boolean}[]>
}