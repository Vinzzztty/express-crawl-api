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

module.exports = { indexTokped, crawlTokped };
