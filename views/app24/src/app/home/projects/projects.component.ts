import { Component, OnInit } from '@angular/core';
import { ProjectService, AuthenticationService } from '../../_services';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})

export class ProjectsComponent implements OnInit {

  projectsList: any;
  projectsListFiltered = [];
  user: any;
  newProjectForm: FormGroup;

  constructor(
    private ProjectService: ProjectService,
    private authentication: AuthenticationService,
    private fb: FormBuilder) { }

  
    getProjects(){
      this.ProjectService.getAll().subscribe(answer => {
        this.projectsList = answer;
        //present the filtered project by ongoing
        this.projectsListFiltered = this.projectsList.filter(projects => projects.status == 't')
        console.log(answer);
      }, err => {
        //TODO
      })
    }
    ngOnInit() {
    //get user details
    let user = this.authentication.getUserDetails();
    if (user != null) {
      this.user = user
    }

    this.getProjects();

    this.newProjectForm = this.fb.group({
      name: [''],
      description: ['']
    });
  }
  //form getter
  get f() { return this.newProjectForm.controls }

  onSubmit() {
    this.ProjectService.create(this.f.name.value, this.f.description.value).subscribe(data => {
      //refresh project's list
      this.getProjects();
      this.newProjectForm.reset();
    }, err => {
      console.log(err);

    })
  }
  onChangeFilter(selection) {

    if(selection == 'Ongoing'){
      this.projectsListFiltered = this.projectsList.filter(projects => projects.status == 't')
    }else{
      this.projectsListFiltered = this.projectsList.filter(projects => projects.status == 'f')
    }
    
  }

}
