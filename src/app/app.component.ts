import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  subject = new Subject<number>();
  voltage = new Subject<number>();
  weight: any = null;
  temperature: any = null;
  ngOnInit(): void {
    this.calculateWeight();
    this.calculateTemperature();
  }
  onInputChange(event: any) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.subject.next(parseInt(inputValue));
  }

  onInputVoltageChange(event: any) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.voltage.next(parseInt(inputValue));
  }

  calculateWeight() {
    this.subject.subscribe((value) => {
      const calibrationFactor = 200; // Adjust based on your calibration
      const offset = -500; // Adjust based on your calibration
      const weight = (value - offset) / calibrationFactor;
      this.weight = weight;
    });
  }

  calculateTemperature() {
    this.voltage.subscribe((value) => {
      const referenceVoltage = 5; // Adjust based on your setup
      const fixedResistance = 10000; // Adjust based on your voltage divider
      const thermistorResistance =
        fixedResistance * (referenceVoltage / value - 1);

      // Use Steinhart-Hart equation or look-up table for conversion
      // (example using Steinhart-Hart equation):
      const A = 1.009249522e-3;
      const B = 2.378405444e-4;
      const C = 2.019202697e-7;
      const temperatureKelvin =
        1 /
        (A +
          B * Math.log(thermistorResistance) +
          C * Math.pow(Math.log(thermistorResistance), 3));
      const temperatureCelsius = temperatureKelvin - 273.15;

      this.temperature = temperatureCelsius;
    });
  }

  calculateArea() {
    const sensorData: number[] = [];

    // Calibration data (replace with your actual values)
    const calibrationFactor = 0.05; // Adjust based on your setup
    const referenceArea = 100; // Adjust based on your calibration figure
    const referenceReading = 500; // Adjust based on your calibration reading

    function estimateArea(reading: number) {
      // Apply calibration and estimation equation
      const estimatedArea =
        calibrationFactor *
        ((referenceArea * (referenceReading - reading)) / reading);
      return estimatedArea;
    }

    // Function to simulate sensor readings (replace with actual data)
    function simulateSensorData() {
      // Example data for demonstration
      sensorData.push(800);
      sensorData.push(750);
      sensorData.push(680);
      // ...
    }

    // Process sensor data and display results
    function processData() {
      for (const reading of sensorData) {
        const estimatedArea = estimateArea(reading);
        console.log('Estimated area:', estimatedArea);
      }
    }

    // Example usage
    simulateSensorData();
    processData();
  }
}
