const response = require("../../helpers/response");
const { forExample } = require("../../helpers/forExample");

const test = (req, res) => {
    response.res200("Success fetching the API", null, res);
};

const helloIndex = (req, res) => {
    forExample();

    response.res200("Success fetching the API!", null, res);
};

module.exports = { test, helloIndex };
