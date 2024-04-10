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

        // open a new page
        const page = await browser.newPage();

        await page.setJavaScriptEnabled(true); //aktifkan javascript
        await page.setUserAgent(randomAgent); //setting user agent
        await page.goto(url, { waituntil: "domcontentloaded", timeout: 0 }); //tunggu proses dom/load pagenya selesai

        // Delay for 2 seconds to ensure the page content is fully loaded
        await page.evaluate(() => {
            return new Promise((resolve) => setTimeout(resolve, 5000));
        });

        const articleHTML = await page.evaluate(() => {
            const articles = Array.from(
                document.querySelectorAll("article.css-72zbc4")
            );

            const reviewArticle = [];

            // Counter to limit the number of articles to 50
            let count = 0;

            articles.forEach((article) => {
                if (count >= 50) return; // Exit loop if we have reached 50 articles

                const user = article.querySelector(".name").textContent.trim();

                // Check if the element exists before accessing its textContent
                const reviewElement = article.querySelector(
                    '[data-testid="lblItemUlasan"]'
                );
                const review = reviewElement
                    ? reviewElement.textContent.trim()
                    : "";

                const star = article.querySelector(
                    '[data-testid="icnStarRating"]'
                );

                const countStar = star.getAttribute("aria-label");

                const intStar = parseInt(countStar.split(" ").pop());

                reviewArticle.push({
                    user,
                    review,
                    intStar,
                });

                count++; // Increment the counter
            });

            return reviewArticle;
        });

        // Close the browser instance
        await browser.close();

        // Respond with the extracted articles
        res.status(200).json({ articles: articleHTML });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error occurred while scraping website",
            detail: error,
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
