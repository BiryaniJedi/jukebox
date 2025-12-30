import 'express';

declare module 'express' {
  interface Request {
    user?: {
      user_id: string;
      display_name: string;
    };
  }
}
