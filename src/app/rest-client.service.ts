import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';

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
      model: 'grok-4',
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

    return this.http.post('https://api.x.ai/v1/chat/completions', requestBody, { headers }).pipe(catchError(this.handleError) );
  }

  getEmployeSalaryDistr() {

    return this.http.get('http://localhost:3000/employe-salary-distribution' ).pipe(catchError(this.handleError) );
  }


  private handleError(error: HttpErrorResponse) {
    if( error.status === 0){
      console.error('A client-side or network error occurred:', error.error);
    } else {
      console.error('Backend returned code ' + error.status, error.error);
    }

    return throwError(() => new Error('Something bad happened; please try again later.', {cause: error.error}));
  }
}
