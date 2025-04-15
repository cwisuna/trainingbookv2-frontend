import {jwtDecode} from "jwt-decode";

export interface DecodedToken {
  uid: number;
  sub: string;
  name: string;
  role: string[];
  exp: number;
}

export function decodeToken(token: string): DecodedToken {
    const decoded: any = jwtDecode(token);

    const rawRoles = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    const roles = Array.isArray(rawRoles) ? rawRoles : [rawRoles];

    return {
        uid: decoded.uid,
        sub: decoded.sub,
        name: decoded.sub,
        role: roles,
        exp: decoded.exp,
      };
}

export function hasRole(user: DecodedToken | null, role: string): boolean {
    return !!user?.role.includes(role);
  }