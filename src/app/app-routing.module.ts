import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TopicsComponent } from './admin/topics/topics.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { QuizComponent } from './quiz/quiz.component';
import { QuizzesComponent } from './quizzes/quizzes.component';
import { AuthGuard } from './_guards/auth.guard';
import { LoginGuard } from './_guards/login.guard';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'admin', component: TopicsComponent, canActivate: [AuthGuard] },
  { path: 'admin/topic/:id', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin/quiz/:id', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'quizzes', component: QuizzesComponent, canActivate: [AuthGuard] },
  { path: 'quizzes/quiz/:id', component: QuizComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
