/// <reference path="../common/project.ts"/>

namespace App {
  // Common State
  type Listener<T> = (items: T[]) => void;
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

  export const projectState = StateProject.getInstance()
}
