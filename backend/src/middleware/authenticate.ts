import type { NextFunction, Request, Response } from "express";
import { supabase } from "../supabase.js";

export type AuthenticatedRequest = Request & {
  user?: {
    id: string;
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
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      throw error ?? new Error("User not found.");
    }

    request.user = {
      id: data.user.id,
      email: data.user.email,
    };

    next();
  } catch (error) {
    console.error("Supabase token verification failed:", error);

    response.status(401).json({
      message: "Invalid or expired authentication token.",
    });
  }
}
