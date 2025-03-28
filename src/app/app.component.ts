import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [NgFor, RouterModule, FormsModule],
})
@Injectable({ providedIn: 'root' })
export class AppComponent {
  title = 'ai-impersonator-angular';
  public userInput: string = '';
  public personToImpersonate: string = '';
  chatMessages: { sender: string; text: string }[] = [];

  constructor(private http: HttpClient) {}

  sendMessage() {
    if (this.userInput.trim()) {
      const userMessagePretext = "Please answer the following question as if you were an actor impersonating " + this.personToImpersonate + " (100 Tokens max): "
      const userMessage = this.userInput.trim();
      this.chatMessages.push({ sender: 'You', text: userMessage });
      this.userInput = '';

      // API key
      const apiKey = 'your-api-key';

      // Set headers
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      });

      // Construct the request body
      const requestBody = {
        model: 'grok-2-1212',
        messages: [
          {
            role: 'user',
            content: userMessagePretext + userMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: 100,
        stream: false,
      };

      // Call the XAI API
      this.http
        .post(
          'https://api.x.ai/v1/chat/completions',
          requestBody,
          { headers }
        )
        .subscribe((response: any) => {
          const assistantMessage = response.choices[0]?.message?.content || 'No response received.';
          console.log(response);
          this.chatMessages.push({ sender: this.personToImpersonate, text: assistantMessage  });
        });
    }
  }
}
