import { AuthServiceService } from './auth-service.service';
import jwt_decode from 'jwt-decode';
import { catchError } from 'rxjs/operators';



export class User {

    constructor(
        // tslint:disable-next-line: variable-name
        public user_id: string,
        public username: string,
        public email: string,
        // tslint:disable-next-line: variable-name
        private _token: string,
        // tslint:disable-next-line: variable-name
        public tokenExpirationDate: Date,


    ) {}

    get token() {
        // if (!this._tokenExpirationDate || this._tokenExpirationDate <= new Date()) {
       //      return null;
         //   }
         return this._token;
   }

    // get _tokenExpirationDate() {
    //     const tokenDecode = this.token;
    //     this. _tokenExpirationDate = this.getTokenExpirationDate(tokenDecode);
    //     return this._tokenExpirationDate;
    //   }

    getTokenExpirationDate(token: string): Date {
        const decoded = jwt_decode(token);
        console.log(decoded, 'results')
        if (decoded['exp'] === undefined) { return null; }
        const date  = new Date(0);
        date.setUTCSeconds(decoded['exp']);
        console.log('This is the date of the token', date);
        return date;
    }


    get tokenDuration() {
        if (!this.token) {
            return 0;
        }

        return this.tokenExpirationDate.getTime() - new Date().getTime();
    }

}
