import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { ThemesComponent } from './admin/theme/themes/themes.component';
import { AddThemeComponent } from './admin/theme/add-theme/add-theme.component'
import { QuizListComponent } from './admin/quiz/quiz-list/quiz-list.component';
import { QuizCreateComponent } from './admin/quiz/quiz-create/quiz-create.component';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './footer/footer.component';
import { QuizComponent } from './user/quiz/quiz/quiz.component';
import { TopicsComponent } from './user/topics/topics.component';
import {NgxWebstorageModule} from 'ngx-webstorage';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    ThemesComponent,
    QuizListComponent,
    QuizCreateComponent,
    AddThemeComponent,
    FooterComponent,
    QuizComponent,
    TopicsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule, 
    ReactiveFormsModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    NgxWebstorageModule.forRoot(),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [NgbActiveModal],
  bootstrap: [AppComponent]
})
export class AppModule { }
