import { TaskDefinition } from "@/types/tasks/TaskDefinition";

const tasksList = [
  {
    name: "Watch Tutorial Video",
    description: "Watch our game tutorial video on YouTube.",
    reward_coins: 100,
    link: "https://youtube.com",
    type: "daily",
    action_name: "watch_video",
  },
  {
    name: "Follow on Twitter",
    description:
      "Follow our official Twitter account and retweet our pinned tweet.",
    reward_coins: 150,
    link: "https://twitter.com/yourgame",
    type: "life_time",
    action_name: "subscribe",
  },
  {
    name: "Like Facebook Page",
    description:
      "Like our Facebook page and leave a comment on our latest post.",
    reward_coins: 100,
    link: "https://facebook.com/yourgame",
    type: "life_time",
    action_name: "subscribe",
  },
  {
    name: "Follow on Instagram",
    description: "Follow our Instagram account and like our most recent post.",
    reward_coins: 125,
    link: "https://instagram.com/yourgame",
    type: "life_time",
    action_name: "subscribe",
  },
  {
    name: "Join Telegram Group",
    description: "Join our Telegram group and introduce yourself.",
    reward_coins: 175,
    link: "https://t.me/yourgame",
    type: "life_time",
    action_name: "join",
  },
  {
    name: "Join Our Discord",
    description:
      "Join our official Discord server and say hello in the #welcome channel.",
    reward_coins: 100,
    link: "https://discord.gg/yourgame",
    type: "life_time",
    action_name: "join",
  },
  {
    name: "Invite your friends",
    description: "Invite 5 users and you will be rewarded",
    reward_coins: 100,
    link: "",
    type: "life_time",
    action_name: "invite",
  },
  {
    name: "Invite your friends",
    description: "Invite 10 users and you will be rewarded",
    reward_coins: 100,
    link: "",
    type: "life_time",
    action_name: "invite",
  },
  {
    name: "Invite your friends",
    description: "Invite 25 users and you will be rewarded",
    reward_coins: 100,
    link: "",
    type: "life_time",
    action_name: "invite",
  },
  {
    name: "Invite your friends",
    description: "Invite 50 users and you will be rewarded",
    reward_coins: 100,
    link: "",
    type: "life_time",
    action_name: "invite",
  },
  {
    name: "Invite your friends",
    description: "Invite 100 users and you will be rewarded",
    reward_coins: 100,
    link: "",
    type: "life_time",
    action_name: "invite",
  },
  {
    name: "Invite your friends",
    description: "Invite 250 users and you will be rewarded",
    reward_coins: 100,
    link: "",
    type: "life_time",
    action_name: "invite",
  },
  {
    name: "Invite your friends",
    description: "Invite 500 users and you will be rewarded",
    reward_coins: 100,
    link: "",
    type: "life_time",
    action_name: "invite",
  },
  {
    name: "Invite your friends",
    description: "Invite 1000 users and you will be rewarded",
    reward_coins: 100,
    link: "",
    type: "life_time",
    action_name: "invite",
  },
];

export const tasks: Array<TaskDefinition> = tasksList.map((task, index) =>
  createTask(
    index + 1,
    task.name,
    task.description,
    task.reward_coins,
    task.link,
    task.type,
    task.action_name
  )
);

function createTask(
  id: number,
  name: string,
  description: string,
  reward_coins: number,
  link: string,
  type: string,
  action_name: string
): TaskDefinition {
  return {
    id,
    name,
    description,
    reward_coins,
    link,
    type,
    action_name,
  };
}
