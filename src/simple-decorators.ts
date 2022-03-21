function Loading(longString: string) {
  console.log('Executing Loading')
  return function (_: Function) {
    console.log('Executing Loading decorator')
    console.log(longString);
  }
};

function DecorateWithTemplate(htmlTemplate: string, hookId: string) {
  console.log('Executing DecorateWithTemplate')
  return function (constructor: any) {
    console.log('Executing DecorateWithTemplate decorator')
    const hookedElement = document.getElementById(hookId);
    const app = new constructor();
    if (hookedElement) {
      hookedElement.innerHTML = htmlTemplate;
      hookedElement.querySelector('h2')!.textContent = app.name;
    }
  }
};

@Loading('My first call decoration fabric')
@DecorateWithTemplate('<h2> My worked decorator </h2>', 'teg_1')
class PersonSer {
  name = 'Ser';
  constructor() {
    console.log('Class creating')
  }
};

const ser = new PersonSer();

// -------------
function Log(target: any, propertyName: string | Symbol) {
  console.log(target)
  console.log(propertyName)
};

function ShowAlert(constructor: any) {
  const nameClass = new constructor();
  alert('this class name' + nameClass.name)
};

function AccessorLog(target: any, name: string, descriptor: PropertyDescriptor) {
  console.log('Accessor decorator')
  console.log('name', name)
  console.log('target', target)
  console.log('descriptor', descriptor)
};

function MethodLog(target: any, name: string, descriptor: PropertyDescriptor) {
  console.log('MethodLog')
  console.log('name', name)
  console.log('target', target)
  console.log('descriptor', descriptor)
};

function ArgumentLog(target: any, name: string, position: number) {
  console.log('ArgumentLog')
  console.log('name', name)
  console.log('target', target)
  console.log('descriptor', position)
};

@ShowAlert
class PriceAndTax {
  @Log
  private _price: number;
  @Log
  title: string;
  name = 'PriceAndTax';
  
  @AccessorLog
  set price(val: number) {
    if (val > 0) {
      this._price = val;
    } else {
      throw new Error('Value must be more than 0');
    }
  }

  constructor(p: number, t: string) {
    this.title = t;
    this._price = p;
  }

  @MethodLog
  getPriceWithTax(@ArgumentLog tax: number, @ArgumentLog sleng: string) {
    console.log('inside getMethod');
    sleng = 'Hello sleng' + sleng;
    return this._price * (1 + tax);
  }
};
