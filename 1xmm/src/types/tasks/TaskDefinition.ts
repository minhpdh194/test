export type TaskDefinition = {
    id: number,
    name: string,
    description: string,
    type: string;
    link: string;
    image?: string;
    reward: number;
    action_name: string;
}