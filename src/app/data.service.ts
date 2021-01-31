import { Injectable } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";

import { ChartComponent } from "./pages/chart/chart.component";

@Injectable({
  providedIn: "root"
})
export class DataService {
  initFormGroup: FormGroup;
  aggregationMethodsForm: FormGroup;
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
  trapezoidalMatrixTable: {
    columns: Array<string>;
    dataSource: any;
  };
  resultMatrixTable: {
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
      numberAlternatives: ["", Validators.min(3)],
      numberCriteria: ["", Validators.min(3)],
      numberLT: ["", Validators.min(3)]
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

  setAggregationMethods() {
    this.aggregationMethodsForm = this._formBuilder.group({
      alpha: [0.5, [Validators.min(0), Validators.max(1)]],
      method: ["Pessimistic position", Validators.required]
    });
  }

  setConclusion() {
    console.log("--------------");
  }

  calcMethod() {
    this.resultMatrixTable = null;
    const method = this.aggregationMethodsForm.value;
    const alpha = method.alpha;

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
    const intervalData = this.trapezoidalMatrixTable.dataSource;
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
          const el = (Object.values(intervalData[i]).find(
            (e: any) => e.id === `${i}_${ix}`
          ) as any).data;
          const elements = el.substring(2, el.length - 2).split(" ");
          const res = [
            +(alpha * (+elements[1] - +elements[0]) + +elements[0]).toFixed(3),
            +(+elements[3] - alpha * (+elements[3] - +elements[2])).toFixed(3)
          ];
          sub[e] = {
            data: `[ ${res.join(" ")} ]`,
            id: `${i}_${ix}`
          };
        }
      });
      dataSource.push(sub);
    }

    console.log(alpha);
    switch (method.method) {
      case "Aggregation of generalized trapezoidal LT":
        console.log(1);
        break;
      case "Pessimistic position":
        const col1 = "Pessimistic fuzzy interval";
        columns.push(col1);
        columns.push("Probability");

        for (let i = 0; i < numberAlternatives; i++) {
          const el = dataSource[i];
          const res = [1, 1];

          Object.keys(el).forEach(key => {
            if (!el[key].start) {
              const elements = el[key].data
                .substring(2, el[key].data.length - 2)
                .split(" ");

              if (res[0] > +elements[0]) {
                res[0] = +elements[0];
              }

              if (res[1] > +elements[1]) {
                res[1] = +elements[1];
              }
            }
          });
          dataSource[i][col1] = {
            data: `[ ${res.join(" ")} ]`,
            id: `${i}_${dataSource.length}`
          };

          const calc = Math.max(
            0,
            1 - Math.max(0, (1 - res[0]) / (res[1] - res[0] + 1))
          );

          dataSource[i]["Probability"] = {
            data: `${calc.toFixed(2)}`,
            id: `${i}_${dataSource.length + 1}`
          };
        }
        break;
      case "Optimistic position":
        const col2 = "Optimistic fuzzy interval";
        columns.push(col2);
        columns.push("Probability");

        for (let i = 0; i < numberAlternatives; i++) {
          const el = dataSource[i];
          const res = [0, 0];

          Object.keys(el).forEach(key => {
            if (!el[key].start) {
              const elements = el[key].data
                .substring(2, el[key].data.length - 2)
                .split(" ");

              if (res[0] < +elements[0]) {
                res[0] = +elements[0];
              }

              if (res[1] < +elements[1]) {
                res[1] = +elements[1];
              }
            }
          });
          dataSource[i][col2] = {
            data: `[ ${res.join(" ")} ]`,
            id: `${i}_${dataSource.length}`
          };

          const calc = Math.max(
            0,
            1 - Math.max(0, (1 - res[0]) / (res[1] - res[0] + 1))
          );

          dataSource[i]["Probability"] = {
            data: `${calc.toFixed(2)}`,
            id: `${i}_${dataSource.length + 1}`
          };
        }
        break;
    }

    this.resultMatrixTable = {
      columns,
      dataSource
    };
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
    this.dialog.open(ChartComponent);
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
        const index = this.randomInteger(0, data.length - 2);
        this.expertMatrixForm.get(e).setValue(`above ${data[index]}`);
      }
      if (sCase === 2) {
        const index = this.randomInteger(1, data.length - 1);
        this.expertMatrixForm.get(e).setValue(`below ${data[index]}`);
      }
      if (sCase === 3) {
        let index = this.randomInteger(0, data.length - 1);
        let index1 = this.randomInteger(0, data.length - 1);
        if (index1 !== index) {
          this.expertMatrixForm
            .get(e)
            .setValue(`within ${data[index1]} and ${data[index]}`);
        } else {
          this.expertMatrixForm
            .get(e)
            .setValue(`within ${data[0]} and ${data[1]}`);
        }
      }
    });
  }

  setTrapezoidalMatrix() {
    this.trapezoidalMatrixTable = null;
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
    const intervalData = this.intervalMatrixTable.dataSource;
    const normList = this.getNormLinguisticTerms();
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
          const el = (Object.values(intervalData[i]).find(
            (e: any) => e.id === `${i}_${ix}`
          ) as any).data;
          const elements = el.substring(2, el.length - 2).split(" ");
          let res = [];

          if (elements.length === 1) {
            const inx = data.indexOf(elements[0]);
            res = normList[inx];
            sub[e] = {
              data: `[ ${res[0].toFixed(2)} ${res[1].toFixed(
                2
              )} ${res[1].toFixed(2)} ${res[res.length - 1].toFixed(2)} ]`,
              id: `${i}_${ix}`
            };
          } else {
            elements.forEach(e => {
              const inx = data.indexOf(e);
              res = [...res, ...normList[inx]];
            });

            sub[e] = {
              data: `[ ${res[0].toFixed(2)} ${res[1].toFixed(2)} ${res[
                res.length - 2
              ].toFixed(2)} ${res[res.length - 1].toFixed(2)} ]`,
              id: `${i}_${ix}`
            };
          }
        }
      });
      dataSource.push(sub);
    }
    this.trapezoidalMatrixTable = {
      columns,
      dataSource
    };
  }

  checkExpertMatrix(stepper) {
    let valid = true;
    let logical = true;
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

          if (terms[0] === "below" && subInx <= 0) {
            logical = false;
            valid = false;
          }
          if (terms[0] === "above" && subInx >= data.length - 1) {
            logical = false;
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
        if (terms[3] === terms[1]) {
          logical = false;
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
      this._snackBar.open(logical ? "Invalid data." : "Logic error", null, {
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
                data: `{ ${terms[1]} ${data
                  .slice(subIx + 1, data.length)
                  .join(" ")} }`,
                id: `${i}_${ix}`
              };
            } else if ("below" === terms[0]) {
              sub[e] = {
                data: `{ ${data.slice(0, subIx).join(" ")} ${terms[1]} }`,
                id: `${i}_${ix}`
              };
            } else {
              sub[e] = {
                data: "{ }",
                id: `${i}_${ix}`
              };
            }
          } else if (terms.length === 4) {
            const subIx1 = data.indexOf(terms[1]);
            const subIx2 = data.indexOf(terms[3]);
            sub[e] = {
              data: `{ ${data
                .slice(Math.min(subIx1, subIx2), Math.max(subIx1, subIx2) + 1)
                .join(" ")} }`,
              id: `${i}_${ix}`
            };
          } else {
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
      numberCriteria: 8,
      numberLT: 5
    });
  }
}
