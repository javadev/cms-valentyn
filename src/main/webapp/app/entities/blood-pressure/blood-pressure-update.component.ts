import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IBloodPressure, BloodPressure } from 'app/shared/model/blood-pressure.model';
import { BloodPressureService } from './blood-pressure.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'jhi-blood-pressure-update',
  templateUrl: './blood-pressure-update.component.html',
})
export class BloodPressureUpdateComponent implements OnInit {
  isSaving = false;
  users: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    date: [null, [Validators.required]],
    systolic: [],
    diastolic: [],
    user: [],
  });

  constructor(
    protected bloodPressureService: BloodPressureService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bloodPressure }) => {
      if (!bloodPressure.id) {
        const today = moment().startOf('day');
        bloodPressure.date = today;
      }

      this.updateForm(bloodPressure);

      this.userService.query().subscribe((res: HttpResponse<IUser[]>) => (this.users = res.body || []));
    });
  }

  updateForm(bloodPressure: IBloodPressure): void {
    this.editForm.patchValue({
      id: bloodPressure.id,
      date: bloodPressure.date ? bloodPressure.date.format(DATE_TIME_FORMAT) : null,
      systolic: bloodPressure.systolic,
      diastolic: bloodPressure.diastolic,
      user: bloodPressure.user,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bloodPressure = this.createFromForm();
    if (bloodPressure.id !== undefined) {
      this.subscribeToSaveResponse(this.bloodPressureService.update(bloodPressure));
    } else {
      this.subscribeToSaveResponse(this.bloodPressureService.create(bloodPressure));
    }
  }

  private createFromForm(): IBloodPressure {
    return {
      ...new BloodPressure(),
      id: this.editForm.get(['id'])!.value,
      date: this.editForm.get(['date'])!.value ? moment(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      systolic: this.editForm.get(['systolic'])!.value,
      diastolic: this.editForm.get(['diastolic'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBloodPressure>>): void {
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
