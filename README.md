# Expres Crawling API

You can crawling data Tokopedia product review, and Twitter Post

Install Dependencies

```
npm install
```

Run the server development

```
npm run dev
```

## API Endpoints Description

1. Crawl Product Review Tokopedia:

    - Endpoint: `/api/crawl/tokopedia`
    - Body: `url` (JSON): Unique identifier of url product review tokopedia
    - Example: `url: "https://www.tokopedia.com/aerostreet/aerostreet-t-shirt-reguler-polos-gelap-kaos-t-shirt-tshirt-kaaaa-xs-maroon-gelap/review" `

2. Crawl Twitter:
    - Endpoint: `/api/crawl/twitter`
    - Body: `keyword` (JSON): Unique identifier of keyword post on twitter
    - Example: `keyword: "MU vs City" `
