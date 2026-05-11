import { TUser } from "../modules/user/user.interface";


declare global {
  interface Request {
    user: TUser;
  }
}
