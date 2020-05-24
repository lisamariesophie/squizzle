import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ThemesComponent } from './admin/theme/themes/themes.component';


const routes: Routes = [
  { path: '', redirectTo: '/themes', pathMatch: 'full' },
  { path: 'themes', component: ThemesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
