import { Injectable } from '@angular/core';
import { User } from '../users/users.component.model';
import { UsersService } from './users.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn = false;
  userLogged? : User; 
  static userSessionKey = "idUser";
  static isAdminKey = "isAdmin";
  constructor(private usersService : UsersService) { }

  // théoriquement, on devrait passer en paramètre le login
  // et le password, cette méthode devrait faire une requête
  // vers un Web Service pour vérifier que c'est ok, renvoyer
  // un token d'authentification JWT etc.
  // elle devrait renvoyer un Observable etc.
  logIn(user:User) : Observable<any>{
        // if(user.email === "") return;
        // if(user.password === "") return;
        let nouvelUser = new User();
        nouvelUser.email = user.email;
        nouvelUser.password = user.password;
        return this.usersService.loginUser(nouvelUser);
    //console.log("ON SE LOGGE")
    //this.loggedIn = true;
  }

  setLoggedTrue(idUser : string){
    localStorage.setItem(AuthService.userSessionKey, idUser);
  }

  logOut() {
    console.log("ON SE DELOGGE")

    this.loggedIn = false;
  }

  static monUserAdmin() : User{
      var user : User = new User();
      user._id = 'adminID';
      user.id = -1;
      user.nom_complet = 'Administrateur';
      user.email = 'admin@gmail.com';
      user.password = 'admin';
      user.poste = "admin";
      return user;
  }
  // si on l'utilisait on ferai isAdmin().then(...)
  isAdmin() {
    // Pour le moment, version simplifiée...
    // on suppose qu'on est admin si on est loggué
    const isUserAdminPromise = new Promise((resolve, reject) => {
        //resolve(this.loggedIn);        
        resolve(localStorage.getItem(AuthService.isAdminKey)==="true");
    });

    // on renvoie la promesse qui dit si on est admin ou pas
    return isUserAdminPromise;
  }

}
