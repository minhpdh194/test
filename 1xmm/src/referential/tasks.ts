import { TaskDefinition } from "@/types/tasks/TaskDefinition";

const tasksList = [
  {
    name: "Watch Tutorial Video",
    description: "Watch our game tutorial video on YouTube.",
    reward_coins: 100,
    link: "https://www.youtube.com/watch?v=ytdLaA4uN38",
    type: "daily",
    action_name: "watch_video",
    complete_requirement: "", //can be used later
  },
  {
    name: "Follow on Twitter",
    description:
      "Follow our official Twitter account and retweet our pinned tweet.",
    reward_coins: 150,
    link: "https://x.com/onexmm_official",
    type: "life_time",
    action_name: "join",
    complete_requirement: "", //can be used later
  },
  {
    name: "Join Telegram Group",
    description: "Join our Telegram group and introduce yourself.",
    reward_coins: 175,
    link: "https://t.me/onexmm_official",
    type: "life_time",
    action_name: "join",
    complete_requirement: "", //can be used later
  },
  {
    name: "Join Our Discord",
    description:
      "Join our official Discord server and say hello in the #welcome channel.",
    reward_coins: 100,
    link: "https://discord.gg/yourgame",
    type: "life_time",
    action_name: "join",
    complete_requirement: "", //can be used later
  },
  {
    name: "Invite your friends",
    description: "Invite 5 users and you will be rewarded",
    reward_coins: 100,
    link: "",
    type: "life_time",
    action_name: "invite",
    complete_requirement: 5,
  },
  {
    name: "Invite your friends",
    description: "Invite 10 users and you will be rewarded",
    reward_coins: 100,
    link: "",
    type: "life_time",
    action_name: "invite",
    complete_requirement: 10,
  },
  {
    name: "Invite your friends",
    description: "Invite 25 users and you will be rewarded",
    reward_coins: 100,
    link: "",
    type: "life_time",
    action_name: "invite",
    complete_requirement: 25,
  },
  {
    name: "Invite your friends",
    description: "Invite 50 users and you will be rewarded",
    reward_coins: 100,
    link: "",
    type: "life_time",
    action_name: "invite",
    complete_requirement: 50,
  },
  {
    name: "Invite your friends",
    description: "Invite 100 users and you will be rewarded",
    reward_coins: 100,
    link: "",
    type: "life_time",
    action_name: "invite",
    complete_requirement: 100,
  },
  {
    name: "Invite your friends",
    description: "Invite 250 users and you will be rewarded",
    reward_coins: 100,
    link: "",
    type: "life_time",
    action_name: "invite",
    complete_requirement: 250,
  },
  {
    name: "Invite your friends",
    description: "Invite 500 users and you will be rewarded",
    reward_coins: 100,
    link: "",
    type: "life_time",
    action_name: "invite",
    complete_requirement: 500,
  },
  {
    name: "Invite your friends",
    description: "Invite 1000 users and you will be rewarded",
    reward_coins: 100,
    link: "",
    type: "life_time",
    action_name: "invite",
    complete_requirement: 1000,
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
    task.action_name,
    task.complete_requirement
  )
);

function createTask(
  id: number,
  name: string,
  description: string,
  reward_coins: number,
  link: string,
  type: string,
  action_name: string,
  complete_requirement: any,
): TaskDefinition {
  return {
    id,
    name,
    description,
    reward_coins,
    link,
    type,
    action_name,
    complete_requirement,
  };
}
