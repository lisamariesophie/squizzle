import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TopicsComponent } from './admin/topics/topics.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { QuizComponent } from './_shared/quiz/quiz.component';
import { QuizzesComponent } from './quizzes/quizzes.component';
import { AuthGuard } from './_guards/auth.guard';
import { RegisterComponent } from './register/register.component';
import { AdminGuard } from './_guards/admin.guard';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent },
  { path: 'admin', component: TopicsComponent, canActivate: [AdminGuard] },
  { path: 'admin/topic/:id', component: DashboardComponent, canActivate: [AdminGuard] },
  { path: 'admin/quiz/:id', component: DashboardComponent, canActivate: [AdminGuard] },
  { path: 'admin/quiz/scores/:id', component: DashboardComponent, canActivate: [AdminGuard] },
  { path: 'quizzes', component: QuizzesComponent, canActivate: [AuthGuard] },
  { path: 'quizzes/quiz/:id', component: QuizComponent, canActivate: [AuthGuard] },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
