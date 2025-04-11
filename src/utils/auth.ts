import {jwtDecode} from "jwt-decode";

export interface DecodedToken {
  uid: string;
  sub: string;
  name: string;
  role: string | string[];
  exp: number;
}

export function decodeToken(token: string): DecodedToken {
  return jwtDecode<DecodedToken>(token);
}
