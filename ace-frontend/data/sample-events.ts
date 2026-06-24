import { ClubEvent } from "@/lib/types";

export const sampleEvents: ClubEvent[] = [
  {
    id: "1",
    title: "Saturday Morning Cardio Clinic",
    category: "Clinic",
    date: "2026-07-11",
    time: "09:00",
    location: "Court 1–3, Westside Tennis Club",
    capacity: 30,
    description:
      "High-energy drills for all levels — footwork, volleys, and live-ball rallies. Bring a racquet, we'll supply the balls.",
    joined: ["AS", "TK", "MR", "JL", "NP"],
  },
  {
    id: "2",
    title: "Beginner Strokes Workshop",
    category: "Clinic",
    date: "2026-07-14",
    time: "18:30",
    location: "Court 4, Backboard Wall",
    capacity: 12,
    description:
      "Forehand, backhand, and serve basics with a coach watching your form. Loaner racquets available at check-in.",
    joined: ["AS", "TK", "MR", "JL", "NP", "KO", "BD", "FH", "QW", "CT"],
  },
  {
    id: "3",
    title: "Doubles Mixer Night",
    category: "Doubles",
    date: "2026-07-18",
    time: "19:00",
    location: "Courts 5–8, Under the Lights",
    capacity: 40,
    description:
      "Rotating partners every set so you play with someone new each round. Drinks and snacks at the net after.",
    joined: ["AS", "TK"],
  },
  {
    id: "4",
    title: "Summer Singles Ladder — Round 3",
    category: "Singles ladder",
    date: "2026-07-20",
    time: "06:30",
    location: "Court 2, Center Stadium",
    capacity: 16,
    description:
      "Best two of three sets, self-scored. Report your result in the app and your ranking updates by Monday.",
    joined: ["AS", "TK", "MR", "JL", "NP", "KO", "BD", "FH", "QW", "CT", "ZN", "PL"],
  },
  {
    id: "5",
    title: "Junior Future Stars Camp",
    category: "Junior",
    date: "2026-07-22",
    time: "16:00",
    location: "Court 9–10, Junior Courts",
    capacity: 20,
    description:
      "Ages 8–12. Mini-tennis games, agility ladders, and a short match at the end. Parents welcome to watch courtside.",
    joined: ["DR", "EV", "SW"],
  },
];

// Event ids the sample participant has already joined, used to seed context state
export const sampleJoinedIds: string[] = ["2", "4"];
