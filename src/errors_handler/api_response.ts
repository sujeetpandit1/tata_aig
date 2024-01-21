class api_response {
    status: string;
    message: string;
    data: any;

    constructor(status: string = "success", message: string , data: any) {
        this.status = status;
        this.message = message; // Empty string initially; will be set dynamically later
        this.data = data;
    }
}

export default api_response;