import { Request, Response, NextFunction } from "express";

/**
 * Optional: Middleware to protect cron endpoints
 * Use this if you want to restrict cron access
 */

// Option 1: API Key based protection
export function cronApiKeyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const apiKey = req.headers["x-cron-api-key"];
  const validKey = process.env.CRON_API_KEY;

  if (!validKey) {
    console.warn("⚠️  CRON_API_KEY not set in environment variables");
    return next(); // Allow if not configured
  }

  if (apiKey !== validKey) {
    return res.status(401).json({
      success: false,
      error: "Invalid or missing CRON_API_KEY",
    });
  }

  return next();
}

// Option 2: Admin authentication (if you have admin middleware)
export function cronAdminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Assuming you have an admin middleware that checks authentication
  // This is just a placeholder
  const isAdmin = (req as any).user?.role === "admin";

  if (!isAdmin) {
    return res.status(403).json({
      success: false,
      error: "Admin access required",
    });
  }

  return next();
}

// Option 3: Environment-based protection
export function cronEnvMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const env = process.env.NODE_ENV;

  // Only allow cron in production with proper header
  if (env === "production") {
    const authHeader = req.headers["authorization"];
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

    if (authHeader !== expectedAuth) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized cron access",
      });
    }
  }

  return next();
}