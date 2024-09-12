import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class SessionManager {

    private readonly temporaryUserName: string = 'foodmap@gmail.com';
    private readonly temporaryPass: string = 'foodmap123';
    private readonly temporaryUserName1: string = 'user';
    private readonly temporaryPass1: string = 'password';
    
    performLogin(user: string, password: string): boolean {
        if(user == this.temporaryUserName && password == this.temporaryPass || user == this.temporaryUserName1 && password == this.temporaryPass1) {
            return true;
        } else {
            return false;
        }  
    }

    performLogout() {
        //TODO
    }
}