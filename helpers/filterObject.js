const removeEmptyProperties = (obj) => {
    if (typeof obj !== "object") {
        throw new Error("Input must be an object");
    }

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (obj[key] === undefined || obj[key] === null || obj[key] === "") {
                delete obj[key];
            }
        }
    }

    return obj;
};
module.exports = { removeEmptyProperties };
