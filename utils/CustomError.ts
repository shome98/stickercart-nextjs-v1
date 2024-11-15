export class CustomError extends Error {
    statusCode: number;
    data: string|undefined;
    success: boolean;
    errors: string[];

    constructor(
        statusCode: number,
        message = "Something bad happened",
        errors: string[] = [],
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = "";
        this.message = message;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}