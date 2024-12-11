export type TradingInfo = {
    balance: number;
    total_pnl: number;  
    perf_from_start_date: number;
    perf_since_last_fixing: number;
    positive_leverage: number;
    capital_protection: number;
    time_reduction: number;
}