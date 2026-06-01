import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Transferencia } from '../features/page-transition/models/transferencia';

@Injectable({
  providedIn: 'root',
})
export class TransferenciaService {
  private http = inject(HttpClient);

  private api = `${environment.apiUrl}/transferencias`;

    listar(): Observable<Transferencia[]> {
    return this.http.get<Transferencia[]>(this.api);
  }

  buscarPorId(id: number): Observable<Transferencia> {
    return this.http.get<Transferencia>(`${this.api}/${id}`);
  }

  criar(transferencia: Transferencia): Observable<Transferencia> {
    return this.http.post<Transferencia>(
      this.api,
      transferencia
    );
  }

  atualizar(
    id: number,
    transferencia: Transferencia
  ): Observable<Transferencia> {

    return this.http.put<Transferencia>(
      `${this.api}/${id}`,
      transferencia
    );
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.api}/${id}`
    );
  }
}
