export class UserRanking {
  telegram_user_id: string = "";
  first_name: string = "";
  last_name: string = "";
  amount_of_tokens: number = 0;

  public constructor(telegram_user_id: string, first_name: string, last_name: string, amount_of_tokens: number) {
    this.telegram_user_id = telegram_user_id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.amount_of_tokens = amount_of_tokens;
  }
}
