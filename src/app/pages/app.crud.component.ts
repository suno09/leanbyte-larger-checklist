import { Component, OnInit } from "@angular/core";
import {
  CheckList,
  CheckListDetail,
  CheckListLevel,
} from "../demo/domain/checklist";
import { CheckListService } from "../demo/service/checklistservice";
import { ConfirmationService, MessageService } from "primeng/api";

@Component({
  templateUrl: "./app.crud.component.html",
  styleUrls: ["../demo/view/tabledemo.scss", "../demo/view/listdemo.scss"],
  styles: [
    `
      :host ::ng-deep .p-dialog .checkList-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
      }

      @media screen and (max-width: 960px) {
        :host
          ::ng-deep
          .p-datatable.p-datatable-customers
          .p-datatable-tbody
          > tr
          > td:last-child {
          text-align: center;
        }

        :host
          ::ng-deep
          .p-datatable.p-datatable-customers
          .p-datatable-tbody
          > tr
          > td:nth-child(6) {
          display: flex;
        }
      }
    `,
  ],
  providers: [MessageService, ConfirmationService],
})
export class AppCrudComponent implements OnInit {
  checklistDialog: boolean;

  checklistGroupDialog: boolean;

  checklists: CheckList[];

  sourceChecklists: CheckListLevel[];

  targetChecklists: CheckListLevel[];

  checklist: CheckList;

  checklistDetail: CheckListDetail;

  selectedChecklists: CheckList[];

  submitted: boolean;

  cols: any[];

  constructor(
    private checklistService: CheckListService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.checklistService
      .getCheckLists()
      .then((data) => (this.checklists = data));

    this.cols = [
      { field: "title", header: "Title" },
      { field: "group", header: "" },
    ];
  }

  /**
   * Open checklist model creation
   */
  openNew() {
    this.checklist = {};
    this.submitted = false;
    this.checklistDialog = true;
  }

  /**
   * Open checklist Group model creation
   */
  openNewGroup() {
    this.checklist = {};
    this.sourceChecklists = this.checklists
      .filter(
        (checklist) => !checklist.checklists || !checklist.checklists.length
      )
      .map((checklist) => ({
        ids: [checklist.id],
        title: checklist.title,
      }));
    this.targetChecklists = [];
    this.submitted = false;
    this.checklistGroupDialog = true;
  }

  /**
   * Add selected checklist source to checklist target in checklist group model
   */
  addChecklistToCheckList(event) {
    if (event.items.length < 2) {
      return;
    }

    let ids = event.items.map((clg) => clg.ids).flat();
    let title = event.items.map((clg) => clg.title).join(" / ");
    this.targetChecklists = [
      ...this.targetChecklists.slice(
        0,
        this.targetChecklists.length - event.items.length
      ),
      { ids: ids, title: title },
    ];
  }

  /**
   * Delete selected checklist target to checklist source in checklist group model
   */
  DelChecklistToCheckList(event) {
    let items = [];
    this.sourceChecklists.forEach((clg) => {
      if (clg.ids.length < 2) {
        items.push(clg);
      } else {
        let titles = clg.title.split(" / ");
        for (let i = 0; i < titles.length; i++) {
          items.push({ ids: [clg.ids[i]], title: titles[i] });
        }
      }
    });

    this.sourceChecklists = items;
  }

  /**
   * Delete selected checklist from table
   */
  deleteSelectedChecklists() {
    this.confirmationService.confirm({
      message: "Are you sure you want to delete the selected checklists?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.checklists = this.checklists.filter(
          (val) => !this.selectedChecklists.includes(val)
        );
        this.checklistService.delete(
          this.selectedChecklists.map((cl) => cl.id)
        );
        this.selectedChecklists = null;
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: "Checklists Deleted",
          life: 3000,
        });
      },
    });
  }

  /**
   * Edit the selected checklist group
   */
  EditSelectedChecklistGroup() {
    this.checklist = this.checklists.filter((val) =>
      this.selectedChecklists.includes(val)
    )[0];

    this.checklistService.getCheckListDetail(this.checklist.id).subscribe({
      next: (data) => {
        this.checklistDetail = data;
        let checklistDetailIds = this.checklistDetail.checklists
          .map((cll) => cll.ids)
          .flat();

        this.sourceChecklists = this.checklists
          .filter(
            (checklist) =>
              (!checklist.checklists || !checklist.checklists.length) &&
              !checklistDetailIds.includes(checklist.id)
          )
          .map((checklist) => ({
            ids: [checklist.id],
            title: checklist.title,
          }));
        this.targetChecklists = this.checklistDetail.checklists;
        this.submitted = false;
        this.checklistGroupDialog = true;
        this.selectedChecklists = null;
      },
      error: (error) => {
        console.error("There was an error!", error.message);
      },
    });
  }

  // editChecklist(checklist: CheckList) {
  //   this.checklist = { ...checklist };
  //   this.checklistDialog = true;
  // }

  /**
   * Delete the selected checklists 
   */
  deleteChecklist(checklist: CheckList) {
    this.confirmationService.confirm({
      message: "Are you sure you want to delete " + checklist.title + "?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.checklists = this.checklists.filter(
          (val) => val.id !== checklist.id
        );
        this.checklist = {};
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: "Checklist Deleted",
          life: 3000,
        });
      },
    });
  }

  hideDialog() {
    this.checklistDialog = false;
    this.submitted = false;
  }

  /**
   * Save the checklist
   */
  saveChecklist() {
    this.submitted = true;

    if (this.checklist.title.trim()) {
      if (this.checklist.id) {
        this.checklists[this.findIndexById(this.checklist.id)] = this.checklist;
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: "Checklist Updated",
          life: 3000,
        });
      } else {
        this.checklist = this.checklistService.save(this.checklist);
        if (this.checklist != null) {
          console.log("success");
          this.checklists.push(this.checklist);
          this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: "Checklist Created",
            life: 3000,
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Failure",
            detail: "Checklist not created",
            life: 3000,
          });
        }
      }

      this.checklists = [...this.checklists];
      this.checklistDialog = false;
      this.checklist = {};
    }
  }

  hideDialogGroup() {
    this.checklistGroupDialog = false;
    this.submitted = false;
  }

  /**
   * Save the checklist group
   */
  saveChecklistGroup() {
    this.submitted = true;

    let title = this.checklist.title.trim();

    if (!title) {
      this.messageService.add({
        severity: "error",
        summary: "Failure",
        detail: "Checklist title is required.",
        life: 3000,
      });
      return;
    }

    if (this.targetChecklists.length == 0) {
      this.messageService.add({
        severity: "error",
        summary: "Failure",
        detail: "Unless one item is required.",
        life: 3000,
      });
      return;
    }

    this.checklist.checklists = this.targetChecklists.map((clg) => clg.ids);

    if (this.checklist.id) {
      this.checklist = this.checklistService.save(this.checklist);
      this.messageService.add({
        severity: "success",
        summary: "Successful",
        detail: "Checklist Updated",
        life: 3000,
      });
    } else {
      this.checklist = this.checklistService.save(this.checklist);
      if (this.checklist != null) {
        this.checklists.push(this.checklist);
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: "Checklist Created",
          life: 3000,
        });
      } else {
        this.messageService.add({
          severity: "error",
          summary: "Failure",
          detail: "Checklist not created",
          life: 3000,
        });
        return;
      }
    }

    this.checklists = [...this.checklists];
    this.checklistGroupDialog = false;
    this.checklist = {};
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.checklists.length; i++) {
      if (this.checklists[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }
}
