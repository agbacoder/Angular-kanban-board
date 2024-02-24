import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITasks } from '../models/tasks.model';

@Injectable({
  providedIn: 'root'
})
export class TaskDataService {
  


  constructor (private _http: HttpClient){ }

  newTask(data: any): Observable<any>{
      return this._http.post('http://localhost:3000/open_tasks', data)
  }
  updateTask(id: string, Task: string): Observable<any> {
    return this._http.put(`http://localhost:3000/open_tasks/${id}`, Task);

  }
  getAllTasks(): Observable<any>{
    return this._http.get(`http://localhost:3000/open_tasks?_sort=-date`)
}
deleteTask(id: string): Observable<any> {
  return this._http.delete(`http://localhost:3000/open_tasks/${id}`);
}
 


}
