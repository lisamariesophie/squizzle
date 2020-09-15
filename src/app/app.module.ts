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
import { Location, CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsModule } from 'ng2-charts';
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { QuizComponent } from './_shared/quiz/quiz.component';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateTopicComponent } from './admin/topics/create-topic/create-topic.component';
import { QuestionCreateComponent } from './admin/questions/question-create/question-create.component';
import { QuizzesComponent } from './quizzes/quizzes.component';
import { AuthenticationService } from './_services/authentication.service';
import { ClipboardModule } from 'ngx-clipboard';
import { AuthGuard } from './_guards/auth.guard';
import { RegisterComponent } from './register/register.component';
import { ScoresComponent } from './admin/scores/scores.component';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { AdminGuard } from './_guards/admin.guard';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    SideNavComponent,
    DashboardComponent,
    QuestionListComponent,
    QuizComponent,
    TopicsComponent,
    CreateTopicComponent,
    QuestionCreateComponent,
    QuizzesComponent,
    ScoresComponent,
    FooterComponent,
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
    CommonModule,
    ClipboardModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    ChartsModule,
    NgxWebstorageModule.forRoot()
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [NgbActiveModal, Location, AuthenticationService, AuthGuard, AdminGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
