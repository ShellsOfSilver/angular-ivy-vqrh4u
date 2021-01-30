import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
  providedIn: "root"
})
export class DataService {
  initFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder) {}

  initForm() {
    this.initFormGroup = this._formBuilder.group({
      numberAlternatives: [""],
      numberCriteria: [""],
      numberLT: [""]
    });
  }
}
