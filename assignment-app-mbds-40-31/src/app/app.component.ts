import { Component } from '@angular/core';
import { AuthService } from './shared/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { AssignmentsService } from './shared/assignments.service';
import { User } from './users/users.component.model';
import { UsersService } from './shared/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Application de gestion de devoirs à rendre';
  labelConnexion! : string;
  nom:string = "";
  currentRoute:string = "";
  userConnecte?:User;

  constructor(private authService:AuthService,
              private userService : UsersService, 
              private router:Router,
              private assigmmentsService:AssignmentsService) {
    console.log(router.url);

    router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        console.log(event.url);
        this.currentRoute = event.url;
      }
    });

    this.userService.getUser()
    .subscribe((user) => {
        this.userConnecte = user;
        console.log("CONNEXION =>  " + this.labelConnexion);
        console.log(user);
    });
      //this.authService.logIn();
      // on change le label du bouton
  }
  ngOnInit(){
    if(localStorage.getItem(AuthService.userSessionKey)!=null){
      this.labelConnexion = "SE DECONNECTER";
    }
    else{
      this.labelConnexion = "SE CONNECTER";
    }
  }
  login() {

    // utilise l'authService pour se connecter
    if(this.userConnecte != null) {
      //this.authService.logOut();
      localStorage.removeItem(AuthService.userSessionKey);
      //deconnexion et lien vers connexion
      // et on navigue vers la page d'accueil
    }
    this.router.navigate(["/login"]);
  }

  isLogged() {
    return localStorage.getItem(AuthService.userSessionKey)!=null;
  }

  creerDonneesDeTest() {
    this.assigmmentsService.peuplerBDavecForkJoin()
    .subscribe(() => {
      console.log("Opération terminée, les 1000 données ont été insérées")

      // on refresh la page pour que la liste apparaisse
      // plusieurs manières de faire....
      window.location.reload();
    });
  }
}
