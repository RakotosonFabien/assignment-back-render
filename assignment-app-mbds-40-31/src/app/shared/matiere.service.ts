import { Injectable } from '@angular/core';
import { LoggingService } from './logging.service';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, tap, of } from 'rxjs';
import { Matiere } from '../assignments/matiere.model';
import { OutilsService } from './outils.service';

@Injectable({
  providedIn: 'root'
})
export class MatiereService {
  // tableau de devoirs à rendre
  matieres:Matiere[] = []
    constructor(private loggingService:LoggingService,
      private http:HttpClient) { }
      
      uri_api = OutilsService.base_url+'api/matieres';
      //uri_api = 'http://localhost:8010/api/matieres';
      //uri_api = 'https://mbds-madagascar-2022-2023-back-end.onrender.com/api/matieres';
  
    getMatieres(page:number, limit:number):Observable<any> {
      // normalement on doit envoyer une requête HTTP
      // sur un web service, et ça peut prendre du temps
      // On a donc besoin "d'attendre que les données arrivent".
      // Angular utilise pour cela la notion d'Observable
      return this.http.get<Matiere[]>(this.uri_api + "?page=" + page + "&limit=" + limit);
      
      // of() permet de créer un Observable qui va
      // contenir les données du tableau matieres
      //return of(this.matieres);
    }
  
    getMatiere(id:number):Observable<Matiere|undefined> {
      // Plus tard on utilisera un Web Service et une BD
      return this.http.get<Matiere|undefined>(`${this.uri_api}/${id}`)
     
      .pipe(
        map(a => {
          if(a) {
            a.nom += "";
          }
          return a;
        }),
        catchError(this.handleError<Matiere>("Erreur dans le traitement de matiere avec id = " + id))
      )
      
      // On va chercher dans le tableau des matieres
      // l'matiere dont l'id est celui passé en paramètre
      
      //const matiere = this.matieres.find(a => a.id === id);
      // on retourne cet matiere encapsulé dans un Observable
      //return of(matiere);
    }
  
    private handleError<T>(operation: any, result?: T) {
      return (error: any): Observable<T> => {
        console.log(error); // pour afficher dans la console
        console.log(operation + ' a échoué ' + error.message);
   
        return of(result as T);
      }
   };
   
    addMatiere(matiere:Matiere):Observable<any> {
      this.loggingService.log(matiere.nom, 'ajouté');
  
      // plus tard on utilisera un web service pour l'ajout dans une vraie BD
      return this.http.post<Matiere>(this.uri_api, matiere);
      // on ajoute le devoir au tableau des devoirs
      //this.matieres.push(matiere);
      // on retourne un message de succès à travers
      // un Observable
      //return of(`Matiere ${matiere.nom} ajouté avec succès`);
    }
  
    updateMatiere(matiere:Matiere):Observable<any> {
      // Normalement : on appelle un web service pour l'update des
      // données
      return this.http.put<Matiere>(this.uri_api, matiere);
  
      // dans la version tableau : rien à faire (pourquoi ? Parceque matiere
      // est déjà un élément du tableau this.matieres)
  
      //this.loggingService.log(matiere.nom, 'modifié');
  
      //return of(`Matiere ${matiere.nom} modifié avec succès`)
    }
  
    deleteMatiere(matiere:Matiere):Observable<any> {
      return this.http.delete(this.uri_api + "/" + matiere._id)
        // pour supprimer on passe à la méthode splice
      // l'index de l'matiere à supprimer et 
      // le nombre d'éléments à supprimer (ici 1)
      /*
      const index = this.matieres.indexOf(matiere);
      this.matieres.splice(index, 1);
  
      this.loggingService.log(matiere.nom, 'supprimé');
  
      return of('Matiere supprimé avec succès')
      */
    }
  }
  