import type { TokenPayload } from '../domain/auth/ports';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export {};