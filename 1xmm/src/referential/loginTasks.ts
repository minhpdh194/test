import { LoginTaskDefinition } from "@/types/tasks/LoginTaskDefinition";

export const loginTasks: Array<LoginTaskDefinition> = [
    createLoginTask(1, 500, 2),
    createLoginTask(2, 1000, 3),
    createLoginTask(3, 2000, 4),
    createLoginTask(4, 3000, 5),
    createLoginTask(5, 5000, 6),
    createLoginTask(6, 7000, 7),
    createLoginTask(7, 10_000, 8),
    createLoginTask(8, 13_000, 9),
    createLoginTask(9, 18_000, 10),
    createLoginTask(10, 23_000, 11),
    createLoginTask(11, 30_000, 12),
    createLoginTask(12, 37_000, 13),
    createLoginTask(13, 47_000, 14),
    createLoginTask(14, 57_000, 15),
    createLoginTask(15, 70_000, 16),
    createLoginTask(20, 85_000, 21),
    createLoginTask(24, 100_000, 25),
    createLoginTask(32, 150_000, 33),
];

function createLoginTask(id: number, reward: number, required_login_streak: number): LoginTaskDefinition {
    let loginTask: LoginTaskDefinition = {
        id: id,
        name: 'Streak ${id}',
        reward: reward,
        required_login_streak: required_login_streak
    };

    return loginTask;
}