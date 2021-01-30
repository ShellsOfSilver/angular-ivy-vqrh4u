import { Component, Input } from "@angular/core";

import { DataService } from "../../data.service";

@Component({
  selector: "my-expert-matrix",
  templateUrl: "./expert-matrix.component.html",
  styleUrls: ["./expert-matrix.component.css"]
})
export class ExpertMatrixComponent {
  @Input() stepper;

  constructor(public dataService: DataService) {}
}
