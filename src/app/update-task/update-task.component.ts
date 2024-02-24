import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { TaskDataService } from '../services/task-data.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ITasks } from '../models/tasks.model';

@Component({
  selector: 'app-update-task',
  templateUrl: './update-task.component.html',
  styles: ``
})
export class UpdateTaskComponent implements OnInit, OnDestroy, OnChanges {

  @Input() activeTask: ITasks | null = null
  
  
  inSubmission = false;

  showAlert = false
  alertMsg = 'Please wait! Updating clip.'
  alertColor = 'blue'

  @Output() update: EventEmitter<ITasks> = new EventEmitter<ITasks>()


  constructor(private modal: ModalService, 
    private _data: TaskDataService, 
    private _fb: FormBuilder){
     
  }

  taskId = new FormControl('', {
    nonNullable: true
  })
  title = new FormControl('',{
    validators: [
      Validators.required
    ],
    nonNullable: true
  })
  description = new FormControl('',{
     validators: [
      Validators.required
    ],
    nonNullable: true
  })
  date = new FormControl(this.activeTask?.date , {
    nonNullable: true
  })

  updateTaskForm = new FormGroup({
    title: this.title,
    description: this.description,
    date: this.date
  })
  
  ngOnInit(): void {
    this.modal.register('updateTaskForm')
    this.updateTaskForm.patchValue(this.activeTask as ITasks)
    

  }

  ngOnDestroy(): void {
    this.modal.unregister('updateTaskForm')
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.activeTask){
      return
    }
    this.inSubmission = false
    this.showAlert = false
    this.taskId.setValue(this.activeTask.id as string)
    this.title.setValue(this.activeTask.title)
    this.description.setValue(this.activeTask.description)
    this.date.setValue(this.activeTask.date)

    
  }
  

  submit() {
    if(!this.updateTaskForm.valid) {
      return
    }
    this._data.updateTask(this.taskId.value, this.updateTaskForm.value as string).subscribe({
      next: (res: ITasks) => {
        this.date.setValue(this.activeTask?.date);

      this.update.emit(res);

      this.updateTaskForm.reset();
      this.showAlert = true;
      this.alertMsg = 'Success! Task updated.';
      this.alertColor = 'green';
      setTimeout(() => {
        this.showAlert = false  
      }, 2000);
    
      },
      error: (err) => {
        this.showAlert = true;
      this.alertMsg = 'An error occurred! Please try again.';
      this.alertColor = 'red';
      }
      
    })

  }
}
