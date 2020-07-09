import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IWeight, Weight } from 'app/shared/model/weight.model';
import { WeightService } from './weight.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'jhi-weight-update',
  templateUrl: './weight-update.component.html',
})
export class WeightUpdateComponent implements OnInit {
  isSaving = false;
  users: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    date: [null, [Validators.required]],
    weight: [],
    user: [],
  });

  constructor(
    protected weightService: WeightService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ weight }) => {
      if (!weight.id) {
        const today = moment().startOf('day');
        weight.date = today;
      }

      this.updateForm(weight);

      this.userService.query().subscribe((res: HttpResponse<IUser[]>) => (this.users = res.body || []));
    });
  }

  updateForm(weight: IWeight): void {
    this.editForm.patchValue({
      id: weight.id,
      date: weight.date ? weight.date.format(DATE_TIME_FORMAT) : null,
      weight: weight.weight,
      user: weight.user,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const weight = this.createFromForm();
    if (weight.id !== undefined) {
      this.subscribeToSaveResponse(this.weightService.update(weight));
    } else {
      this.subscribeToSaveResponse(this.weightService.create(weight));
    }
  }

  private createFromForm(): IWeight {
    return {
      ...new Weight(),
      id: this.editForm.get(['id'])!.value,
      date: this.editForm.get(['date'])!.value ? moment(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      weight: this.editForm.get(['weight'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IWeight>>): void {
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
