import { Component } from '@angular/core';
import { Assignment } from '../assignment.model';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { Router } from '@angular/router';
import { Matiere } from '../matiere.model';
import { MatiereService } from 'src/app/shared/matiere.service';
import { UsersService } from 'src/app/shared/users.service';
import { User } from 'src/app/users/users.component.model';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.css']
})
export class AddAssignmentComponent {

  // champs du formulaire
  nomDevoir = "";
  //dateDeRendu!: Date;
  matieres: Matiere[] = [];
  etudiants : User[] = [];
  idEtudiant! : number;
  idMatiere! : number;
  dateAttribution! : Date;
  remarque!: string;
  // userConnecte?: User;

  constructor(private assignmentsService: AssignmentsService,
    private matiereService: MatiereService,
    private userService : UsersService,
    private router: Router) { }

  ngOnInit(): void {
    this.getMatieres();
    this.getEtudiants();
    if(localStorage.getItem(AuthService.userSessionKey)!=null){
      this.labelConnexion = "Se déconnecter";
    }
    else{
      this.labelConnexion = "Se connecter";
    }
    this.userService.getUser()
    .subscribe((user) => {
        this.userConnecte = user;
        if(user == null){
          this.router.navigate(['/login']);
        }
    });
  }
  getMatieres() {
    this.matiereService.getMatieres(0, 0).subscribe(data => {
      this.matieres = data.docs;
    });
  }
  getEtudiants() {
    this.userService.getEtudiants(0, 0).subscribe(data => {
      this.etudiants = data.docs;
    });
  }
  onSubmit(event: any) {
    // On vérifie que les champs ne sont pas vides
    if (this.nomDevoir === "") return;
    if (this.dateAttribution === undefined) return;

    let nouvelAssignment = new Assignment();
    // génération d'id, plus tard ce sera fait dans la BD
    nouvelAssignment.id = Math.abs(Math.random() * 1000000000000000);
    nouvelAssignment.nom = this.nomDevoir;
    //nouvelAssignment.dateDeRendu = this.dateDeRendu;
    nouvelAssignment.rendu = false;
    nouvelAssignment.idEtudiant = this.idEtudiant;
    nouvelAssignment.idMatiere = this.idMatiere;
    nouvelAssignment.dateAttribution = this.dateAttribution;
    nouvelAssignment.remarque = this.remarque;
    // on demande au service d'ajouter l'assignment
    this.assignmentsService.addAssignment(nouvelAssignment)
      .subscribe(assignment => {

        // On va naviguer vers la page d'accueil pour afficher la liste
        // des assignments
        //this.router.navigate(["/home"]);
        this.router.navigate(["/assignments/"+assignment.id]);
      });
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
