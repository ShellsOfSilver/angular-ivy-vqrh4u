import { Component } from "@angular/core";

import { DataService } from "../../data.service";

@Component({
  selector: "my-aggregation-methods",
  templateUrl: "./aggregation-methods.component.html",
  styleUrls: ["./aggregation-methods.component.css"]
})
export class AggregationMethodsComponent {
  methods: Array<string>;
  constructor(public dataService: DataService) {
    this.methods = [
      "Aggregation of generalized trapezoidal LT",
      "Pessimistic position",
      "Optimistic position"
    ];
  }
}
