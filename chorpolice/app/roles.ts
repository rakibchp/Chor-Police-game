export type RoleId = "raja" | "mantri" | "police" | "chor";

export type Role = {
  id: RoleId;
  name: string;
  bengali: string;
  points: number;
  icon: string;
};

export type RoundDeal = {
  roles: Role[];
  hint: {
    text: string;
    possibleIndices: number[];
  };
  ready: boolean;
};

export const roles: Role[] = [
  { id: "raja", name: "Raja", bengali: "রাজা", points: 1000, icon: "👑" },
  { id: "mantri", name: "Mantri", bengali: "মন্ত্রী", points: 800, icon: "🧠" },
  { id: "police", name: "Police", bengali: "পুলিশ", points: 800, icon: "🕵️" },
  { id: "chor", name: "Chor", bengali: "চোর", points: 0, icon: "🦹" },
];

export function shuffleRoles(items: readonly Role[] = roles): Role[] {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

export function createRound(): RoundDeal {
  const shuffledRoles = shuffleRoles();
  const chorIndex = shuffledRoles.findIndex((role) => role.id === "chor");
  const useHalfClue = Math.random() < 0.5;

  if (useHalfClue) {
    const firstIndex = chorIndex < 2 ? 0 : 2;
    const side = chorIndex < 2 ? "first" : "last";

    return {
      roles: shuffledRoles,
      hint: {
        text: `The Chor is hiding in one of the ${side} two cards.`,
        possibleIndices: [firstIndex, firstIndex + 1],
      },
      ready: true,
    };
  }

  const parity = chorIndex % 2;
  const isOdd = parity === 0;

  return {
    roles: shuffledRoles,
    hint: {
      text: `The Chor is on an ${isOdd ? "odd" : "even"}-numbered card.`,
      possibleIndices: [parity, parity + 2],
    },
    ready: true,
  };
}