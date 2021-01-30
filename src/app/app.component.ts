import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

import { DataService } from "./data.service";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(
    private dataService: DataService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: [""]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: [""]
    });
  }
}
