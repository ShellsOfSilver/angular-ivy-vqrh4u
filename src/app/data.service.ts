import { Injectable } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";

import { ChartComponent } from "./pages/chart/chart.component";

@Injectable({
  providedIn: "root"
})
export class DataService {
  initFormGroup: FormGroup;
  linguisticTermsForm: FormArray;
  expertMatrixForm: FormArray;
  expertMatrixTable: {
    columns: Array<string>;
    dataSource: any;
  };

  constructor(private _formBuilder: FormBuilder, public dialog: MatDialog) {}

  initForm() {
    this.initFormGroup = this._formBuilder.group({
      numberAlternatives: [""],
      numberCriteria: [""],
      numberLT: [""]
    });
  }

  setExpertMatrix() {
    this.expertMatrixTable = null;

    const numberCriteria = this.initFormGroup.get("numberCriteria").value;
    const numberAlternatives = this.initFormGroup.get("numberAlternatives")
      .value;

    const columns = ["none"];
    const dataSource = [];

    for (let i = 0; i < numberCriteria; i++) {
      columns.push(`Q${i + 1}`);
    }

    for (let i = 0; i < numberAlternatives; i++) {
      const sub = {};

      columns.forEach(e => {
        if (e === "none") {
          sub[e] = `E${i + 1}`;
        } else {
          sub[e] = i;
        }
      });
      dataSource.push(sub);
    }

    this.expertMatrixTable = {
      columns,
      dataSource
    };
    console.log(this.expertMatrixTable);
  }

  setLinguisticTerms() {
    const col = this.initFormGroup.get("numberLT").value;
    this.linguisticTermsForm = new FormArray([]);

    for (let i = 0; i < col; i++) {
      this.linguisticTermsForm.push(this.getLinguisticTerm());
    }
  }

  getLinguisticTermByIndex(index: number) {
    return this.linguisticTermsForm.at(index) as FormGroup;
  }

  getNormLinguisticTerms() {
    const form = this.linguisticTermsForm.controls;
    const data = [];
    const data1D = [];

    form.forEach(e => {
      data.push([
        e.value.range.low,
        e.value.range.medium,
        e.value.range.height
      ]);
      data1D.push(e.value.range.low);
      data1D.push(e.value.range.medium);
      data1D.push(e.value.range.height);
    });

    const min = Math.min(...data1D);
    const max = Math.max(...data1D);

    return data.map(e => {
      const sub = e.map(el => {
        return (el - min) / (max - min);
      });
      return sub;
    });
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

  openChart() {
    const dialogRef = this.dialog.open(ChartComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  setLinguisticRandom() {
    let index = 0;
    for (let control of this.linguisticTermsForm.controls) {
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
