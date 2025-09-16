import { MyPayload } from "../middleware/auth";

declare global {
  namespace Express {
    interface Request {
      user?: MyPayload;
    }
  }
}
// nhan dang req.user bang type mypayload
