/// <reference path="../util/autobind.ts"/>

namespace App {
  // ListProject
  export class ListProject extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
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
}
