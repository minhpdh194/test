import { ReferralTaskDefinition } from "@/types/tasks/ReferralTaskDefinition";

export const referralTasks: Array<ReferralTaskDefinition> = [
    createReferralTask(1, 'Invite 3 friends', 3, 25_000),
    createReferralTask(2, 'Invite 6 friends', 6, 50_000),
    createReferralTask(3, 'Invite 10 friends', 10, 100_000),
    createReferralTask(4, 'Invite 20 friends', 25, 250_000),
    createReferralTask(5, 'Invite 50 friends', 50, 500_000),
    createReferralTask(6, 'Invite 100 friends', 100, 1_000_000),
];

function createReferralTask(id: number, title: string, number_of_referrals: number, reward: number): ReferralTaskDefinition {
    let refTask: ReferralTaskDefinition = {
        id: id,
        title: title,
        number_of_referrals: number_of_referrals,
        reward: reward
    };

    return refTask;
}