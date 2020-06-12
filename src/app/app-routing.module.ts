import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ThemesComponent } from './admin/theme/themes/themes.component';
import { QuizListComponent } from './admin/quiz/quiz-list/quiz-list.component';
import { TopicsComponent } from './user/topics/topics.component';
import { QuizComponent } from './user/quiz/quiz/quiz.component';


const routes: Routes = [
  { path: '', redirectTo: 'user/topics', pathMatch: 'full' },
  { path: 'admin/topics', component: ThemesComponent },
  { path: 'admin/topics/:id', component: QuizListComponent },
  { path: 'user/topics', component: TopicsComponent },
  { path: 'user/topics/quiz/:id', component: QuizComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
