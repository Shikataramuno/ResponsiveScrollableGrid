export default class SortOrders {
  id: number = 1;
  name: number = 1;
  address: number = 1;

  selectKey(key: string) {
    if (key === 'id') {
      this.id *= -1;
    } else if (key === 'name') {
      this.name *= -1;
    } else {
      this.address *= -1;
    }
  }
  getOrder(key: string): number {
    /*
    let order: number = 1;
    if (key === 'id') {
      order = this.id;
    } else if (key === 'name') {
      order = this.name;
    } else {
      order = this.address;
    }
    return order;
    */
    return (this as any)[key];
  }
}
