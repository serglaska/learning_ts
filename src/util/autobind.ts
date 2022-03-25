namespace App {
  // autobind
  export function autobind(_: any, _1: string, descriptor: PropertyDescriptor) {
    const originMethod = descriptor.value;
    const adjDescriptor = {
      configurable: true,
      get() {
        const bindedFuntion = originMethod.bind(this);
        return bindedFuntion;
      }
    }
    return adjDescriptor;
  }
}
