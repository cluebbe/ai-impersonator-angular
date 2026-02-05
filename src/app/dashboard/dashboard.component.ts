import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { TrafficLightComponent } from "../traffic-light/traffic-light.component";
import { RestClientService } from '../rest-client.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, TrafficLightComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
    serverLoads: any = [
      { name: 'Server A', value: 12 },
  { name: 'Server B', value: 45 },
  { name: 'Server C', value: 78 },
  { name: 'Server D', value: 30 },
  { name: 'Server E', value: 55 },
  { name: 'Server F', value: 90 },
  { name: 'Server G', value: 22 },
  { name: 'Server H', value: 67 },
  { name: 'Server I', value: 49 },
  { name: 'Server J', value: 5 }
  ];
  employeeSalaryDistribution: any = [];

  constructor(public authService: AuthService, public restClient: RestClientService) { 
    this.restClient.getEmployeSalaryDistr().subscribe({
      next: (data) => {
        console.log('Employee Salary Distribution:', data);
        this.employeeSalaryDistribution = data;
      },
      error: (error) => {
        console.error('Error fetching employee salary distribution:', error);
      }
    });
  }

}
