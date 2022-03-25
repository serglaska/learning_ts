/// <reference path="../util/autobind.ts"/>

namespace App {
  // ProjectInput
  export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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

    log() {
      console.log('This code is working...');
    }
  };
}
