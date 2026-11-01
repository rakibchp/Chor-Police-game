# Chor Police — চোর পুলিশ

A digital take on the traditional Bangladeshi classroom guessing game played with folded paper slips. Play as the Police, follow a clue, and try to catch the hidden Chor.

## Features

- Four roles are shuffled into four face-down cards each round: Raja, Mantri, Police, and Chor.
- A clue narrows the Chor to two cards. Clues use either the first/last half or odd/even card numbers.
- Choose a card to reveal all four roles and see whether the guess was correct.
- Keep a running score across rounds: a correct guess earns the Police reward of 800 points; a wrong guess earns no points.
- Role reference with English and Bangla names and the traditional point values.
- Responsive layout, keyboard focus indicators, accessible card labels, and reduced-motion support.
- No account, server-side game data, or third-party service is required. The score resets when the page is refreshed.

## Roles and points

| Role | Bangla | Points |
| --- | --- | ---: |
| Raja | রাজা | 1,000 |
| Mantri | মন্ত্রী | 800 |
| Police | পুলিশ | 800 |
| Chor | চোর | 0 |

The player takes the Police role outside the four-card deal. The four cards contain one of each role; correctly identifying the Chor awards 800 points to the player.

## Requirements

- Node.js 20.9 or later
- npm (or another package manager that supports the included `package-lock.json`)

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The development server supports hot reloading.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local Next.js development server. |
| `npm run build` | Create an optimized production build. |
| `npm run start` | Serve the production build locally; run `npm run build` first. |
| `npm run lint` | Run ESLint on the project. |

## Project structure

```text
app/
  game.tsx       Interactive game, round state, scoring, and UI
  globals.css    Tailwind CSS import, theme colors, and global styles
  layout.tsx     Root layout and page metadata
  page.tsx       Home route
  roles.ts       Role definitions, Fisher–Yates shuffle, and clue generation
public/          Static assets
```

## How it works

`app/roles.ts` contains the role data and shuffles a copied role array using the Fisher–Yates algorithm. It then generates a clue consistent with the shuffled Chor position, leaving exactly two possible cards. The interactive client component in `app/game.tsx` handles card selection, reveals the deal, and increments the score only when the selected role is Chor. Starting the next round deals and shuffles a fresh set of roles while keeping the score.

The game runs entirely in the browser. Refreshing the page starts a new game and resets the round and score.

## Tech stack

- [React](https://react.dev/) 19
- [Next.js App Router](https://nextjs.org/docs/app) 16
- [Tailwind CSS](https://tailwindcss.com/) 4
- [TypeScript](https://www.typescriptlang.org/) 5

## Deployment

Build the app with `npm run build`, then run it with `npm run start`. It can also be deployed to any hosting platform that supports Next.js. No environment variables are needed.

## License

No license has been specified for this project.
