export type CountDownValues = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export class DateCountDown {
    public isInactive: boolean;
    private end: number;
    private listeners: Map<string, Array<Function>>;
    private remaining_time: CountDownValues|undefined;

    constructor(date: number) {
        this.isInactive = false;
        this.end = date;
        this.listeners = new Map();
        this.listeners.set("expired", []);
    };

    public toString(): string {
        this.getRemainingTime();

        if (!this.remaining_time) return "";
        let output = "";
        if (this.remaining_time.days > 0) output += `${this.remaining_time.days}d:`;
        output += `${this.remaining_time.hours}h:${this.remaining_time.minutes}m:${this.remaining_time.seconds}s`;
        return output;
    }

    onExpire(listener: () => void): void {
        this.listeners.get("expired")?.push(listener);
    }

    private getRemainingTime() {
        if (this.isInactive) return;

        const now = new Date().getTime() * 0.001;
        let t = this.end - now;

        if (t <= 1) {
            this.listeners.get("expired")?.forEach(listener => listener());
            this.isInactive = true;
            
            this.remaining_time = {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0
            };
        }
        else {
            const days = Math.floor(t / 86_400);
            t -= days * 86_400;
            const hours = Math.floor(t / 3_600);
            t -= hours * 3_600
            const minutes = Math.floor(t / 60);
            t -= minutes * 60;
            const seconds = Math.floor(t);

            this.remaining_time = {
                days: days,
                hours: hours,
                minutes: minutes,
                seconds: seconds
            };
        }
    }
}