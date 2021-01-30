import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { MatSliderModule } from "@angular/material/slider";
import { MatButtonModule } from "@angular/material/button";
import { MatStepperModule } from "@angular/material/stepper";

import { AppComponent } from "./app.component";
import { InitComponent } from "./pages/init/init.component";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    MatSliderModule,
    MatButtonModule,
    MatStepperModule
  ],
  declarations: [AppComponent, InitComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
