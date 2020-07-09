import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IWeight } from 'app/shared/model/weight.model';
import { WeightService } from './weight.service';

@Component({
  templateUrl: './weight-delete-dialog.component.html',
})
export class WeightDeleteDialogComponent {
  weight?: IWeight;

  constructor(protected weightService: WeightService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.weightService.delete(id).subscribe(() => {
      this.eventManager.broadcast('weightListModification');
      this.activeModal.close();
    });
  }
}
