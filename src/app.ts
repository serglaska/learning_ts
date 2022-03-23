// Class Project

enum ProjectStatus { Active, Finished };

type Listener<T> = (items: T[]) => void;

class Project {
  constructor(
    public id: string,
    public title: string,
    public people: number,
    public description: string,
    public status: ProjectStatus
  ) {
  }
}

// Drag and Drop
interface Draggable {
  dragEndHandler(event: DragEvent): void;
  dragStartHandler(event: DragEvent): void;
}

interface DragTarget {
  dropHandler(event: DragEvent): void;
  dragOverHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

// Validate
interface ValidateInput {
  min?: number;
  max?: number;
  maxLength?: number;
  minLength?: number;
  required?: boolean;
  value: string | number;
}

function validate(objForValidate: ValidateInput) {
  let isValid = true;
  if (objForValidate.required) {
    isValid = isValid && objForValidate.value.toString().trim().length > 0;
  }

  if (objForValidate.minLength != null && typeof objForValidate.value === 'string') {
    isValid = isValid && objForValidate.value.length >= objForValidate.minLength;
  }

  if (objForValidate.maxLength != null && typeof objForValidate.value === 'string') {
    isValid = isValid && objForValidate.value.length <= objForValidate.maxLength;
  }

  if (objForValidate.min != null && typeof objForValidate.value === 'number') {
    isValid = isValid && objForValidate.value >= objForValidate.min;
  }

  if (objForValidate.max != null && typeof objForValidate.value === 'number') {
    isValid = isValid && objForValidate.value <= objForValidate.max;
  }

  return isValid;
}

// Common State
class State<T>{
  protected listeners: Listener<T>[] = [];

  addListener(listenFunction: Listener<T>) {
    this.listeners.push(listenFunction);
  }
}

// Project state management
class StateProject extends State<Project>{
  private projects: Project[] = [];
  private static instance: StateProject;

  private constructor() {
    super()
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    } else {
      this.instance = new StateProject();
      return this.instance;
    }
  }

  addProject(title: string, description: string, numbOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      numbOfPeople,
      description,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    this.updateListeners();
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find(prj => prj.id === projectId);
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }

  private updateListeners() {
    for (const listenerFunc of this.listeners)
      listenerFunc(this.projects.slice())
  }
}

const projectState = StateProject.getInstance();

// autobind
function autobind(_: any, _1: string, descriptor: PropertyDescriptor) {
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

// Component Base class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  element: U;
  hostElement: T;
  templateElement: HTMLTemplateElement;

  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.hostElement = document.getElementById(hostElementId)! as T;
    this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;

    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = importedNode.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(insertAtStart)
  }

  private attach(insertBegin: boolean) {
    this.hostElement.insertAdjacentElement(insertBegin ? 'afterbegin' : 'beforeend', this.element);
  }

  abstract configure(): void
  abstract renderContent(): void
}

// ProjectItem class
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
  private project: Project;
  get persons() {
    if (this.project.people === 1) return '1 person';
    return `${this.project.people} persons`
  }

  constructor(hostId: string, project: Project) {
    super('single-project', hostId, false, project.id);
    this.project = project;
    this.configure();
    this.renderContent();
  }

  dragEndHandler(_: DragEvent) { }

  @autobind
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData('text/plain', this.project.id);
    event.dataTransfer!.effectAllowed = 'move';
  }

  configure() {
    this.element.addEventListener('dragstart', this.dragStartHandler);
    this.element.addEventListener('dragend', this.dragEndHandler);
  }

  renderContent() {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('p')!.textContent = this.project.description;
    this.element.querySelector('h3')!.textContent = this.persons + ' assigned';
  }
}

// ListProject
class ListProject extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
  assignedProjects: Project[];

  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', false, `${type}-projects`)
    this.assignedProjects = [];

    this.configure()
    this.renderContent();
  }

  @autobind
  dragLeaveHandler(_: DragEvent): void {
    const listElement = this.element.querySelector('ul')!;
    listElement.classList.remove('droppable');
  }

  @autobind
  dragOverHandler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault();
      const listElement = this.element.querySelector('ul')!;
      listElement.classList.add('droppable');
    }
  }

  @autobind
  dropHandler(event: DragEvent) {
    const prjId = event.dataTransfer!.getData('text/plain');
    projectState.moveProject(prjId, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished)
  }

  configure() {
    this.element.addEventListener('drop', this.dropHandler);
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);

    projectState.addListener((projects: Project[]) => {
      const relevantProject = projects.filter(prj => {
        if (this.type === 'active') {
          return prj.status === ProjectStatus.Active
        } else {
          return prj.status === ProjectStatus.Finished
        }
      })
      this.assignedProjects = relevantProject;
      this.renderProjects();
    })
  }

  private renderProjects() {
    const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
    listEl.innerHTML = '';
    for (const projItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector('ul')!.id, projItem)
      // --- old flow
      // const listItem = document.createElement('li');
      // listItem.textContent = projItem.title;
      // listEl.appendChild(listItem);
    }
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent = `${this.type.toUpperCase()} PROJECTS`;
  }
}

// ProjectInput
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;

  constructor() {
    super('project-input', 'app', true, 'user-input')
    this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;

    this.configure();
    this.log();
  }

  configure() {
    this.element.addEventListener('submit', this.submitMethod)
  }

  @autobind
  private submitMethod(event: Event) {
    event.preventDefault();
    const userInputs = this.gatherUserInput();
    if (Array.isArray(userInputs)) {
      const [title, description, peopleAmount] = userInputs;
      projectState.addProject(title, description, +peopleAmount);
      this.clearInputs();
    }
  }

  private clearInputs() {
    this.titleInputElement.value = '';
    this.peopleInputElement.value = '';
    this.descriptionInputElement.value = '';
  }

  renderContent(): void { }

  private gatherUserInput(): [string, string, number] | void {
    const titleInput = this.titleInputElement.value;
    const peopleInput = this.peopleInputElement.value;
    const descriptionInput = this.descriptionInputElement.value;

    const titleInputValid: ValidateInput = {
      minLength: 3,
      maxLength: 20,
      required: true,
      value: titleInput
    };

    const descriptionInputValid: ValidateInput = {
      minLength: 3,
      maxLength: 150,
      required: true,
      value: descriptionInput
    };

    const peopleInputValid: ValidateInput = {
      min: 1,
      max: 50,
      required: true,
      value: +peopleInput
    };

    if (!validate(titleInputValid) ||
      !validate(descriptionInputValid) ||
      !validate(peopleInputValid)
    ) {
      alert('Put correct values, not empty strings')
    } else {
      return [titleInput, descriptionInput, +peopleInput];
    }
  }

  log() {
    console.log('This code is working...');
  }
};

const project = new ProjectInput();
const activeListsProject = new ListProject('active');
const finishedListsProject = new ListProject('finished');
