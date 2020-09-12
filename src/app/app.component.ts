import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { fromEvent, merge, of } from 'rxjs';
import { mapTo } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'squizzle'; 
}
