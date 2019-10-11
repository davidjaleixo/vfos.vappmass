import { Component, OnInit } from '@angular/core';
import { AuthenticationService, NotificationService } from '../../_services';
import { forEach } from '@angular/router/src/utils/collection';
import { AstMemoryEfficientTransformer } from '@angular/compiler';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  user: any;
  notifications: any;
  unread: any;

  constructor(private authentication: AuthenticationService, private notificationservice: NotificationService) { }

  ngOnInit() {

    let user = this.authentication.getUserDetails();
    if (user != null){
      this.user = user
    }
    this.unread = [];
    //get unread notifications
    this.notificationservice.getNotifications().subscribe(
      data => {

        this.notifications = data;
        this.notifications.forEach(eachNotification => {
          if(eachNotification.read == 'f'){
            this.unread.push(eachNotification)
          }
        })
      }, err => {
        console.log(err);
      }
    )

  }
  logout(){
    this.authentication.logout();
  }
  
  read(id){
    
    this.notificationservice.markasread(id).subscribe(
      data => {
        console.log(data);
        this.unread.forEach((eachNot,index,array) => {
          if(eachNot.idnotification == id){
            this.unread.splice(index,1)
            //eachNot.read = 't'
          }
        });
      },err=>{
        console.log(err)
      }
    )
  }

  unreadall(){
    this.unread.forEach((eachUnread, idx, arr) => {
      this.notificationservice.markasread(eachUnread.idnotification).subscribe(data => {
        this.unread.splice(idx,1);
      }, err => {
        console.log(err)
      })
    })
  }


}
