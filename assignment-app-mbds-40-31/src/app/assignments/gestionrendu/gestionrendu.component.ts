import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { Assignment } from '../assignment.model';

@Component({
  selector: 'app-gestionrendu',
  templateUrl: './gestionrendu.component.html',
  styleUrls: ['./gestionrendu.component.css']
})
export class GestionrenduComponent {
  note! : string;
  _id! : string;
  id! : string;
  assignmentTransmis?: Assignment;
  constructor(
    private assignmentsService: AssignmentsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe(params => {
      this.note = params['note'];
      this._id = params['_id'];
      this.id = params['id'];
  });
    
   }
  ngOnInit(){
    // on va chercher l'assignment à afficher
    this.assignmentsService.rendreAssignment(this._id, parseFloat(this.note))
      .subscribe(assignment => {
        //this.assignment = assignment;
        // this.assignmentTransmis = assignment;
        // this.assignmentTransmis!.dateDeRendu = new Date();
        // this.assignmentTransmis!.rendu = true;
        console.log(assignment);
        // this.assignmentsService.updateAssignment(assignment!).subscribe((message) => {
        //   console.log("UPDATING ==> " + message);
  
        //   // navigation vers la home page
          this.router.navigate(['/assignments/'+this.id]);
        // });
      });
  }
}
