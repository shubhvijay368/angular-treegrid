import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { frozenSampleData } from './jsontreegriddata';
import {
  FreezeService,
  TreeGridComponent,
  SortService,
  SelectionService,
} from '@syncfusion/ej2-angular-treegrid';
import { freezeDirection, Column } from '@syncfusion/ej2-grids';
import {
  DropDownListComponent,
  ChangeEventArgs,
} from '@syncfusion/ej2-angular-dropdowns';
import {
  DialogComponent,
  ButtonPropsModel,
} from '@syncfusion/ej2-angular-popups';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [FreezeService, SortService],
})
export class AppComponent {
  public filterSettings: Object;

  @ViewChild('treegrid')
  public treegrid: TreeGridComponent;
  @ViewChild('columndropdown')
  public columnDropDown: DropDownListComponent;
  @ViewChild('directiondropdown')
  public directionDropDown: DropDownListComponent;
  @ViewChild('alertDialog')
  public alertDialog: DialogComponent;
  public visible: boolean = false;
  public fields: object = { text: 'name', value: 'id' };
  public animationSettings: object = { effect: 'None' };
  public content: string = 'Atleast one Column should be in movable';
  public header: string = 'Frozen';
  public showCloseIcon: boolean = false;
  public target: string = '.control-section';
  public width: string = '300px';
  public data: Object[] = [];
  public refresh: boolean = true;
  public columnData: Object[] = [
    { id: 'taskID', name: 'Task ID' },
    { id: 'taskName', name: 'TaskName' },
    { id: 'startDate', name: 'Start Date' },
    { id: 'endDate', name: 'End Date' },
    { id: 'duration', name: 'Duration' },
    { id: 'progress', name: 'Progress' },
    { id: 'priority', name: 'Priority' },
    { id: 'designation', name: 'Designation' },
    { id: 'employeeID', name: 'EmployeeID' },
    { id: 'approved', name: 'Approved' },
  ];
  public directionData: Object[] = [
    { id: 'Left', name: 'Left' },
    { id: 'Right', name: 'Right' },
    { id: 'Center', name: 'Center' },
  ];

  ngOnInit(): void {
    this.data = frozenSampleData;
    this.filterSettings = {
      type: 'FilterBar',
      hierarchyMode: 'Parent',
      mode: 'Immediate',
    };
  }
  public columnChange(e: ChangeEventArgs): void {
    let columnName: string = e.value as string;
    let column: Column = this.treegrid.grid.getColumnByField(columnName);
    let value: string = column.freeze === undefined ? 'Center' : column.freeze;
    this.refresh = this.directionDropDown.value === value;
    this.directionDropDown.value = value;
  }

  public directionChange(e: ChangeEventArgs): void {
    if (this.refresh) {
      let columnName: string = this.columnDropDown.value as string;
      let mvblColumns: Column[] = this.treegrid.grid.getMovableColumns();
      if (
        mvblColumns.length === 1 &&
        columnName === mvblColumns[0].field &&
        e.value !== mvblColumns[0].freeze
      ) {
        this.alertDialog.show();
        this.refresh = false;
        this.directionDropDown.value = 'Center';
        this.directionDropDown.refresh();
      } else {
        this.treegrid.grid.getColumnByField(columnName).freeze =
          e.value === 'Center' ? undefined : (e.value as freezeDirection);
        this.treegrid.refreshColumns();
      }
    }
    this.refresh = true;
  }

  public alertDialogBtnClick = (): void => {
    this.alertDialog.hide();
  };

  public dlgButtons: ButtonPropsModel[] = [
    {
      click: this.alertDialogBtnClick.bind(this),
      buttonModel: { content: 'OK', isPrimary: true },
    },
  ];
}
