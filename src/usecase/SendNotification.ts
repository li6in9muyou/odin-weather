export class SendNotification {
  private port: { send(message: string, level: string) };

  constructor(port: any) {
    this.port = port;
  }

  send(message: string, level: string = "info") {
    this.port.send(message, level);
  }
}
