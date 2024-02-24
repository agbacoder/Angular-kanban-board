import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms'
import { TaskDataService } from '../services/task-data.service';
import { ITasks } from '../models/tasks.model';
import { ModalService } from '../services/modal.service';
@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styles: ``
})
export class NewTaskComponent implements OnInit, OnDestroy{

  @ViewChild('newTaskForm') newTaskForm!: NgForm; 


  ngOnInit(): void {
    this.modal.register('newTaskForm')

  }

  ngOnDestroy(): void {
    this.modal.unregister('newTaskForm')
  }

  constructor(private modal: ModalService, private _data: TaskDataService){

  }
  @Input() control: FormControl = new FormControl();
  @Output() taskAdded: EventEmitter<ITasks> = new EventEmitter<ITasks>();

credentials = {
    title: '',
    description: '',
    date: [new Date().toISOString()]
  }

onCreateTask = false;

  
showAlert = false
alertMsg = 'You are being logged in!'
alertColor = 'blue'

createTask(){
this.showAlert = true
this.alertMsg = 'Task is Being created'
this.alertColor = 'blue'
this.onCreateTask = true;


 try {
  this._data.newTask(this.credentials).subscribe({
    next: (task: ITasks) => {
      
      this.taskAdded.emit(task);
      this.showAlert = true;
      this.alertMsg = 'New task created successfully!';
      this.alertColor = 'green';
      this.newTaskForm.resetForm();
    }
   })
   
 } catch (e) {
  
  this.alertMsg = this.alertMsg = 'An unexpected error occured. Please try again!'
    this.alertColor = 'red'
    this.onCreateTask = false
    return
 }

 this.alertMsg = 'New task created successfully!'
    this.alertColor = 'green'
    setTimeout(() => {
      this.showAlert = false,
      this.onCreateTask = false

    }, 2000);
    this.onCreateTask = true
    
}
  
}
