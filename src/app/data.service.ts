import { Injectable } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
  providedIn: "root"
})
export class DataService {
  initFormGroup: FormGroup;
  linguisticTerms: FormArray;

  constructor(private _formBuilder: FormBuilder) {}

  initForm() {
    this.initFormGroup = this._formBuilder.group({
      numberAlternatives: [""],
      numberCriteria: [""],
      numberLT: [""]
    });
  }

  setLinguisticTerms() {
    const col = this.initFormGroup.get("numberLT").value;
    this.linguisticTerms = new FormArray([]);

    for (let i = 0; i < col; i++) {
      this.linguisticTerms.push(this.getLinguisticTerm());
    }
  }

  getLinguisticTermByIndex(index: number) {
    return this.linguisticTerms.at(index) as FormGroup;
  }

  private getLinguisticTerm(): FormGroup {
    return this._formBuilder.group({
      fullName: [""],
      shortName: [""],
      range: this._formBuilder.group({
        low: [""],
        medium: [""],
        height: [""]
      })
    });
  }

  setLinguisticRandom() {
    let index = 0;
    for (let control of this.linguisticTerms.controls) {
      index++;
      control.setValue({
        fullName: ["Full Name " + index],
        shortName: ["SN" + index],
        range: {
          low: (index - 1) * 25,
          medium: index * 25,
          height: (index + 1) * 25
        }
      });
    }
  }

  setInitRandom() {
    this.initFormGroup.setValue({
      numberAlternatives: 4,
      numberCriteria: 8,
      numberLT: 5
    });
  }
}
