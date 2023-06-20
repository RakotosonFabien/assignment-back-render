import { Injectable } from '@angular/core';
import { LoggingService } from './logging.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../users/users.component.model';
import { Observable, catchError, map, tap, of } from 'rxjs';
import { AuthService } from './auth.service';
import { OutilsService } from './outils.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private loggingService:LoggingService,
    private http:HttpClient) { }

    uri_api = OutilsService.base_url+'api/users';

    //uri_api = 'http://localhost:8010/api/users';
    login_api = OutilsService.base_url+'api/user/login';

  loginUser(user : User):Observable<any>{
      return this.http.post<User>(this.login_api, user);
  }

  getEtudiants(page:number, limit:number):Observable<any> {
    // normalement on doit envoyer une requête HTTP
    // sur un web service, et ça peut prendre du temps
    // On a donc besoin "d'attendre que les données arrivent".
    // Angular utilise pour cela la notion d'Observable
    return this.http.get<User[]>(this.uri_api+"/etudiants" + "?page=" + page + "&limit=" + limit);
    
    // of() permet de créer un Observable qui va
    // contenir les données du tableau assignments
    //return of(this.assignments);
  }

  //si il n'y a pas d'id on recuperera l'user connecte
  getUser(id?:number):Observable<User|undefined> {
    if(!id){
      var vaovao = localStorage.getItem(AuthService.userSessionKey);
      id = vaovao ? parseInt(vaovao) : 0;
    }
    // Plus tard on utilisera un Web Service et une BD
    return this.http.get<User|undefined>(`${this.uri_api}/${id}`)
   
    .pipe(
      map(a => {
        if(a) {
          a.nom_complet += "";
        }
        return a;
      }),
      catchError(this.handleError<User>("Erreur dans le traitement de assignment avec id = " + id))
    )
    
    // On va chercher dans le tableau des assignments
    // l'assignment dont l'id est celui passé en paramètre
    
    //const assignment = this.assignments.find(a => a.id === id);
    // on retourne cet assignment encapsulé dans un Observable
    //return of(assignment);
  }
  private handleError<T>(operation: any, result?: T) {
    return (error: any): Observable<T> => {
      console.log(error); // pour afficher dans la console
      console.log(operation + ' a échoué ' + error.message);
 
      return of(result as T);
    }
  };
}
    
