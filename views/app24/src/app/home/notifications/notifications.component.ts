import { Component, OnInit } from '@angular/core';

import { ProjectService, AuthenticationService, SupplierService, SlumpService, NotificationService } from '../../_services';
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  notifications: any;
  constructor(
    private router: ActivatedRoute,
    private alert: ToastrService,
    private notificationservice: NotificationService) { }

  ngOnInit() {
    this.notificationservice.getNotifications().subscribe(
      data => {
        this.notifications = data;
      }, err => {
        console.log(err);
      }
    )
  }
  read(id) {

    this.notificationservice.markasread(id).subscribe(
      data => {
        console.log(data);
        this.notifications.forEach(eachNot => {
          if (eachNot.idnotification == id) {
            eachNot.read = 't'
          }
        });
      }, err => {
        console.log(err)
      }
    )
  }
  unread(id) {
    this.notificationservice.markasunread(id).subscribe(
      data => {
        console.log(data);
        this.notifications.forEach(eachNot => {
          if (eachNot.idnotification == id) {
            eachNot.read = 'f'
          }
        });
      }, err => {
        console.log(err)
      }
    )
  }
  deleteNotification(id) {
    this.notificationservice.delete(id).subscribe(
      answer => {
        this.alert.success("Notification delete");
        this.notifications.forEach((eachNot,idx,arr) => {
          if(eachNot.idnotification == id){
            this.notifications.splice(idx,1);
          }
        });
      }, err => {
        console.log(err)
      }
    )
  }

}
