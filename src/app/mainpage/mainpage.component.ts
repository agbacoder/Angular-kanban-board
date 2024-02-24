import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { ModalService } from '../services/modal.service'
import { TaskDataService } from '../services/task-data.service';
import { ITasks } from '../models/tasks.model';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styles: ``
})
export class MainpageComponent implements OnInit {

  ngOnInit(): void {
    this.getFromStorage();

  }

  constructor(public modal: ModalService, public _data:TaskDataService){
   
  }


  open: ITasks[] = [];
  pending: ITasks[] = [];
  inProgress: ITasks[] = [];
  completed: ITasks[] = [];
  
  activeTask: ITasks | null = null

  
    
  getFromStorage() {
    const openTasks = localStorage.getItem('tasks');
    if (openTasks !== null){
      this.open = JSON.parse(openTasks);
    }

    const pendingTasks = localStorage.getItem('pendingTasks');
    if (pendingTasks !== null){
      this.pending = JSON.parse(pendingTasks);
    }

    const inProgressTasks = localStorage.getItem('inProgressTasks');
    if (inProgressTasks !== null){
      this.inProgress = JSON.parse(inProgressTasks);
    }

    const completedTasks = localStorage.getItem('completedTasks');
    if (completedTasks !== null){
      this.completed = JSON.parse(completedTasks);
    }
  }

  saveToStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.open));
    localStorage.setItem('pendingTasks', JSON.stringify(this.pending));
    localStorage.setItem('inProgressTasks', JSON.stringify(this.inProgress));
    localStorage.setItem('completedTasks', JSON.stringify(this.completed));
  }


  openNewTaskModal($event: Event){
    $event.preventDefault()
    this.modal.toggleModal('newTaskForm');
  }
  openUpdateTaskModal($event: Event, task: ITasks){
    $event.preventDefault()
    this.activeTask = task
    this.modal.toggleModal('updateTaskForm');
  }



  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    this.saveToStorage();
  }

  
  
  getOpenTasks(){
    this._data.getAllTasks( ).subscribe({
      next: (res) => {
        this.open = [];

        this.open.push(...res);
      },  error: (err) => {
        console.error('Error fetching tasks:', err);
      }
    }
     
    )
  }
  getLatestTasks(){
    this._data.getAllTasks( ).subscribe({
      next: (res) => {
        localStorage.setItem('tasks', JSON.stringify(res));
        this.open.unshift(res[0])
      },  error: (err) => {
        console.error('Error fetching tasks:', err);
      }
    }
     
    )
  }
 
 

  onTaskAdded(task: ITasks) {
    this.getLatestTasks()
  }
  deleteOpenTask($event: Event, taskid: string){
    $event.preventDefault();
    this._data.deleteTask(taskid).subscribe({
      next: (res) => {
      
        [this.open, this.pending, this.inProgress, this.completed].forEach(array => {
          const index = array.findIndex(task => task.id === taskid);
          if (index !== -1) {
            array.splice(index, 1); // Remove the task from the array
            this.saveToStorage()
          }
        });
      },
      
    });
  }
  onTaskUpdated($event: ITasks) {
    const arrays = [this.open, this.pending, this.inProgress, this.completed];
    arrays.forEach(array => {
      const index = array.findIndex(task => task.id === $event.id);
      if (index !== -1) {
        array[index] = $event;
      }
      this.saveToStorage()
    });
  }

  
 
 
 }

