import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CheckList, CheckListDetail } from "../domain/checklist";

@Injectable()
export class CheckListService {
  constructor(private http: HttpClient) {}

  getCheckLists() {
    return this.http
      .get<any>("http://localhost:8080/checklists")
      .toPromise()
      .then((res) => res as CheckList[]);
  }

  getCheckList(id) {
    return this.http
      .get<any>("http://localhost:8080/checklists/" + id)
      .toPromise()
      .then((res) => res as CheckList);
  }

  getCheckListDetail(id) {
    return this.http.get<any>("http://localhost:8080/checklists/detail/" + id);
    // .toPromise()
    // .then(res => res as CheckListDetail)
  }

  save(checklist: CheckList) {
    this.http
      .post<CheckList>("http://localhost:8080/checklists", checklist)
      .subscribe({
        next: (data) => {
          checklist = data;
        },
        error: (error) => {
          checklist = null;
          console.error("There was an error!", error);
        },
      });

    return checklist;
  }

  delete(checklists: string[]) {
    this.http
      .post<boolean>("http://localhost:8080/checklists/delete", checklists)
      .subscribe({
        next: (data) => {
          return true;
        },
        error: (error) => {
          checklists = null;
          console.error("There was an error!", error);
          return false
        },
      });
  }
}
