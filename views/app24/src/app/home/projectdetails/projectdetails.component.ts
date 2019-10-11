import { Component, OnInit } from '@angular/core';
import { ProjectService, AuthenticationService, SupplierService, CompositionsService, SlumpService, NotificationService } from '../../_services';
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
//loading spinner
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-projectdetails',
  templateUrl: './projectdetails.component.html',
  styleUrls: ['./projectdetails.component.css']
})
export class ProjectdetailsComponent implements OnInit {

  project: any;
  user: any;
  suppList: any;

  compositions: any;

  newslump: FormGroup;

  nextaction: any = { show: false };


  constructor(
    private projectservice: ProjectService,
    private router: ActivatedRoute,
    private authentication: AuthenticationService,
    private supplierservice: SupplierService,
    private slumpservice: SlumpService,
    private fb: FormBuilder,
    private alert: ToastrService,
    private compositionservice: CompositionsService,
    private spinner: NgxSpinnerService,
    private notificationservice: NotificationService
  ) { }

  ngOnInit() {

    //init the slumptest form
    this.newslump = this.fb.group({
      value: [''],
      supplierid: [''],
      compositionid: [''],
      loadid: ['']
    });


    this.projectservice.getProject(this.router.snapshot.paramMap.get("idproject")).subscribe(
      data => {
        console.log(data);
        this.project = data;
        //get the suppliers's project list
        this.suppList = "hello";
        this.supplierservice.getAll(this.project.idprojects).subscribe(
          data => {
            console.log("List of suppliers: ", data);
            this.suppList = data
            console.log("List of suppliers: ", this.suppList);
          }, err => {
            console.log(err);
          }
        )
      }, err => {
        console.log(err);
      })

    //get user details
    let user = this.authentication.getUserDetails();
    if (user != null) {
      this.user = user
    }

    //get available compositions for this project
    this.compositionservice.getCompByProject(this.router.snapshot.paramMap.get("idproject")).subscribe(
      data => {
        console.log("we have this compositions available: ", data);
        this.compositions = data;
      }, err => {
        console.log(err)
      }
    )
  }

  //getter
  get f() { return this.newslump.controls }

  nextactionSend() {
    console.log("sending notifications... from:",this.nextaction.answer);
    this.nextaction.show = false;
    this.spinner.show();
    this.notificationservice.sendNotification(this.nextaction.answer).subscribe(
      data => {
        this.spinner.hide();
        this.alert.success("Notifications sent");
        this.newslump.reset();
      }, err => {
        this.spinner.hide();
        this.alert.error(err);
        this.nextaction.show = false;
        this.newslump.reset();
      })
  }
  nextactionNo() {
    console.log("No notifications will be sent");
    this.nextaction.show = false;
    this.newslump.reset();
  }

  saveSlump() {

    if (this.f.supplierid.value != "" && this.f.value.value != 0 && this.f.compositionid.value.idcompositions != "" && this.f.loadid.value != "") {
      //console.log("max:", this.f.compositionid.value.tholdmax);
      //console.log("min:", this.f.compositionid.value.tholdmin);
      if (this.f.value.value >= this.f.compositionid.value.tholdmax || this.f.value.value <= this.f.compositionid.value.tholdmin) {

        //check if the introduced value is outside of the thresholds
        var result = confirm("The slump test value is out of threshold's range - Notification will be sent!");
        if (result) {
          //if the user wants to trigger a notification already

          //get the next predicted value
          this.spinner.show();
          this.slumpservice.registerTest(this.f.value.value, this.f.compositionid.value.idcompositions, this.project.idprojects, this.f.supplierid.value.idsuppliers, this.f.loadid.value).subscribe(
            data => {
              console.log("registerTest", data);
              this.alert.success("Test was saved")

              //generate already the notification because threshold is already overcomed
              console.log("Creating first notification... threshold overcomed");
              this.notificationservice.sendNotification({ result: { code: 3, message: "outside thresholds", type: "measured" }, prediction: this.f.value.value, idcompositions: this.f.compositionid.value.idcompositions, idprojects: this.project.idprojects, idsuppliers: this.f.supplierid.value.idsuppliers }).subscribe(
                notAnswer => {
                  console.log("Creating first notification answer: ", notAnswer);
                  this.alert.success("Warnings sent");
                }, err => {
                  console.log("Creating first notification answer: ", err);
                  this.alert.success("Warning not sent");
                }
              )


              //get the prediction FOR THE NEXT SLUMP TEST VALUE
              this.slumpservice.createPrediction(this.f.value.value, this.f.compositionid.value.idcompositions, this.project.idprojects, this.f.supplierid.value.idsuppliers, this.f.loadid.value).subscribe(
                predictionAnswer => {
                  this.spinner.hide();
                  this.nextaction.answer = predictionAnswer;
                  // this.newslump.reset();
                  console.log("predictionAnswer", predictionAnswer)
                  if (predictionAnswer.result.code != 0 && predictionAnswer.result.code != 4) {
                    this.nextaction.show = true;
                    this.nextaction.value = predictionAnswer.prediction;
                    this.nextaction.deviation = (1 - predictionAnswer.deviation) * 100;
                    this.nextaction.message = predictionAnswer.result.message;
                  } else {
                    this.newslump.reset();
                  }
                },
                predictionErr => {
                  console.log("predictionErr", predictionErr)
                }
              )

            }, err => {
              this.spinner.hide();
              this.alert.error("Error ")
            })


        } else {
          this.alert.info("Test was not stored by your decision");

        }

      } else {
        this.spinner.show();
        this.slumpservice.registerTest(this.f.value.value, this.f.compositionid.value.idcompositions, this.project.idprojects, this.f.supplierid.value.idsuppliers, this.f.loadid.value).subscribe(
          data => {
            console.log("registerTest", data);

            this.alert.success("Test was saved")

            //get the prediction
            this.slumpservice.createPrediction(this.f.value.value, this.f.compositionid.value.idcompositions, this.project.idprojects, this.f.supplierid.value.idsuppliers, this.f.loadid.value).subscribe(
              predictionAnswer => {
                this.spinner.hide();
                this.nextaction.answer = predictionAnswer;
                console.log("predictionAnswer", predictionAnswer)
                if (predictionAnswer.result.code != 0 && predictionAnswer.result.code != 4) {
                  this.nextaction.show = true;
                  this.nextaction.value = predictionAnswer.prediction;
                  this.nextaction.deviation = (1 - predictionAnswer.deviation) * 100;
                  this.nextaction.message = predictionAnswer.result.message;
                } else {
                  this.newslump.reset();
                }
              },
              predictionErr => {
                console.log("predictionErr", predictionErr)
              }
            )


          }, err => {
            this.spinner.hide();
            this.alert.error("Error ")
          })
      }
    } else {
      this.alert.error("Please insert all the fields")
    }
  }

}
