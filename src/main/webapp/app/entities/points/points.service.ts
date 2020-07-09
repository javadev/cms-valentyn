import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IPoints } from 'app/shared/model/points.model';

type EntityResponseType = HttpResponse<IPoints>;
type EntityArrayResponseType = HttpResponse<IPoints[]>;

@Injectable({ providedIn: 'root' })
export class PointsService {
  public resourceUrl = SERVER_API_URL + 'api/points';

  constructor(protected http: HttpClient) {}

  create(points: IPoints): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(points);
    return this.http
      .post<IPoints>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(points: IPoints): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(points);
    return this.http
      .put<IPoints>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPoints>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPoints[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(points: IPoints): IPoints {
    const copy: IPoints = Object.assign({}, points, {
      date: points.date && points.date.isValid() ? points.date.format(DATE_FORMAT) : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date ? moment(res.body.date) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((points: IPoints) => {
        points.date = points.date ? moment(points.date) : undefined;
      });
    }
    return res;
  }
}
