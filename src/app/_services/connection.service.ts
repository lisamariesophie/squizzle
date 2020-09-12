
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Observable, fromEvent, merge, empty, of } from 'rxjs';
import { mapTo } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  online: Observable<boolean>;
  isOnline: boolean;
  
  constructor() {
    this.online = merge(
      of(navigator.onLine),
      fromEvent(window, 'online').pipe(mapTo(true)),
      fromEvent(window, 'offline').pipe(mapTo(false))
    );

    this.online.subscribe((isOnline) => {
      if (isOnline) {
        this.isOnline = true;
      } else {
        this.isOnline = false;
      }
    })
  }
}

