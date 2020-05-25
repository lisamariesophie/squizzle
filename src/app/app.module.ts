import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { ThemesComponent } from './admin/theme/themes/themes.component';
import { AddThemeComponent } from './admin/theme/add-theme/add-theme.component'
import { QuizListComponent } from './admin/quiz/quiz-list/quiz-list.component';
import { QuizEditComponent } from './admin/quiz/quiz-edit/quiz-edit.component';
import { QuizCreateComponent } from './admin/quiz/quiz-create/quiz-create.component';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    ThemesComponent,
    QuizListComponent,
    QuizEditComponent,
    QuizCreateComponent,
    AddThemeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule, 
    ReactiveFormsModule
  ],
  providers: [NgbActiveModal],
  bootstrap: [AppComponent]
})
export class AppModule { }
