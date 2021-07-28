export interface CheckList {
  id?: string;
  title?: string;
  checklists?: string[][];
}

export interface CheckListLevel {
  ids?: string[];
  title?: string;
}

export interface CheckListDetail {
  id?: string;
  title?: string;
  checklists?: CheckListLevel[];
}
