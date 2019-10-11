import { Component, OnInit } from '@angular/core';
import { ProjectService, AuthenticationService, SupplierService, SlumpService } from '../../_services';
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { forEach } from '@angular/router/src/utils/collection';


//charts
import { Chart } from 'chart.js';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-slumphistory',
  templateUrl: './slumphistory.component.html',
  styleUrls: ['./slumphistory.component.css']
})
export class SlumphistoryComponent implements OnInit {

  loadingprojects: any;
  slumps: any;
  project: any;

  //chart
  chart = {};
  composition_values = [];
  x_values = [];
  tholdmax = [];
  tholdmin = [];

  //form
  available_compositions = [];
  pick_composition: any;

  constructor(
    private slumpservice: SlumpService,
    private projectservice: ProjectService,
    private router: ActivatedRoute) { }

  ngOnInit() {
    this.loadingprojects = true;
    this.projectservice.getProject(this.router.snapshot.paramMap.get("idproject")).subscribe(
      data => {
        this.project = data;
        this.loadingprojects = false;
      }, err => {
        console.log(err);
      })

    this.slumpservice.getTests(this.router.snapshot.paramMap.get("idproject")).subscribe(
      data => {
        console.log("response", data);
        this.slumps = data
        //this.loading = false;

        this.slumps.forEach((eachSlump, index, array) => {

          //create a list of compositions available
          let found = false;

          if (this.available_compositions.length == 0) {
            this.available_compositions.push(eachSlump.compositionname)
          } else {
            this.available_compositions.forEach((eachAvailable, index, array) => {
              if (eachAvailable == eachSlump.compositionname) {
                found = true;
              }
              if (index == (array.length - 1) && !found) {
                this.available_compositions.push(eachSlump.compositionname);
              }
            })
          }
        });
      }, err => {

      })
  }

  updatechart() {
    this.composition_values = [];
    this.x_values = [];
    this.tholdmax = [];
    this.tholdmin = [];

    this.slumps.forEach((eachSlump, index, array) => {

      if (eachSlump.compositionname == this.pick_composition) {
        this.composition_values.push(eachSlump.value);
        this.x_values.push(eachSlump.date);
        this.tholdmax.push(eachSlump.tholdmax);
        this.tholdmin.push(eachSlump.tholdmin);
      }
      if (index == array.length - 1) {
        //create the chart

        this.chart = {};
        this.chart = new Chart('canvas', {
          type: 'line',
          data: {
            labels: this.x_values,
            datasets: [
              {
                label: this.pick_composition,
                data: this.composition_values,
                borderColor: '#461E68',
                fill: false
              }, {
                label: "Max threshold",
                data: this.tholdmax,
                borderColor: 'red',
                fill: false
              }, {
                label: "Min threshold",
                data: this.tholdmin,
                borderColor: 'grey',
                fill: false
              }
            ]
          }, options: {
            legend: {
              display: true
            },
            scales: {
              xAxes: [{ display: true }],
              yAxes: [{ display: true }]
            }
          }
        });
      }
    });
  }

  deleteSlump(id) {
    this.slumpservice.delete(id).subscribe(data => {
      this.slumps.forEach((eachSlump,idx,arr) => {
        if(eachSlump.idslumptests == id){
          this.slumps.splice(idx,1)
        }
      });
    }, err => {
      console.log(err);
    })
  }

}
