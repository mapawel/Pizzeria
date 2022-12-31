export class Service {
  static instance: Service | null;

  private constructor() {}

  public static getInstance() {
    if (Service.instance) return Service.instance;
    return (Service.instance = new Service());
  }

  public static resetInstance() {
    Service.instance = null;
  }

  public orderToGo() {}

  public orderWhReservation() {}

  public reservation() {}
}
