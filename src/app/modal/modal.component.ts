import { Component, Input, ElementRef, OnDestroy, Inject, PLATFORM_ID, Optional, Output, EventEmitter } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ModalService } from '../services/modal.service';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
})
export class ModalComponent implements OnDestroy {
  @Input() modalID = '';



  constructor(
    public modal: ModalService,
    public el: ElementRef,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      document.body.appendChild(this.el.nativeElement);
    }
  }

  closeModal() {
    this.modal.toggleModal(this.modalID);
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.removeChild(this.el.nativeElement)
    }
    }
    
}
