import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPreferences } from 'app/shared/model/preferences.model';
import { PreferencesService } from './preferences.service';

@Component({
  templateUrl: './preferences-delete-dialog.component.html',
})
export class PreferencesDeleteDialogComponent {
  preferences?: IPreferences;

  constructor(
    protected preferencesService: PreferencesService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.preferencesService.delete(id).subscribe(() => {
      this.eventManager.broadcast('preferencesListModification');
      this.activeModal.close();
    });
  }
}
