import { Component, EventEmitter, Output, Renderer2 } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  user:any;
  quantityMessage:any = 0

  messages$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  chats$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  users$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  users:any
  fakeusers:any
  @Output() navbarClicked: EventEmitter<void> = new EventEmitter<void>();

  constructor(private renderer:Renderer2,private router:Router,private db: AngularFireDatabase){}
  ngOnInit(): void {
    let getdatauser = localStorage.getItem("user")
    let data = getdatauser ? JSON.parse(getdatauser) : []
    if(getdatauser){
      this.user = data      
    }

    this.db.object('chats').valueChanges().pipe(
      map((value: any) => {
        return value ? Object.entries(value).map(([key, value]) => ({ [key]: value })) : [];
      })
    ).subscribe((chats: any[]) => {
      this.chats$.next(chats);
      this.getUser()
    });

    this.db.object('users').valueChanges().pipe(
      map((value: any) => {
        return value ? Object.entries(value).map(([key, value]) => ({ [key]: value })) : [];
      })
    ).subscribe((users: any[]) => {
      this.users$.next(users);
      const transformedUsers: any = this.users$.value.map(obj => {
        const id = Object.keys(obj)[0];
        const data = obj[id];
        return { id, ...data };
      });
      this.getUser()
    });

    this.db.object('messages').valueChanges().pipe(
      map((value: any) => {
        return value ? Object.entries(value).map(([key, value]) => ({ [key]: value })) : [];
      })
    ).subscribe((messages: any[]) => {
      this.messages$.next(messages);
      this.getUser()
    });
  }


  logout(){
    localStorage.removeItem("user");
    localStorage.removeItem("refreshToken");
    this.router.navigate(["/login"])
  }

  onClickNavbar() {
    this.navbarClicked.emit();
  }

  getUser() {
    if (this.chats$.value.length > 0 && this.users$.value.length > 0 && this.messages$.value.length > 0) {
      const transformedUsers = this.users$.value.map(obj => {
        const id = Object.keys(obj)[0];
        const data = obj[id];
        return { id, ...data };
      });

      const transformedChats: any = this.chats$.value.map(obj => {
        const id = Object.keys(obj)[0];
        const data = obj[id];
        return { id, ...data };
      });

      const transformedMessages: any = this.messages$.value.map(obj => {
        const id = Object.keys(obj)[0];
        const data = obj[id];
        return { id, ...data };
      });

      const getUser = transformedChats.map((data: any) => {
        const finduser = data.members.filter((value: any) => value.includes('customer'))
        
        const unreadmsg = transformedMessages.reduce((sum: any, data: any) => {
          if (data.senderId.includes(finduser[0]) && data.isreadadmin == false) {
            return sum + 1
          } else {
            return sum
          }
        }, 0)
        const user: any = transformedUsers.filter(item => item.userid.includes(finduser))
        return {
          ...data,
          username: user[0].username,
          avatar: user[0].avatar,
          quantityunread: unreadmsg
        }
      })
      this.users = getUser 
      this.quantityMessage = this.users.reduce((sum:number,data:any)=>sum+=data.quantityunread,0)   
      this.fakeusers = this.users
    }

  }
  redirectMessage(){
    this.router.navigate(["/message"]);
  }
}
