import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { QuestionListComponent } from './admin/questions/question-list/question-list.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { NavbarComponent } from './_shared/navbar/navbar.component';
import { SideNavComponent } from './_shared/side-nav/side-nav.component';
import { FooterComponent } from './_shared/footer/footer.component';
import { TopicsComponent } from './admin/topics/topics.component';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { Location, CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsModule } from 'ng2-charts';

// Firebase services + enviorment module
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { QuizComponent } from './quiz/quiz.component';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateTopicComponent } from './admin/topics/create-topic/create-topic.component';
import { QuestionCreateComponent } from './admin/questions/question-create/question-create.component';
import { QuestionSettingsComponent } from './admin/questions/question-settings/question-settings.component';
import { QuizzesComponent } from './quizzes/quizzes.component';
import { AuthenticationService } from './_services/authentication.service';
import { ClipboardModule } from 'ngx-clipboard';
import { AuthGuard } from './_guards/auth.guard';
import { LoginGuard } from './_guards/login.guard';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ScoresComponent } from './scores/scores.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    QuestionListComponent,
    DashboardComponent,
    NavbarComponent,
    SideNavComponent,
    FooterComponent,
    QuizComponent,
    TopicsComponent,
    CreateTopicComponent,
    QuestionCreateComponent,
    QuestionSettingsComponent,
    QuizzesComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ScoresComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgxWebstorageModule.forRoot(),
    CommonModule,
    ClipboardModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    ChartsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [NgbActiveModal, Location, AuthenticationService, AuthGuard, LoginGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
