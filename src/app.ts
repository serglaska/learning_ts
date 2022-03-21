class ProjectInput {
  element: HTMLFormElement;
  hostElement: HTMLDivElement;
  templateElement: HTMLTemplateElement;

  titleInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;

  constructor() {
    const hostElement = document.getElementById('app')! as HTMLDivElement;
    const templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
    this.templateElement = templateElement;
    this.hostElement = hostElement;

    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = 'user-input';

    this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;

    this.configure(); // execute this method when we create Class use new
    this.attach();
    this.log();
  }
  private submitMethod(event: Event) {
    event.preventDefault();
    console.log(this.titleInputElement.value)
  }

  private configure() {
    console.log(this, 'this inside')
    this.element.addEventListener('submit', this.submitMethod.bind(this))
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }

  log() {
    console.log('This code is working...');
  }
};

const project = new ProjectInput();
