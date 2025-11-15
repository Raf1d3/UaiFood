declare namespace Express {
  export interface Request {
    user: {
      id: bigint;
      role: UserType;
    };
  }
}