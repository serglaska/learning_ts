function DecorateWithTemplateSec(htmlTemplate: string, hookId: string) {
  console.log('Executing DecorateWithTemplate')
  return function <T extends { new(...args: any[]): { name: string } }>(originConstructor: T) {
    return class extends originConstructor {
      constructor(..._: any[]) {
        super();
        console.log('Executing DecorateWithTemplate decorator')
        const hookedElement = document.getElementById(hookId);
        // const app = new originConstructor();
        if (hookedElement) {
          hookedElement.innerHTML = htmlTemplate;
          hookedElement.querySelector('h3')!.textContent = this.name;
        }
      }
    }
  }
};

@DecorateWithTemplateSec('<h3> My worked decorator </h3>', 'teg_3')
class PersonSer2 {
  name = 'Ser';
  age = 100;
  constructor() {
    console.log('Class creating')
  }
};

const ser2 = new PersonSer2();

// ------- Autobind

function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      console.log('this', this)
      const bindFunc = originalMethod.bind(this);
      return bindFunc;
    }
  };

  return adjDescriptor;
}

class PrintMessage {
  message = 'This flow works!';

  @Autobind
  showMessage() {
    console.log(this.message)
  }
};

const pm = new PrintMessage();

const button = document.querySelector('button')!;
button.addEventListener('click', pm.showMessage);

// ------ Validation

interface ValidatorConfig {
  [property: string]: {
    [validatableProp: string]: string[],
  }
};

const registeredValidators: ValidatorConfig = {

};

function ValidateTitle(target: any, propertyName: string) {
  console.log(registeredValidators[target.constructor.name], 'target.constructor.name')
  // console.log(propertyName, 'propertyName')
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propertyName]: ['required']
  }
};


function ValidatePrice(target: any, propertyName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propertyName]: ['positive']
  }
};

function validation(obj: any) {
  const objValidatorConfig = registeredValidators[obj.constructor.name];
  console.log('<<< --------------------------------------------');
  console.log('<<< ~ objValidatorConfig', objValidatorConfig);
  console.log('<<< --------------------------------------------');
  if (!objValidatorConfig) return true;
  let isValid = true;
  for (const prop in objValidatorConfig) {
    for (const validator of objValidatorConfig[prop]) {
      switch (validator) {
        case 'required': isValid = isValid && !!obj[prop];
          break;
        case 'positive': isValid = isValid && obj[prop] > 0;
          break;
      }
    }
  }
  return isValid ;
};

class Course {
  @ValidateTitle
  title: string;
  @ValidatePrice
  price: number;

  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }
};

const dataForm = document.querySelector('form')!;

dataForm.addEventListener('submit', event => {
  event.preventDefault();
  const titleElement = document.getElementById('title') as HTMLInputElement
  const priceElement = document.getElementById('price') as HTMLInputElement

  const title = titleElement.value;
  const price = +priceElement.value;

  const courseForm = new Course(title, price);
  console.log('<<< ----------------------------');
  console.log('<<< ~ courseForm', courseForm);
  console.log('<<< ----------------------------');

  if (!validation(courseForm)) {
    alert('Please use valid data')
  }

});
