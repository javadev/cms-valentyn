import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IBloodPressure } from 'app/shared/model/blood-pressure.model';
import { BloodPressureService } from './blood-pressure.service';

@Component({
  templateUrl: './blood-pressure-delete-dialog.component.html',
})
export class BloodPressureDeleteDialogComponent {
  bloodPressure?: IBloodPressure;

  constructor(
    protected bloodPressureService: BloodPressureService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.bloodPressureService.delete(id).subscribe(() => {
      this.eventManager.broadcast('bloodPressureListModification');
      this.activeModal.close();
    });
  }
}
