import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-traffic-light',
  imports: [CommonModule],
  templateUrl: './traffic-light.component.html',
  styleUrls: ['./traffic-light.component.css'],
  standalone: true
})
export class TrafficLightComponent {
  @Input() value: number = 0;
  @Input() height: number = 100; // default height in px

  get currentColor(): 'red' | 'yellow' | 'green' {
    if (this.value < 33) return 'green';
    if (this.value < 66) return 'yellow';
    return 'red';
  }

  // Derived dimensions
  get containerStyle() {
    return {
      height: `${this.height}px`
    };
  }
  get trafficLightStyle() {
    return {
      width: `${this.height * 0.5}px`,
      padding: `${this.height * 0.16}px ${this.height * 0.08}px`,
      gap: `${this.height * 0.12}px`,
      borderRadius: `${this.height * 0.2}px`
    };
  }
  get lightStyle() {
    const size = this.height * 0.32;
    return {
      width: `${size}px`,
      height: `${size}px`
    };
  }
}
