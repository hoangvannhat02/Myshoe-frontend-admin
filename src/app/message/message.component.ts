
import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ToastService } from '../myservice/toast.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent {
  messages$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  chats$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  users$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  user: any
  users: any[] = []
  fakeusers:any[] = []
  sendvalue: string = ""
  datachatsid: string = ""

  roomchats: any[] = []
  dataMessages: any[] = []
  constructor(private db: AngularFireDatabase, private toastmsg: ToastService) {
    this.user = JSON.parse(localStorage.getItem("user") || '{}');
  }

  ngOnInit(): void {
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
  
      const findUser = transformedUsers.find((x: any) => x.userid.includes("admin" + this.user.MaNguoiDung))
      if (!findUser) {
        const data = {
          userid: "admin" + this.user.MaNguoiDung,
          username: this.user.HoTen,
          avatar: this.user.Anh
        };
        this.db.list('users').push(data);
      }
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
  handleNavbarClick() {
    const menuListElement = document.querySelector('.navbar_content');
    let classNavRight = menuListElement?.parentElement?.parentElement?.parentElement;
    let classNavLeft = menuListElement?.parentElement?.parentElement?.parentElement?.previousElementSibling;
    if (classNavRight) {
      classNavRight.className = classNavRight.className === "col c-12 m-12 l-12 content_nav_hiddened" ? "col c-12 m-9 l-9" : "col c-12 m-12 l-12 content_nav_hiddened";
      if (classNavLeft) {
        if ((classNavLeft as HTMLElement).style.display === "none") {
          (classNavLeft as HTMLElement).style.display = "block";
        } else {
          (classNavLeft as HTMLElement).style.display = "none";
        }
      }
    }
  }

  chosseRoomChat(data: any) {
    this.datachatsid = data.id
    let user: any[] = []        
    this.messages$.pipe(
      map((messages: any[]) => {
        this.dataMessages = []
        const transformedData = messages.map(obj => {
          const id = Object.keys(obj)[0];
          const data = obj[id];
          return { id, ...data };
        });
        return transformedData.filter(message => message.groupId === data.id);
      })
    ).subscribe((filteredMessages: any[]) => {
      for (let message of filteredMessages) {
        const existingIndex = this.dataMessages.findIndex((data: any) =>
          data.id === message.id
        );
        if (existingIndex === -1) {
          for (let x of this.users$.value) {
            user = Object.values(x);
            if (user[0].userid === message.senderId) {
              if (data.id === this.datachatsid) {
                this.db.object('messages/' + message.id).update({ isreadadmin: true })
              }
              this.dataMessages.push({
                ...message,
                avatar: user[0].avatar,
                userid: user[0].userid,
                username: user[0].username
              });
            }
          }
        }
      }
      this.scrollEnd();
    });
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
      this.fakeusers = this.users
    }
  }

  addMessage() {
    const currentTimestamp = new Date().getTime();
    if (this.sendvalue.length < 1) {
      this.toastmsg.showToast({
        title: "Chưa nhập nội dung phản hồi",
        type: 'warning'
      })
    }
    else {
      const msgData = {
        groupId: this.datachatsid,
        senderId: "admin" + this.user.MaNguoiDung,
        content: this.sendvalue,
        isreaduser: false,
        isreadadmin: true,
        timestamp: currentTimestamp
      }

      this.db.list('messages').push(msgData).then((data:any) => {
        const transformedData: any = this.chats$.value.map(obj => {
          const id = Object.keys(obj)[0];
          const data = obj[id];
          return { id, ...data };
        });

        const lastmessagenew = {
          content:this.sendvalue,
          messageId:data.key,
          senderId:msgData.senderId,
          timestamp:msgData.timestamp
        }
        this.db.object('chats/'+this.datachatsid+"/lastMessage").update(lastmessagenew)

        const chatToUpdate = transformedData.find((chat: any) => chat.id === this.datachatsid);
        if (chatToUpdate) {
          const isAdminMember = chatToUpdate.members.includes("admin" + this.user.MaNguoiDung);
          if (!isAdminMember) {
            const newData = {
              members: [...chatToUpdate.members, "admin" + this.user.MaNguoiDung]
            };
            this.db.object('chats/' + this.datachatsid).update(newData)
              .then(() => console.log('Dữ liệu members đã được cập nhật'))
              .catch(error => console.error('Lỗi khi cập nhật dữ liệu members:', error));
          }
        }
        this.sendvalue = "";
        this.scrollEnd();
      })
        .catch(error => {
          console.error("Thêm dữ liệu không thành công:", error);
        });
    }
  }

  findUser(event:any){
    let getvalue = event.target.value
    if(getvalue === ""){
      this.users = this.fakeusers
    }else{
      let fillterUser = this.fakeusers.filter((x:any)=>
        {
          return x.username.toLowerCase().includes(getvalue.toLowerCase())   
        }
    )
      this.users = fillterUser      
    }
    
  }

  scrollEnd() {
    const messageContent = document.querySelector('.box_message__content');

    messageContent!.scrollTop = messageContent!.scrollHeight - messageContent!.clientHeight;
  }
}
