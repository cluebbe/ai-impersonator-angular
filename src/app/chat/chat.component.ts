import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { RestClientService } from '../rest-client.service';
import { NotificationService } from '../notification/notification.service';
import { not } from 'rxjs/internal/util/not';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  imports: [NgFor, FormsModule],
})
export class ChatComponent {
  @ViewChild('chatMessagesContainer') chatMessagesContainer!: ElementRef;

  public userInput: string = '';
  public personToImpersonate: string = '';
  chatMessages: { sender: string; text: string }[] = [];

  constructor(private restClient: RestClientService, private notify: NotificationService) {}

  sendMessage() {
    
    if (this.userInput.trim()) {
      
      const userMessage = this.userInput.trim();
      this.chatMessages.push({ sender: 'You', text: userMessage });
      this.userInput = '';
      this.restClient.sendMessage(userMessage, this.personToImpersonate)
        .subscribe({
          next:(response: any) => {
            const assistantMessage = response.choices[0]?.message?.content || 'No response received.';
            console.log(response);
            this.chatMessages.push({ sender: this.personToImpersonate, text: assistantMessage  });
            setTimeout(() => {
              this.chatMessagesContainer.nativeElement.scrollTop = this.chatMessagesContainer.nativeElement.scrollHeight;
            }, 500);
          }, 
          error:(error: any) => {
            //alert('Error:' + error.message + '\nCause:' + error.cause.error);
            this.notify.addNotification({type: 'ERROR', message: 'Error: ' + error.message + '\nCause: ' + error.cause.error});
          }       
        });
      


      }
    }
}
