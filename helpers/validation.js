exports.Required = (field, val, res) => {

    if(val == null || val == undefined || val == '' || val == ""){
        res.status(400).json({
            status: 400,
            error: null,
            message: `${field} is required!`,
            data: {}
        });

        return false;
    }

    return true;
};

exports.Email = (field, val, res) => {

    if(val == null || val == undefined || val == '' || val == ""){
        res.status(400).json({
            status: 400,
            error: null,
            message: `${field} is required!`,
            data: {}
        });

        return false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if(!emailRegex.test(val)){
        res.status(400).json({
            status: 400,
            error: null,
            message: `${field} is not a valid email!`,
            data: {}
        });

        return false;
    }

    return true;
};

exports.Password = (field, val, res) => {

    if(val == null || val == undefined || val == '' || val == ""){

        res.status(400).json({
            status: 400,
            error: `${field} is required!`,
            message: `${field} is required!`,
            data: {}
        });

        return false;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,20}$/;

    if (!passwordRegex.test(val)) {
        res.status(400).json({
            status: 400,
            error: null,
            message: `${field} must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character!`,
            data: {}
        });

        return false;
    }

    return true;
}