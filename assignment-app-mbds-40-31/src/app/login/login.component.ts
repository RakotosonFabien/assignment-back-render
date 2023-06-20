import { Component } from '@angular/core';
import { UsersService } from '../shared/users.service';
import { Router } from '@angular/router';
import { User } from '../users/users.component.model';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = "";
  password = "";
  message="";

  constructor(private authService : AuthService,
    private router:Router) { }

    onSubmit(event:any){
      if(this.email === "") return;
      if(this.password === "") return;
      console.log("Connexion de " + this.email + " - " + this.password)
      let nouvelUser = new User();
      nouvelUser.email = this.email;
      nouvelUser.password = this.password;
      //if(nouvelUser.email === AuthService.monUserAdmin().email && nouvelUser.password === AuthService.monUserAdmin().password){
      this.authService.logIn(nouvelUser)
      .subscribe(user => {
          if(user != null){
            this.authService.setLoggedTrue(user.id);
            if(user.poste === "admin"){
              localStorage.setItem(AuthService.isAdminKey, "true");
            }
            else{
              localStorage.setItem(AuthService.isAdminKey, "false");
            }
            this.router.navigate(["/home"]);
          }
      },
      (error) => {
        // Gestion de l'erreur
        console.log("Message ovaina !");
        this.message="Email ou mot de passe Invalide";
        console.error('Une erreur s\'est produite lors de la connexion :');
        // Autres actions à effectuer en cas d'erreur, par exemple afficher un message d'erreur à l'utilisateur
      }
    );
  }

}
