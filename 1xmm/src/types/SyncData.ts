import { UserProfile } from "./UserProfile";

export type SyncData = { user: UserProfile } & Record<string, any>;