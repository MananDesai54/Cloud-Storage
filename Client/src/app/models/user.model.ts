export class User {
  constructor(
    public method: string,
    public username: string,
    public email: {
      value: string;
      verified: boolean;
    },
    public id: string,
    public profileUrl: string,
    // tslint:disable-next-line: variable-name
    private _token: string,
    // tslint:disable-next-line: variable-name
    private _tokenExpiration: number
  ) {}

  get token() {
    if (+this._tokenExpiration < +new Date().getTime().toFixed(0)) {
      return null;
    }
    return this._token;
  }

  get tokenExpiration() {
    return this._tokenExpiration;
  }
}