import { Component, OnInit } from '@angular/core';
import { ProjectService, AuthenticationService, SupplierService, CompositionsService, UserService, AccountsService } from '../../_services';
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-projectsettings',
  templateUrl: './projectsettings.component.html',
  styleUrls: ['./projectsettings.component.css']
})
export class ProjectsettingsComponent implements OnInit {

  project: any;
  unsetProject: any;
  suppliers: any;
  supplierName: String;
  users: any;
  availableusers: any;
  groupedusers: any = [{group: 'Admins', items:[]},{group: 'Contractors', items:[]},{group: 'Providers', items:[]}]
  selectedUser: any;
  user: any;
  newUserForm: FormGroup;

  compositions: any;
  newComp: any;

  constructor(
    private projectservice: ProjectService,
    private router: ActivatedRoute,
    private rou: Router,
    private authentication: AuthenticationService,
    private supplierservice: SupplierService,
    private alert: ToastrService,
    private userservice: UserService,
    private accountservice: AccountsService,
    private compositionsservice: CompositionsService,
    private fb: FormBuilder) { }

  getUsersOnProject() {
    this.userservice.getOnProject(this.router.snapshot.paramMap.get("idproject")).subscribe(
      data => {
        this.users = data;
        console.log("users", data);
      }, err => {
        console.log(err);
      }
    )
  }

  getCompositions() {
    this.compositionsservice.getCompByProject(this.router.snapshot.paramMap.get("idproject")).subscribe(
      data => {
        this.compositions = data;
      }, err => {
        console.log(err);
      }
    )
  }

  ngOnInit() {
    this.supplierName = '';

    this.newComp = { name: '', tholdmin: 0, tholdmax: 0 };
    
    //define the newUserForm
    this.newUserForm = this.fb.group({
      newuser: [''],
    });

    this.projectservice.getProject(this.router.snapshot.paramMap.get("idproject")).subscribe(
      data => {
        this.project = data;
        this.unsetProject = data;
      }, err => {
        console.log(err);
      })


    this.supplierservice.getAll(this.router.snapshot.paramMap.get("idproject")).subscribe(
      data => {
        this.suppliers = data;
      }, err => {
        console.log("err", err);
      }
    )

    this.getUsersOnProject();

    let user = this.authentication.getUserDetails();
    if (user != null) {
      this.user = user;

      this.accountservice.getAvailableUsers(this.user.id).subscribe(
        data => {
          this.availableusers = data;
          this.availableusers.forEach(eachUser => {
            //contractors
            if(eachUser.idroles == 1){
              this.groupedusers.forEach(eachGroup => {
                if(eachGroup.group == "Contractors"){ eachGroup.items.push(eachUser)}
              })
            }
            //admins
            if(eachUser.idroles == 2){
              this.groupedusers.forEach(eachGroup => {
                if(eachGroup.group == "Admins"){ eachGroup.items.push(eachUser)}
              })
            }
            //providers
            if(eachUser.idroles == 3){
              this.groupedusers.forEach(eachGroup => {
                if(eachGroup.group == "Providers"){ eachGroup.items.push(eachUser)}
              })
            }
          });
          
        }, err => {
          console.log("available users err: ", err);
        }
      )

    }

    this.getCompositions();
  }

  updateName(projectId) {
    this.projectservice.updateName(projectId, this.project.name).subscribe(
      data => {
        this.alert.success('Name updated');
        this.unsetProject.name = this.project.name;
      }, err => {
        this.alert.error('Name not updated');
        this.project.name = this.unsetProject.name
      }
    )
  }

  updateDescription(projectId) {
    this.projectservice.updateDescription(projectId, this.project.description).subscribe(
      data => {
        this.alert.success('Description updated');
        this.unsetProject.description = this.project.description;
      }, err => {
        this.alert.error('Description not updated');
        this.project.description = this.unsetProject.description
      }
    )
  }

  updateStatus(projectId) {
    let newStatus = { boolean: false, value: 'f', previous: 'f' };
    if (this.project.status == 't') {
      newStatus.boolean = false;
      newStatus.value = 'f';
      newStatus.previous = 't';
    } else {
      newStatus.boolean = true;
      newStatus.value = 't';
      newStatus.previous = 'f';
    }
    this.projectservice.updateStatus(projectId, newStatus.boolean).subscribe(
      data => {
        this.alert.success('Status updated');
        this.project.status = newStatus.value;
        this.unsetProject.status = newStatus.value;
      }, err => {
        this.alert.error('Status not updated');
        this.project.status = newStatus.previous;
        this.unsetProject.status = newStatus.previous;
      }
    )
  }

  updateThold(projectId) {
    this.projectservice.updateThreshold(projectId, this.project.threshold).subscribe(
      data => {
        this.alert.success('Threshold updated');
        this.unsetProject.threshold = this.project.threshold;
      }, err => {
        this.alert.error('Threshold not updated');
        this.project.threshold = this.unsetProject.threshold
      }
    )
  }

  deleteProject(projectId) {
    this.projectservice.delete(projectId).subscribe(
      data => {
        this.alert.success('Machine deleted');
        this.rou.navigate(['/home/machine']);
      }, err => {
        this.alert.error('Machine not deleted');
      })
  }

  createSupplier() {
    console.log("this is the name ", this.supplierName);
    this.supplierservice.create(this.supplierName, this.project.idprojects).subscribe(data => {
      this.alert.success("Supplier created")
      this.ngOnInit();
    }, err => {
      this.alert.error("Supplier not created")

    })
  }

  deleteEq(id) {
    this.supplierservice.delete(id).subscribe(data => {
      this.alert.success("Supplier deleted")
      this.ngOnInit();
    }, err => {
      this.alert.error("Supplier not deleted")
    })
  }
  get f() { return this.newUserForm.controls }
  addUser() {
    console.log("selected user:",this.f.newuser.value);
    this.userservice.allocate(this.f.newuser.value.idaccounts, this.project.idprojects).subscribe(
      data => {
        this.alert.success("User has been added to this project");
        this.getUsersOnProject();
      }, err => {
        this.alert.error("User was not added to the project");
        console.log(err);
      }
    )
    this.newUserForm.reset();

  }
  deleteUser(AllocationId) {
    this.userservice.unAllocate(AllocationId).subscribe(data => {
      this.alert.success("User has been deleted from this project")
      this.getUsersOnProject();
    }, err => {
      this.alert.error("User was not deleted from the project");
      console.log(err);
    })
  }

  createComposition() {
    if(this.newComp.tholdmin < this.newComp.tholdmax){
      this.compositionsservice.create(this.newComp.name, this.newComp.tholdmin, this.newComp.tholdmax, this.router.snapshot.paramMap.get("idproject")).subscribe(
        data => {
          this.alert.success("Composition created");
          this.getCompositions();
          this.newComp = { name: '', tholdmin: 0, tholdmax: 0};
        }, err => {
          this.alert.error("Composition was not created")
        }
      )
    }else{
      this.alert.error("Composition threshold must be Max bigger then Min")
    }
    
  }

  deleteComposition(id){
    this.compositionsservice.delete(id).subscribe(
      data => {
        this.alert.success("Composition has been deleted");
        this.getCompositions();
      }, err => {
        this.alert.error("Composition not deleted")
      }
    )
  }

}
