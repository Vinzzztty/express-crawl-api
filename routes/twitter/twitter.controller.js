const { exec } = require("child_process");
const fs = require("fs");
const csv = require("csv-parser");
const { forExample } = require("../../helpers/forExample");
const response = require("../../helpers/response");
const { stderr } = require("process");

const indexTwitter = (req, res) => {
    forExample();
    response.res200("Success fetching the Twitter API", null, res);
};

const crawlTwitter = async (req, res) => {
    const { keyword } = req.body;
    // const lang = 'id'
    const limit = 100;
    const token = "cb5d39370489c17c2f9f62436cac53bca347ea22";

    // CLI Command
    const command = `npx --yes tweet-harvest@2.6.0 -o "${keyword}" -s "${keyword}" -l ${limit} --token "${token}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Terjadi kesalahan: ${error}`);
            res.status(500).json({ error: "An error occurred" });
            return;
        }

        console.log(`stdout: ${stdout}`);
        console.error(`stderr ${stderr}`);

        const tweetsData = stdout.split("\n").filter(Boolean); // Split stdout into lines and remove empty lines

        // Send JSON response directly
        res.json(tweetsData);
    });
};

module.exports = { indexTwitter, crawlTwitter };
