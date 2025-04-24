import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RestClientService {

  constructor(private http: HttpClient) { }

  sendMessage(userMessage: string, personToImpersonate: string) {
    const userMessagePretext = "Please answer the following question as if you were an actor impersonating " + personToImpersonate + " (100 Tokens max): "
    const apiKey = 'add-your-api-key-here';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    });

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

    return this.http.post('https://api.x.ai/v1/chat/completions', requestBody, { headers });
  }

}
