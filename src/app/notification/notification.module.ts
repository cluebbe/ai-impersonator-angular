import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification/notification.component';
import { NotificationService } from './notification.service';



@NgModule({
  declarations: [NotificationComponent],
  imports: [
    CommonModule
  ],
  exports: [NotificationComponent]
})
export class NotificationModule { }
