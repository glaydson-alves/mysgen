export class ResponseDto<T = any> {
    message: string;
    response?: T;

    constructor(message: string, response?: T) {
        this.message = message;
        this.response = response;
    }
}
