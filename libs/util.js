module.exports = {
    success: (status, message, data) => {
        if (data !== undefined) {
            return {
                status,
                success: true,
                message,
                data,
            };
        }
        return {
            status,
            success: true,
            message,
        };
    },
    fail: (status, message) => {
        return {
            status,
            success: false,
            message,
        };
    }
};
