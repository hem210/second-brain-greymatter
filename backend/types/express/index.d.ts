import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      id?: string; // ✅ optional, because not all routes are authenticated
    }
  }
}
