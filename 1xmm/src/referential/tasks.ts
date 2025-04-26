import { TaskActionNames } from "@/enums";
import { TaskDefinition } from "@/types/tasks/TaskDefinition";

const watch_onexmm_video = ():{[Key: string]: string} => {
  return {
    'en': "Watch 1xMM Video",
    'fr': "Regarder une vidéo 1xMM",
    'es': "Ver video de 1xMM"
  }
};

const follow_us = (channel: string):{ [key: string]: string } => {
  return {
    'fr': `Suivez-nous sur ${channel}`,
    'es': `Síguenos en ${channel}`,
    'en': `Follow us on ${channel}`
  }
};

const invite_friends = ():{ [key: string]: string } => {
  return {
    'fr': "Invitez vos amis",
    'es': "Invita a tus amigos",
    'en': "Invite your friends"
  }
}

const invite_friends_desc = (nb: number):{ [key: string]: string } => {
  return {
    'en' : `Invite ${nb} users and you will be rewarded`,
    'fr' : `Invitez ${nb} utilisateurs et vous serez récompensé`,
    'es' : `Invita a ${nb} usuarios y serás recompensado`
  };
};

type taskDef = {
  name: { [key: string]: string },
  description: { [key: string]: string },
  reward_coins: number,
  link: string,
  type: string,
  action_name: TaskActionNames,
  complete_requirement: number | string,
}

const tasksList: Array<taskDef> = [
  {
    name: watch_onexmm_video(),
    description: { 'en': "Watch our introduction video on YouTube", 'fr': "Regardez notre vidéo d'introduction sur YouTube", 'es': "Mira nuestro video de introducción en YouTube" },
    reward_coins: 25_000,
    link: "https://www.youtube.com/watch?v=SY5H-JB-2x4",
    type: "life_time",
    action_name: TaskActionNames.Watch1XMMVideo,
    complete_requirement: 0,
  },
  {
    name: watch_onexmm_video(),
    description: { 'en': "Understanding Long & Short positions", 'fr': "Comprendre les positions longues et courtes", 'es': "Comprender las posiciones largas y cortas" },
    reward_coins: 25_000,
    link: "https://www.youtube.com/watch?v=kFRWCjByf7s",
    type: "life_time",
    action_name: TaskActionNames.Watch1XMMVideo,
    complete_requirement: 1,
  },
  {
    name: watch_onexmm_video(),
    description: { 'en': "Understanding Interest Rates vs Yields", 'fr': "Comprendre les taux d'intérêt vs les rendements", 'es': "Comprender las tasas de interés vs los rendimientos" },
    reward_coins: 25_000,
    link: "https://www.youtube.com/watch?v=wd3D-Q7kp_g",
    type: "life_time",
    action_name: TaskActionNames.Watch1XMMVideo,
    complete_requirement: 2,
  },
  {
    name: watch_onexmm_video(),
    description: { 'en': "Understanding Prices", 'fr': "Comprendre les prix", 'es': "Comprender los precios" },
    reward_coins: 25_000,
    link: "https://www.youtube.com/watch?v=gwhzYaN_23Q",
    type: "life_time",
    action_name: TaskActionNames.Watch1XMMVideo,
    complete_requirement: 3,
  },
  {
    name: watch_onexmm_video(),
    description: { 'en': "Understanding Inflation", 'fr': "Comprendre l’inflation", 'es': "Comprender la inflación" },
    reward_coins: 25_000,
    link: "https://www.youtube.com/watch?v=FDw677UnudE",
    type: "life_time",
    action_name: TaskActionNames.Watch1XMMVideo,
    complete_requirement: 4,
  },
  {
    name: follow_us('Twitter'),
    description: { 'en': "Follow our official Twitter account and retweet our pinned tweet", 'fr': "Suivez notre compte Twitter officiel et retweetez notre tweet épinglé", 'es': "Sigue nuestra cuenta oficial de Twitter y retuitea nuestro tweet fijado"},
    reward_coins: 20_000,
    link: "https://x.com/onexmm_official",
    type: "life_time",
    action_name: TaskActionNames.JoinX,
    complete_requirement: "", //can be used later
  },
  {
    name: follow_us('Telegram'),
    description: { 'en': "Join our Telegram group and introduce yourself", 'fr': "Rejoignez notre groupe Telegram et présentez-vous", 'es': "Únete a nuestro grupo de Telegram y preséntate" },
    reward_coins: 20_000,
    link: "https://t.me/onexmm_official",
    type: "life_time",
    action_name: TaskActionNames.JoinTelegram,
    complete_requirement: "", //can be used later
  },
  {
    name: invite_friends(),
    description: invite_friends_desc(5),
    reward_coins: 50_000,
    link: "",
    type: "life_time",
    action_name: TaskActionNames.Invite,
    complete_requirement: 5,
  },
  {
    name: invite_friends(),
    description: invite_friends_desc(10),
    reward_coins: 100_000,
    link: "",
    type: "life_time",
    action_name: TaskActionNames.Invite,
    complete_requirement: 10,
  },
  {
    name: invite_friends(),
    description: invite_friends_desc(25),
    reward_coins: 300_000,
    link: "",
    type: "life_time",
    action_name: TaskActionNames.Invite,
    complete_requirement: 25,
  },
  {
    name: invite_friends(),
    description: invite_friends_desc(50),
    reward_coins: 750_000,
    link: "",
    type: "life_time",
    action_name: TaskActionNames.Invite,
    complete_requirement: 50,
  },
  {
    name: invite_friends(),
    description: invite_friends_desc(100),
    reward_coins: 2_000_000,
    link: "",
    type: "life_time",
    action_name: TaskActionNames.Invite,
    complete_requirement: 100,
  },
  {
    name: invite_friends(),
    description: invite_friends_desc(250),
    reward_coins: 7_500_000,
    link: "",
    type: "life_time",
    action_name: TaskActionNames.Invite,
    complete_requirement: 250,
  },
  {
    name: invite_friends(),
    description: invite_friends_desc(500),
    reward_coins: 20_000_000,
    link: "",
    type: "life_time",
    action_name: TaskActionNames.Invite,
    complete_requirement: 500,
  },
  {
    name: invite_friends(),
    description: invite_friends_desc(1000),
    reward_coins: 50_000_000,
    link: "",
    type: "life_time",
    action_name: TaskActionNames.Invite,
    complete_requirement: 1000,
  },
];

export const getAllTasks = (language: string): Array<TaskDefinition> => {
  return tasksList.map((task, index) => {
    return {
      id: index + 1,
      name: task.name[language],
      description: task.description[language],
      reward_coins: task.reward_coins,
      link: task.link,
      type: task.type,
      action_name: task.action_name,
      complete_requirement: task.complete_requirement,
    }
  });
};
