import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AuthService } from '../auth.service';
import { TrafficLightComponent } from "../traffic-light/traffic-light.component";
import { UsagePricePipe } from '../pipes/usage-price.pipe';
import { CurrencyConvertPipe } from '../pipes/currency-convert.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, CurrencyPipe, TrafficLightComponent, UsagePricePipe, CurrencyConvertPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
    selectedCurrency = 'USD';

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


  constructor(public authService: AuthService) { 

  }

}
