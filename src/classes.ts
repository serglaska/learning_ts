abstract class Department {
  // private readonly id: string;
  // private name: string;
  static fiscalYear = 2022;
  protected employees: string[] = [];

  constructor(protected readonly id: string, public name: string) {
    // this.id = id;
    // this.name = n;
  }

  abstract describe(this: Department): void;

  addEmployee(employee: string) {
    // validation etc
    // this.id = 'd2';
    this.employees.push(employee);
  }

  printEmployeeInformation() {
    console.log(this.employees.length);
    console.log(this.employees);
  }

  static createEmployee(name: string) {
    return { name: name };
  };
};

class ITDepartment extends Department {
  admins: string[];
  constructor(id: string, admins: string[]) {
    super(id, 'IT');
    this.admins = admins;
  }
  describe() {
    console.log('Describe class ' + this.id)
  }
}

class AccountingDepartment extends Department {
  private lastReport: string;
  private static instance: AccountingDepartment;
  private constructor(id: string, private reports: string[]) {
    super(id, 'Accounting');
    this.lastReport = reports[0];
  }

  addReport(text: string) {
    this.reports.push(text);
    this.lastReport = text;
  }

  printReports() {
    console.log(this.reports);
  }

  addEmployee(employee: string) {
    if (employee === 'Max') return;
    this.employees.push(employee);
  }

  get mostRecentReport() {
    if (this.lastReport) return this.lastReport;
    throw new Error('Not recent report');
  }

  set mostRecentReport(value: string) {
    if (!value) throw new Error('Value is invalid');
    this.reports.push(value);
  }

  describe() {
    console.log('Describe class ' + this.id)
  }

  static getInstance() {
    if (AccountingDepartment.instance) return AccountingDepartment.instance;
    this.instance = new AccountingDepartment('Accounting department', []);
    return this.instance;
  }
}

const it = new ITDepartment('IT department', ['Max']);

it.addEmployee('Max');
it.addEmployee('Manu');

// it.employees[2] = 'Anna';

it.describe();
it.name = 'NEW NAME';
it.printEmployeeInformation();

console.log(it);

// const accounting = new AccountingDepartment('Accounting department', []);
const accounting = AccountingDepartment.getInstance();


accounting.addEmployee('sergii');
accounting.addEmployee('Max');
accounting.printEmployeeInformation();
accounting.mostRecentReport = 'Sergii report';
// console.log(accounting.mostRecentReport, 'here');
accounting.addReport('Something went wrong...');
// accounting.printReports();
accounting.describe();

const employee = Department.createEmployee('Vlad');


// const accountingCopy = { name: 'DUMMY', describe: accounting.describe };

// accountingCopy.describe();