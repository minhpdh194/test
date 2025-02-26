import { TaskActionNames } from "@/enums";

export type TaskDefinition = {
  id: number;
  name: string;
  name_fr?: string;
  name_es?: string;
  description: string;
  description_fr?: string;
  description_es?: string;
  reward_coins: number;
  link: string;
  type: string;
  action_name: TaskActionNames;
  complete_requirement: any;
};
