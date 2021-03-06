import { Component, Inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { PokeapiService } from '../../../_common/services/pokeapi.service';
import { SharedService } from '../../../_common/services/shared.service';


@Component({
  selector: 'app-selected-move-',
  templateUrl: './selected-move.component.html',
  styleUrls: ['./selected-move.component.scss']
})
export class SelectedMoveComponent implements OnInit, OnDestroy {

  isLoading: boolean;
  data: any;

  sections: any[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public response: any,
    public cd: ChangeDetectorRef,
    public ref: MatDialogRef<SelectedMoveComponent>,
    public dialog: MatDialog,
    private api: PokeapiService,
    private shared: SharedService
  ) { }

  ngOnInit(): void {

    this.isLoading = true;
    this.sections = [ false, false, false, false, false, false, false, false ];
    
    this.api.flatMove(this.response.data).subscribe((res) => {

      this.data = res;
      this.cd.detectChanges();

      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.shared.dialogIsOpened = false;
  }

}
