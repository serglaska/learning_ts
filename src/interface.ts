// type AdFunc = (n1: number, n2: number) => number | void;  first way

interface AdFunc {
  (first: number, second: number): number | void;
}

const add: AdFunc = (firstNum: number, secondNum: number) => firstNum + secondNum && console.log(firstNum + secondNum);

add(44, 99);
interface Named {
  secondName?: string;
  readonly name: string;
};

interface Greetable extends Named {
  greet: (phrase: string) => void;
};

interface Style {
  sport: string;
};

class Person implements Greetable, Style {
  age = '300';
  name: string;
  sport: string;
  secondName?: string;
  constructor(n: string, s: string, secondName?: string) {
    this.name = n;
    this.sport = s;
    if (secondName) {
      this.secondName = secondName;
    }
  }

  greet(phrase: string) {
    console.log('Hello my name is ' + this.name + ' My age ' + this.age + ' My sport is ' + this.sport + ' ' + phrase)
  }
};

let userOne: Greetable;

userOne = new Person('Nike', 'swimming');

// userOne.name = 'Kif' readonly flow

userOne.greet('Welcome');

console.log(userOne)