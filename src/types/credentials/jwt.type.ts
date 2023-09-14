export type Jwt = {
  user: {
    id: string;
    username: string;
    email: string;
    name: string;
    firstSurname: string;
    secondSurname: string;
  };
  iat: number;
  exp: number;
  iss: string;
};
