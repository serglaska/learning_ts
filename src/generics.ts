const getter = <T>(data: T) => data;
console.log(getter('string').length);
console.log(getter([]).length);

const itemSix: Array<string> = [];

const promise: Promise<string | number> = new Promise(resolve => {
  setTimeout(() => {
    resolve('may')
  }, 9000)
});

promise.then(data => {
  if (typeof data === 'string') {
    data.toUpperCase()
  } else {
    data.toFixed(2);
  }
})

const mergeFunc = <T, U>(obj1: T, obj2: U) => Object.assign(obj1, obj2);
const certainObj = mergeFunc({ name: 'Mila', roles: ['Admin'] }, { age: 33 });
const certainObj2 = mergeFunc({ pris: 'Pris' }, 'strange');
// console.log('<<< ~ certainObj', certainObj2);


interface Lengthy {
  length: number
};

function countAndDescribe<T extends Lengthy>(element: T): [T, string] {
  let description = 'Got value ';
  if (element.length > 1) {
    description = 'Got big length';
  } else if (element.length === 0) {
    description = description + '0';
  } else {
    description = description + element.length
  }
  return [element, description];
}

// console.log(countAndDescribe(['Aloha']));

function extractAndConvert<T extends object, U extends keyof T>(obj: T, key: U) {
  return console.log('Value ' + obj[key]);
};

extractAndConvert({ age: 400 }, 'age');

class ActionWithItem<T>{
  private data: T[] = [];

  addItem(itemOne: T) {
    this.data.push(itemOne);
  };

  removeItem(itemOne: T) {
    this.data.splice(this.data.indexOf(itemOne, 1))
  };

  getItems() {
    return [...this.data]
  };
};

const actionItem = new ActionWithItem<string>();
const actionItemNumbers = new ActionWithItem<number>();

actionItem.addItem('sorry');
actionItem.addItem('my Mom');
actionItemNumbers.addItem(99);
console.log(actionItem.getItems())

interface Zoo {
  fish: string;
  dog: string;
  amount: number;
}

function setZoo(fish: string, dog: string, amount: number): Zoo {
  let boxOfZoo: Partial<Zoo> = {}; // make all props in T optional
  boxOfZoo.fish = fish;
  boxOfZoo.dog = dog;
  boxOfZoo.amount = amount;
  return boxOfZoo as Zoo;
};

const sumyZoo = setZoo('tuna', 'sheepdog', 100);
console.log('<<< ----------------------');
console.log('<<< ~ sumyZoo', sumyZoo);
console.log('<<< ----------------------');

