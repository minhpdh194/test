import { TaskActionNames } from "@/enums";
import { TaskDefinition } from "@/types/tasks/TaskDefinition";

const tasksList = [
  {
    name: "Watch 1xMM Video",
    description: "Watch our introduction video on YouTube.",
    reward_coins: 25_000,
    link: "https://www.youtube.com/watch?v=__pIIOcmDNM",
    type: "life_time",
    action_name: TaskActionNames.Watch1XMMVideo,
    complete_requirement: 0,
  },
  {
    name: "Follow us on Twitter",
    description:
      "Follow our official Twitter account and retweet our pinned tweet.",
    reward_coins: 20_000,
    link: "https://x.com/onexmm_official",
    type: "life_time",
    action_name: TaskActionNames.JoinX,
    complete_requirement: "", //can be used later
  },
  {
    name: "Join our Telegram Group",
    description: "Join our Telegram group and introduce yourself.",
    reward_coins: 20_000,
    link: "https://t.me/onexmm_official",
    type: "life_time",
    action_name: TaskActionNames.JoinTelegram,
    complete_requirement: "", //can be used later
  },
  {
    name: "Invite your friends",
    description: "Invite 5 users and you will be rewarded",
    reward_coins: 50_000,
    link: "",
    type: "life_time",
    action_name: TaskActionNames.Invite,
    complete_requirement: 5,
  },
  {
    name: "Invite your friends",
    description: "Invite 10 users and you will be rewarded",
    reward_coins: 100_000,
    link: "",
    type: "life_time",
    action_name: TaskActionNames.Invite,
    complete_requirement: 10,
  },
  {
    name: "Invite your friends",
    description: "Invite 25 users and you will be rewarded",
    reward_coins: 300_000,
    link: "",
    type: "life_time",
    action_name: TaskActionNames.Invite,
    complete_requirement: 25,
  },
  {
    name: "Invite your friends",
    description: "Invite 50 users and you will be rewarded",
    reward_coins: 750_000,
    link: "",
    type: "life_time",
    action_name: TaskActionNames.Invite,
    complete_requirement: 50,
  },
  {
    name: "Invite your friends",
    description: "Invite 100 users and you will be rewarded",
    reward_coins: 2_000_000,
    link: "",
    type: "life_time",
    action_name: TaskActionNames.Invite,
    complete_requirement: 100,
  },
  {
    name: "Invite your friends",
    description: "Invite 250 users and you will be rewarded",
    reward_coins: 7_500_000,
    link: "",
    type: "life_time",
    action_name: TaskActionNames.Invite,
    complete_requirement: 250,
  },
  {
    name: "Invite your friends",
    description: "Invite 500 users and you will be rewarded",
    reward_coins: 20_000_000,
    link: "",
    type: "life_time",
    action_name: TaskActionNames.Invite,
    complete_requirement: 500,
  },
  {
    name: "Invite your friends",
    description: "Invite 1000 users and you will be rewarded",
    reward_coins: 50_000_000,
    link: "",
    type: "life_time",
    action_name: TaskActionNames.Invite,
    complete_requirement: 1000,
  },
];

export const getAllTasks: Array<TaskDefinition> = tasksList.map((task, index) => {
  return {
    id: index + 1,
    name: task.name,
    description: task.description,
    reward_coins: task.reward_coins,
    link: task.link,
    type: task.type,
    action_name: task.action_name,
    complete_requirement: task.complete_requirement,
  }
});
