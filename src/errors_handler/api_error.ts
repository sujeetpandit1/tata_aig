class api_error extends Error {
    status_code: number;
    data: null;
    message: string;
    success: boolean;
    errors: any[];

    constructor(
        status_code: number,
        message: string = "Opps! Something Went Wrong.",
        errors: any[] = [],
        stack: string = ""
    ) {
        super(message);

        this.status_code = status_code;
        this.data = null;
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

function send_error_response(res: any, code: number, message: string) {
    const error = new api_error(code, message);
    res.status(code).json({
        status: "failed",
        message: error.message,
    });
}



export {send_error_response};
