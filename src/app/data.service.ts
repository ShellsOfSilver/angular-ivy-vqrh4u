import { Injectable } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";

import { ChartComponent } from "./pages/chart/chart.component";

@Injectable({
  providedIn: "root"
})
export class DataService {
  initFormGroup: FormGroup;
  linguisticTermsForm: FormArray;
  expertMatrixForm: FormGroup;
  expertMatrixTable: {
    columns: Array<string>;
    dataSource: any;
  };
  intervalMatrixTable: {
    columns: Array<string>;
    dataSource: any;
  };

  constructor(
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

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

    const form = this._formBuilder.group({});

    for (let i = 0; i < numberAlternatives; i++) {
      const sub = {};

      columns.forEach((e, ix) => {
        if (e === "none") {
          sub[e] = {
            data: `E${i + 1}`,
            start: true,
            id: `${i}_${ix}`
          };
        } else {
          sub[e] = {
            data: i,
            id: `${i}_${ix}`
          };
          form.addControl(`${i}_${ix}`, new FormControl(""));
        }
      });
      dataSource.push(sub);
    }
    this.expertMatrixForm = form;
    this.expertMatrixTable = {
      columns,
      dataSource
    };
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

  randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  setMatrixRandom() {
    const form = this.linguisticTermsForm.controls;
    const data = [];

    form.forEach(e => {
      data.push(e.value.shortName);
    });

    Object.keys(this.expertMatrixForm.controls).forEach(e => {
      const sCase = this.randomInteger(0, 3);

      if (sCase === 0) {
        const index = this.randomInteger(0, data.length - 1);
        this.expertMatrixForm.get(e).setValue(`${data[index]}`);
      }
      if (sCase === 1) {
        const index = this.randomInteger(1, data.length - 1);
        this.expertMatrixForm.get(e).setValue(`above ${data[index]}`);
      }
      if (sCase === 2) {
        const index = this.randomInteger(0, data.length - 2);
        this.expertMatrixForm.get(e).setValue(`below ${data[index]}`);
      }
      if (sCase === 3) {
        const index = this.randomInteger(0, data.length - 1);
        const index1 = this.randomInteger(0, data.length - 1);
        this.expertMatrixForm
          .get(e)
          .setValue(`within ${data[index1]} and ${data[index]}`);
      }
    });
  }

  checkExpertMatrix(stepper) {
    let valid = true;
    const form = this.linguisticTermsForm.value;
    const data = [];

    form.forEach(e => {
      data.push(e.shortName);
    });

    Object.keys(this.expertMatrixForm.controls).forEach(e => {
      const value = this.expertMatrixForm.get(e).value;
      const terms = value.split(" ");
      if (terms.length === 1) {
        if (data.indexOf(terms[0]) === -1) {
          valid = false;
        }
      } else if (terms.length === 2) {
        if (["above", "below"].indexOf(terms[0]) === -1) {
          valid = false;
        }
        if (data.indexOf(terms[1]) === -1) {
          valid = false;
        }
        if (data.indexOf(terms[1]) !== -1) {
          const subInx = data.indexOf(terms[1]);
          console.log(subInx);
          if (terms[0] === "above" && subInx <= 0) {
            valid = false;
          }
          if (terms[0] === "below" && subInx >= data.length) {
            valid = false;
          }
        }
      } else if (terms.length === 4) {
        if (terms[0] !== "within") {
          valid = false;
        }
        if (data.indexOf(terms[1]) === -1) {
          valid = false;
        }
        if (terms[2] !== "and") {
          valid = false;
        }
        if (data.indexOf(terms[3]) === -1) {
          valid = false;
        }
      } else {
        valid = false;
      }
    });
    if (valid) {
      this.setIntervalMatrix();
      stepper.next();
    } else {
      this._snackBar.open("Invalid data.", null, {
        duration: 2000
      });
    }
  }

  setIntervalMatrix() {
    this.intervalMatrixTable = null;
    const numberCriteria = this.initFormGroup.get("numberCriteria").value;
    const numberAlternatives = this.initFormGroup.get("numberAlternatives")
      .value;

    const data = [];

    this.linguisticTermsForm.value.forEach(e => {
      data.push(e.shortName);
    });

    const columns = ["none"];
    const dataSource = [];
    for (let i = 0; i < numberCriteria; i++) {
      columns.push(`Q${i + 1}`);
    }
    const form = this.expertMatrixForm.value;

    for (let i = 0; i < numberAlternatives; i++) {
      const sub = {};
      columns.forEach((e, ix) => {
        if (e === "none") {
          sub[e] = {
            data: `E${i + 1}`,
            start: true,
            id: `${i}_${ix}`
          };
        } else {
          const value = form[`${i}_${ix}`];

          const terms = value.split(" ");
          if (terms.length === 1) {
            sub[e] = {
              data: `{ ${terms[0]} }`,
              id: `${i}_${ix}`
            };
          } else if (terms.length === 2) {
            const subIx = data.indexOf(terms[1]);
            if ("above" === terms[0]) {
              sub[e] = {
                data: `{ ${data[subIx - 1]} ${terms[1]} }`,
                id: `${i}_${ix}`
              };
            } else if ("below" === terms[0]) {
              sub[e] = {
                data: `{ ${terms[1]} ${data[subIx + 1]} }`,
                id: `${i}_${ix}`
              };
            } else {
              sub[e] = {
                data: "{ }",
                id: `${i}_${ix}`
              };
            }
          }
          // else if (terms.length === 4) {
          //   if (terms[0] !== "within") {
          //     valid = false;
          //   }
          //   if (data.indexOf(terms[1]) === -1) {
          //     valid = false;
          //   }
          //   if (terms[2] !== "and") {
          //     valid = false;
          //   }
          //   if (data.indexOf(terms[3]) === -1) {
          //     valid = false;
          //   }
          // }
          else {
            sub[e] = {
              data: "{ }",
              id: `${i}_${ix}`
            };
          }
        }
      });
      dataSource.push(sub);
    }

    this.intervalMatrixTable = {
      columns,
      dataSource
    };
  }

  setLinguisticRandom() {
    let index = 0;
    for (let control of this.linguisticTermsForm.controls) {
      index++;
      control.setValue({
        fullName: `Full Name ${index}`,
        shortName: `SN${index}`,
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
      numberCriteria: 6,
      numberLT: 4
    });
  }
}
