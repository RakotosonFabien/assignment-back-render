import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OutilsService {
  //en localhost ou en ligne
  // static base_url = 'http://localhost:8010/';
  static base_url = 'https://assignmentapp40-31.onrender.com/';

  constructor() { }
}
