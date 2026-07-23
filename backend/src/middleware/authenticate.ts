import type { NextFunction, Request, Response } from "express";
import { firebaseAuth } from "../firebaseAdmin.js";

export type AuthenticatedRequest = Request & {
  firebaseUser?: {
    uid: string;
    email?: string;
  };
};

export async function authenticate(
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction,
) {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader?.startsWith("Bearer ")) {
    response.status(401).json({
      message: "Authentication token is required.",
    });
    return;
  }

  const token = authorizationHeader.replace("Bearer ", "").trim();

  try {
    const decodedToken = await firebaseAuth.verifyIdToken(token);

    request.firebaseUser = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };

    next();
  } catch (error) {
    console.error("Firebase token verification failed:", error);

    response.status(401).json({
      message: "Invalid or expired authentication token.",
    });
  }
}