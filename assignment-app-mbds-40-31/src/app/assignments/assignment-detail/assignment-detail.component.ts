import { Component, OnInit } from '@angular/core';
import { Assignment } from '../assignment.model';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { User } from 'src/app/users/users.component.model';
import { UsersService } from 'src/app/shared/users.service';

@Component({
  selector: 'app-assignment-detail',
  templateUrl: './assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.css']
})
export class AssignmentDetailComponent implements OnInit {
  assignmentTransmis?: Assignment;
  constructor(private assignmentsService: AssignmentsService,
    private userService : UsersService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService) { }
  ngOnInit(): void {
    // appelée avant le rendu du composant
    // on va chercher l'id dans l'url active
    // en mettant + on force la conversion en number
    const id = +this.route.snapshot.params['id'];
    // on va chercher l'assignment à afficher
    this.assignmentsService.getAssignment(id)
      .subscribe(assignment => {
        this.assignmentTransmis = assignment;
      });
    if(localStorage.getItem(AuthService.userSessionKey)!=null){
      this.labelConnexion = "SE DECONNECTER";
    }
    else{
      this.labelConnexion = "SE CONNECTER";
    }
    this.userService.getUser()
    .subscribe((user) => {
        this.userConnecte = user;
        if(user == null){
          this.router.navigate(['/login']);
        }
    });
  }

  onDeleteAssignment() {
    if (!this.assignmentTransmis) return;

    console.log("Suppression de l'assignment " + this.assignmentTransmis.nom);

    // on demande au service la suppression de l'assignment
    this.assignmentsService.deleteAssignment(this.assignmentTransmis)
      .subscribe(message => {
        console.log(message);
        // Pour cacher le detail, on met l'assignment à null
        this.assignmentTransmis = undefined;

        // et on navigue vers la page d'accueil
        this.router.navigate(["/home"]);
      });

  }

  onAssignmentRendu() {
    if (!this.assignmentTransmis) return;//pas de devoir
    if (!this.assignmentsService.testRendable(this.assignmentTransmis)) {//pas de note
      alert("Pas encore de note pour le devoir!");
      return;
    }
    this.assignmentTransmis.rendu = true;
    const currentDate = new Date();
    this.assignmentTransmis.dateDeRendu = currentDate;
    // on appelle le service pour faire l'update
    this.assignmentsService.updateAssignment(this.assignmentTransmis)
      .subscribe(message => {
        console.log(message);
      });
  }

  onEditAssignment() {
    // navigation vers la page edit
    // équivalent à "/assignment/2/edit" par exemple
    // path = "/assignment/" + this.assignmentTransmis?.id + "/edit";
    // this.router.navigate([path]);
    // c'est pour vous montrer la syntaxe avec [...]
    this.router.navigate(["/assignments", this.assignmentTransmis?.id, "edit"],
      {
        queryParams: {
          nom: this.assignmentTransmis?.nom,
          matiere: "Angular"
        },
        fragment: "edition"
      });
  }

  modifiable() {
    // On peut modifier si seulement on est admin
    console.log("OIASDISA " + localStorage.getItem(AuthService.isAdminKey));
    return localStorage.getItem(AuthService.isAdminKey)==="true" && !this.assignmentTransmis?.rendu;
    //return true;
  }
   
  labelConnexion! : string;
  nom:string = "";
  currentRoute:string = "";
  userConnecte?:User;

  isLogged() {
    return localStorage.getItem(AuthService.userSessionKey)!=null;
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
  // if(localStorage.getItem(AuthService.userSessionKey)!=null){
  //   this.labelConnexion = "Se déconnecter";
  // }
  // else{
  //   this.labelConnexion = "Se connecter";
  // }
}
