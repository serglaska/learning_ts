
// common
/// <reference path="common/base-component.ts"/>
/// <reference path="common/project.ts"/>
/// <reference path="common/list-project.ts"/>
/// <reference path="common/project-input.ts"/>
/// <reference path="common/project-item.ts"/>
// util
/// <reference path="util/autobind.ts"/>
/// <reference path="util/validation.ts"/>
// drag-and-drop
/// <reference path="drag-and-drop/drag-and-drop.ts"/>
// state
/// <reference path="state/state.ts"/>


namespace App {
  new ProjectInput();
  new ListProject('active');
  new ListProject('finished');
};
