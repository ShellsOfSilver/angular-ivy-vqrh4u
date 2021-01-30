import { Component } from "@angular/core";

import { DataService } from "../../data.service";

@Component({
  selector: "my-chart",
  templateUrl: "./chart.component.html",
  styleUrls: ["./chart.component.css"]
})
export class ChartComponent {
  constructor(public dataService: DataService) {}
}
