exports.Response404 = (error, message, res) => {
    return res.status(404).json({
        status: 404,
        error: error,
        message: message,
        data: {}
    });
};

exports.Response400 = (error, message, res) => {
    return res.status(400).json({
        status: 400,
        error: error,
        message: message,
        data: {}
    });
};

exports.Response500 = (error, message, res) => {
    return res.status(500).json({
        status: 500,
        error: error,
        message: message,
        data: {}
    });
};

exports.Response200 = (error, message, data, res) => {
    return res.status(200).json({
        status: 200,
        error: error,
        message: message,
        data: data
    });
};