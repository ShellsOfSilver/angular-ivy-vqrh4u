import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CommonModule } from "@angular/common";

import { MatSliderModule } from "@angular/material/slider";
import { MatButtonModule } from "@angular/material/button";
import { MatStepperModule } from "@angular/material/stepper";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatRippleModule } from "@angular/material/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatDividerModule } from "@angular/material/divider";
import { MatChipsModule } from "@angular/material/chips";
import { MatCardModule } from "@angular/material/card";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatBadgeModule } from "@angular/material/badge";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatMenuModule } from "@angular/material/menu";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatGridListModule } from "@angular/material/grid-list";

import { CdkStepperModule } from "@angular/cdk/stepper";

import { AppComponent } from "./app.component";
import { InitComponent } from "./pages/init/init.component";

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule,
    MatSliderModule,
    MatButtonModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    CdkStepperModule,
    MatIconModule,
    MatRippleModule,
    MatExpansionModule,
    MatDividerModule,
    MatChipsModule,
    MatCardModule,
    MatBottomSheetModule,
    MatButtonToggleModule,
    MatBadgeModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatMenuModule,
    MatTabsModule,
    MatToolbarModule,
    MatTableModule,
    MatSortModule,
    MatGridListModule
  ],
  declarations: [AppComponent, InitComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
