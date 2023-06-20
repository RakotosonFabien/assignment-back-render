import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { Assignment } from './assignment.model';
import { AssignmentsService } from '../shared/assignments.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { filter, map, pairwise, tap, throttleTime } from 'rxjs';
import { AuthService } from '../shared/auth.service';
import { UsersService } from '../shared/users.service';
import { User } from '../users/users.component.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css']
})
export class AssignmentsComponent implements OnInit {
  titre="Liste des devoirs à rendre";
  // les données à afficher
  assignments:Assignment[] = [];
  userConnecte?:User;
  // Pour la data table
  displayedColumns: string[] = ['id', 'nom', 'dateDeRendu', 'rendu'];

  // propriétés pour la pagination
  page: number=1;
  limit: number=21;
  totalDocs: number = 0;
  totalPages: number = 0;
  hasPrevPage: boolean = false;
  prevPage: number = 0;
  hasNextPage: boolean = false;
  nextPage: number = 0;
;

  @ViewChild('scroller') scroller!: CdkVirtualScrollViewport;

  constructor(private assignmentsService:AssignmentsService,
              private ngZone: NgZone, private authService : AuthService, private userService : UsersService,
              private route: ActivatedRoute,
              private router: Router) {    
  }
  
  ngOnInit(): void {
    console.log("OnInit Composant instancié et juste avant le rendu HTML (le composant est visible dans la page HTML)");
    // exercice : regarder si il existe des query params
    // page et limit, récupérer leur valeurs si elles existent
    // et les passer à la méthode getAssignments
    // TODO
    this.userService.getUser()
    .subscribe((user) => {
        this.userConnecte = user;
        if(user == null){
          this.router.navigate(['/login']);
        }
    });
    console.log("TEST FINI " + this.userConnecte?.nom_complet + " - " + this.userConnecte?.poste);
    this.getAssignments();
    if(localStorage.getItem(AuthService.userSessionKey)!=null){
      this.labelConnexion = "SE DECONNECTER";
    }
    else{
      this.labelConnexion = "SE CONNECTE";
    }
  }

  ngAfterViewInit() { 
    console.log("after view init");

    if(!this.scroller) return;

    // on s'abonne à l'évènement scroll de la liste
    this.scroller.elementScrolled()
    .pipe(
      tap(event => {
        //console.log(event);
      }),
      map(event => {
         return this.scroller.measureScrollOffset('bottom');
      }),
      tap(y => {
        //console.log("y = " + y);
      }),
      pairwise(),
      tap(([y1, y2]) => {
        //console.log("y1 = " + y1 + " y2 = " + y2);
      }),
      filter(([y1, y2]) => {
        return y2 < y1 && y2 < 100;
      }),
      // Pour n'envoyer des requêtes que toutes les 200ms
      //throttleTime(200)
    )
    .subscribe((val) => {
      console.log("val = " + val);
      console.log("je CHARGE DE NOUVELLES DONNEES page = " + this.page);
      this.ngZone.run(() => {
        if(!this.hasNextPage) return;

        this.page = this.nextPage;
        this.getAddAssignmentsForScroll();
      });
    });
  }

  getAssignments() {
    console.log("On va chercher les assignments dans le service");

    this.assignmentsService.getAssignments(this.page, this.limit)
    .subscribe(data => {
      this.assignments = data.docs;
      this.page = data.page;
      this.limit = data.limit;
      this.totalDocs = data.totalDocs;
      this.totalPages = data.totalPages;
      this.hasPrevPage = data.hasPrevPage;
      this.prevPage = data.prevPage;
      this.hasNextPage = data.hasNextPage;
      this.nextPage = data.nextPage;

      console.log("Données reçues");
      console.log(data);
    });
  }

  getAddAssignmentsForScroll() {
    this.assignmentsService.getAssignments(this.page, this.limit)
    .subscribe(data => {
      // au lieu de remplacer le tableau, on va concaténer les nouvelles données
      this.assignments = this.assignments.concat(data.docs);
      // ou comme ceci this.assignments = [...this.assignments, ...data.docs]
      //this.assignments = data.docs;
      this.page = data.page;
      this.limit = data.limit;
      this.totalDocs = data.totalDocs;
      this.totalPages = data.totalPages;
      this.hasPrevPage = data.hasPrevPage;
      this.prevPage = data.prevPage;
      this.hasNextPage = data.hasNextPage;
      this.nextPage = data.nextPage;

      console.log("Données ajoutées pour scrolling");
    });
  }

  premierePage() {
    this.page = 1;
    this.getAssignments();
  }

  pageSuivante() {
    this.page = this.nextPage;
    this.getAssignments();
  }

  pagePrecedente() {
    this.page = this.prevPage;
    this.getAssignments();
  }
  dernierePage() {
    this.page = this.totalPages;
    this.getAssignments();
  }

  // Pour mat-paginator
  handlePage(event: any) {
    console.log(event);
   
    this.page = event.pageIndex;
    this.limit = event.pageSize;
    this.getAssignments();
  }
  couleurNote(note:number){
    if(note <10 ){
      return "red";
    }
    else if(note < 12){
      return "orange";
    }
    else if(note < 15){
      return "blue";
    }
    return "green";
  }
  rendre(devoir:Assignment) {
    const nombre = window.prompt("Veuillez saisir la note :");
    if (nombre !== null) {
      if(parseFloat(nombre) < 0 || parseFloat(nombre)>20){
        alert("Note invalide");
      }
      const url = `/gestionrendu?note=${nombre}&_id=${devoir._id}&id=${devoir.id}`;
      window.location.href = url;
    }
  }
  labelConnexion! : string;
  nom:string = "";
  currentRoute:string = "";

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

}
