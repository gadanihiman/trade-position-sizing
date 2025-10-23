# Trade Position Sizing

Position sizing calculator for risk-aware entries. Input your account size, risk percentage, entry price, and stop loss to instantly see the recommended position size, risk amounts, and trade direction.

## Live Preview

- https://trade-position-sizing.vercel.app/

## Features

- Direction-aware position sizing (LONG/SHORT) inferred from entry vs. stop loss
- Inline validation for every input field and actionable feedback for corrections
- Responsive layout with reusable `NumberField` and `StatCard` components
- Sanity check hints to help align with exchange lot sizes and leverage nuances

## Tech Stack

- [Next.js 14](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## Getting Started

Install dependencies and run the local development server:

```bash
pnpm install
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

```bash
pnpm dev     # Start the development server
pnpm build   # Create an optimized production build
pnpm start   # Serve the production build
pnpm lint    # Run linting rules
```

> `pnpm lint` requires Node.js v18.12 or newer.

## License

This project is released under the MIT License. See [LICENSE](./LICENSE) for details.
