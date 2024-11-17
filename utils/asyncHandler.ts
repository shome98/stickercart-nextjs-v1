import { NextApiRequest, NextApiResponse } from "next";

/**
 * A utility to handle async API routes in Next.js and catch errors.
 *
 * @param handler - The async handler function for the API route.
 * @returns A function that wraps the handler with error handling.
 */
export const asyncHandler = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    } catch (error: unknown) {
      console.error(error); // Log the error for debugging
      let errorMessage = "Internal Server Error";

      // Ensure type safety when accessing error properties
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      res.status(500).json({ error: errorMessage });
    }
  };
};
