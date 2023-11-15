# HackerDigest

HackerDigest is a modern app designed to summarize top scoring, up to date Hackernews stories for TLDR lovers. This app showcases [https://upstash.com/](Upstash) products. HackerDigest is perfect for tech lovers who don't like spending ton of time reading every bit of word.

## Features

- **Top Stories Summary**: Get the latest high-scoring Hacker News stories in a condensed form.
- **Frequent Updates**: Stories are updated in every 6 hour, ensuring you never miss out on trending topics.
- **Custom Summaries**: Tailor the summary length to fit your reading preferences.

## Built With

- [NextJS 14](https://nextjs.org/)
- [Vercel](https://vercel.com)
- [Tailwind](https://tailwindcss.com/)
- [Upstash Redis](https://github.com/upstash/upstash-redis)
- [Upstash Qstash](https://github.com/upstash/sdk-qstash-ts)
- [Upstash Ratelimit](https://github.com/upstash/ratelimit)

## Installation

To install HackerDigest, follow these steps:

```bash
pnpm install
pnpm dev
```

## Environment Keys

```bash
OPENAI_API_KEY=XXX
OPENAI_ORGANIZATION_API=XXX

UPSTASH_REDIS_REST_URL=XXX
UPSTASH_REDIS_REST_TOKEN=XXX

QSTASH_CURRENT_SIGNING_KEY=XXX
QSTASH_NEXT_SIGNING_KEY=XXX
```


## Contributing to HackerDigest

We welcome contributions to HackerDigest. If you have a suggestion that would make this better, please fork the repository and create a pull request. Don't forget to give the project a star! Thanks again!


## Feature Pipeline

[ ] - Create a newsletter with Resend and send it every 24 hour to users!