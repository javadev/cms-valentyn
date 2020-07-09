import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IPreferences, Preferences } from 'app/shared/model/preferences.model';
import { PreferencesService } from './preferences.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'jhi-preferences-update',
  templateUrl: './preferences-update.component.html',
})
export class PreferencesUpdateComponent implements OnInit {
  isSaving = false;
  users: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    weeklyGoal: [null, [Validators.required, Validators.min(10), Validators.max(21)]],
    user: [],
  });

  constructor(
    protected preferencesService: PreferencesService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ preferences }) => {
      this.updateForm(preferences);

      this.userService.query().subscribe((res: HttpResponse<IUser[]>) => (this.users = res.body || []));
    });
  }

  updateForm(preferences: IPreferences): void {
    this.editForm.patchValue({
      id: preferences.id,
      weeklyGoal: preferences.weeklyGoal,
      user: preferences.user,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const preferences = this.createFromForm();
    if (preferences.id !== undefined) {
      this.subscribeToSaveResponse(this.preferencesService.update(preferences));
    } else {
      this.subscribeToSaveResponse(this.preferencesService.create(preferences));
    }
  }

  private createFromForm(): IPreferences {
    return {
      ...new Preferences(),
      id: this.editForm.get(['id'])!.value,
      weeklyGoal: this.editForm.get(['weeklyGoal'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPreferences>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: IUser): any {
    return item.id;
  }
}
