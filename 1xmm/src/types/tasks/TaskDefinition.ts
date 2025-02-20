import { TaskActionNames } from "@/enums";

export type TaskDefinition = {
  id: number;
  name: string;
  description: string;
  reward_coins: number;
  link: string;
  type: string;
  action_name: TaskActionNames;
  complete_requirement: any;
};
