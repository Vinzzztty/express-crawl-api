const fs = require("fs");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const randomUseragent = require("random-useragent");

const process = require("process");

const response = require("./../../helpers/response");
const { forExample } = require("../../helpers/forExample");

const indexTokped = (req, res) => {
    forExample();
    response.res200("Success fetching the API", null, res);
};

const crawlTokped = async (req, res) => {
    try {
        const { url } = req.body;
        const randomAgent = randomUseragent.getRandom();

        // Launch a headless browser
        const browser = await puppeteer.launch({
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        // const context = await browser.createIncognitoBrowserContext(); //mode penyamaran

        // open a new page
        const page = await browser.newPage();

        await page.setJavaScriptEnabled(true); //aktifkan javascript
        await page.setUserAgent(randomAgent); //setting user agent
        await page.goto(url, { waituntil: "domcontentloaded", timeout: 0 }); //tunggu proses dom/load pagenya selesai
        const body = await page.evaluate(() => {
            return document.querySelector("body").innerHTML;
        }); //mendapatkan isi tag html body

        console.log(body);

        // Respond with a success message
        res.status(200).json({
            message: "Website is accessible and can be scraped",
            data: body,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error occurred while scraping website",
        });
    }
};

const indexTokped2 = async (req, res) => {
    try {
        // Launch a headless browser
        const browser = await puppeteer.launch({
            headless: true,
            defaultViewport: null,
        });

        // open a new page
        const page = await browser.newPage();

        // navigate to the node.js topic page on GitHub
        await page.goto("https://github.com/topics/nodejs");

        const extractedRepos = await page.evaluate(() => {
            // select all repository elements
            const repos = Array.from(
                document.querySelectorAll("article.border")
            );

            // Create an empty array to store extracted data
            const repoData = [];

            // Loop through each repository element
            repos.forEach((repo) => {
                const user = repo
                    .querySelector("h3 > a:first-child")
                    .textContent.trim();

                // use nth-child() select elements in the DOM by their index
                const repoName = repo
                    .querySelector("h3 > a:nth-child(2)")
                    .textContent.trim();

                const repoLink = repo
                    .querySelector("h3 > a:nth-child(2)")
                    .getAttribute("href");

                const urlRepo = `https://github.com${repoLink}`;

                const repoStar = repo
                    .querySelector("#repo-stars-counter-star")
                    .textContent.trim();

                const repoTitle = repo
                    .querySelector("#repo-stars-counter-star")
                    .getAttribute("title");

                const repoDesc = repo
                    .querySelector("div.px-3 > p")
                    .textContent.trim();

                const tagsElements = Array.from(
                    repo.querySelectorAll("a.topic-tag")
                );
                const tags = tagsElements.map((tag) => tag.textContent.trim());

                repoData.push({
                    user,
                    repoName,
                    urlRepo,
                    repoStar,
                    repoTitle,
                    repoDesc,
                    tags,
                });
            });

            return repoData;
        });

        console.log(`We extracted ${extractedRepos.length} repositories.\\n`);

        // Close the browser
        await browser.close();

        // Send extracted data as response
        res.status(200).json(extractedRepos);
    } catch (error) {
        console.log(error);
        // Handle errors
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { indexTokped, crawlTokped, indexTokped2 };
