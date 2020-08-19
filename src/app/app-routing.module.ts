import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ThemesComponent } from './admin/theme/themes/themes.component';
import { QuizListComponent } from './admin/quiz/quiz-list/quiz-list.component';
import { TopicsComponent } from './user/topics/topics.component';
import { QuizComponent } from './user/quiz/quiz/quiz.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  { path: '', redirectTo: 'admin/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'admin/dashboard', component: ThemesComponent },
  { path: 'admin/dashboard/topic/:id', component: DashboardComponent },
  { path: 'admin/dashboard/quiz/:id', component: DashboardComponent },
  { path: 'topics', component: TopicsComponent },
  { path: 'topics/quiz/:id', component: QuizComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
