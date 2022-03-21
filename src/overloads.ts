type Combainable = string | number;
type Numeric = number | boolean;
type Universe = Combainable & Numeric;

const example: Universe = 555;

type Admin = {
  name: string;
  privileges: string[];
};

type Employee = {
  date: Date;
  name: string;
};

type ElevatedEmployee = Admin & Employee;

const item: ElevatedEmployee = {
  name: 'Alex',
  date: new Date(),
  privileges: ['server-creator'],
}

const data = {
  name: 'server',
  server: {
    time: Date()
  }
};

const newDate = data?.server?.time;

function addNums(a: number, b: number): number;
function addNums(a: string, b: string): string;
function addNums(a: Combainable, b: Combainable) {
  if (typeof a === 'string' || typeof b === 'string') {
    return a.toString() + b.toString();
  }
  return a + b;
}
addNums('Max', '555');
addNums(123, 123);

type UnknownEmployee = Admin | Employee;

function printEmployeeInformations(emp: UnknownEmployee) {
  console.log('Name of ' + emp.name);
  if ('privileges' in emp) {
    console.log('Privileges ' + emp.privileges);
  }
  if ('date' in emp) {
    console.log('Date' + emp.date);
  }
};

printEmployeeInformations(item);
// console.log(item);

class Car {
  drive() {
    console.log('Driving...')
  }
};

class Truck {
  drive() {
    console.log('Driving a truck')
  }

  loadDriving(amount: number) {
    console.log('Driving ' + amount)
  }
};

type Vehicle = Car | Truck;

const v1 = new Car();
const v2 = new Truck();

function useVehicle(vehicle: Vehicle) {
  vehicle.drive()
  if (vehicle instanceof Truck) {
    vehicle.loadDriving(1000);
  }
}

useVehicle(v1);
useVehicle(v2);
////////////////////////

interface Bird {
  type: 'bird';
  flySpeed: number
};

interface Dog {
  type: 'dog';
  runSpeed: number
};

type Animals = Bird | Dog

function showSpeed(animal: Animals) {
  let speed;

  switch (animal.type) {
    case 'bird': speed = animal.flySpeed;
      break;
    case 'dog': speed = animal.runSpeed;
      break;
  }

  console.log(animal.type + ' ' + speed);
};

showSpeed({ type: 'bird', flySpeed: 2000 });
showSpeed({ type: 'dog', runSpeed: 12000 });

// const inputValue = document.getElementById('input-type') as HTMLInputElement;
const inputValue = <HTMLInputElement>document.getElementById('input-type');
inputValue.value = 'Get some value';

interface ErrorContainer {
  [key: string]: string | number;
};

// interface ErrorContainerAdd {
//   [key: string]: number;
// };prop

const someBufError: ErrorContainer = {
  44: 42,
  name: 'Alex',
  pass: 123456,
  email: 'No@email',
};
