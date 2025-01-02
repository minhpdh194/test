export type CountDownValues = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export class DateCountDown {
    private listeners: Map<string, Array<Function>>;
    private remaining_time: CountDownValues|undefined;

    constructor(date: number) {

        this.startCountDown(date);
        this.listeners = new Map();
        this.listeners.set("countDown", []);
        this.listeners.set("expired", []);
    };

    public toString(): string {
        if (!this.remaining_time) return "";
        let output = "";
        if (this.remaining_time.days > 0) output += `${this.remaining_time.days}d:`;
        output += `${this.remaining_time.hours}h:${this.remaining_time.minutes}m:${this.remaining_time.seconds}s`
        return output;
    }

    on(eventName: "expired", listener: () => void): void;
    on(eventName: string, listener: Function) {
        this.listeners.get(eventName)?.push(listener);
    }

    private startCountDown(end: number) {
        const timer = setInterval(() => {
            const now = new Date().getTime() * 0.001;
            let t = end - now;
        
            const days = Math.floor(t / 86_400);
            t -= days * 86_400;
            const hours = Math.floor(t / 3_600);
            t -= hours * 3_600
            const minutes = Math.floor(t / 60);
            t -= minutes * 60;
            const seconds = Math.floor(t);

            if (t <= 0) {
                clearInterval(timer);
                this.listeners.get("expired")?.forEach(listener => listener());
                return;
            }

            this.remaining_time = {
                days: days,
                hours: hours,
                minutes: minutes,
                seconds: seconds
            };
        }, 1000);
    }
}