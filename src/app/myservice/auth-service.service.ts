import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap } from 'rxjs/operators';
import { Observable, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  constructor(private http: HttpClient, private router: Router) { }

  getAccessToken(): string | null {
    let token = "";
    let getdatauser = localStorage.getItem("user")
    let data = getdatauser ? JSON.parse(getdatauser) : []
    if (getdatauser) {
      token = data.ToKen
    }
    return token;
  }

  refreshToken(): Observable<any> {
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : []
    if (!userData) {
      this.router.navigate(['/login']);
    }
    let params = {
      Email: user.Email,
      PassWord: user.PassWord
    }
    return this.http.post("http://localhost:8000/admin/user/login", params).pipe(
      map((response: any) => {
        if (response.results) {
          const data = localStorage.getItem("user");
          const existingUser = data ? JSON.parse(data) : [];
          existingUser.ToKen = response.token; // Assuming token property in existingUser

          localStorage.setItem("user", JSON.stringify(existingUser));
        }
        return response; // You might want to return the response for further processing
      }), catchError((error) => {
        console.error(error);
        throw error; // Re-throw the error to propagate it down the observable chain
      })
    );
  }
}
