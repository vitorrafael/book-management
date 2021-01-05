class CustomError extends Error {
    
    constructor(status, message, code) {
        super(message);
        this.status = status;
        this.code = code;
    }

    setErrorCode(code) {
        this.code = code;
    }
}

module.exports = CustomError;