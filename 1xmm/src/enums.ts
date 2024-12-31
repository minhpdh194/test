export enum Leverages {
  One = 1,
  Two = 2,
  Three = 3,
  Five = 5,
  Six = 6,
  Eight = 8,
  Ten = 10,
  Fifteen = 15,
  Twenty = 20
}

export enum LongShort {
  Long = "long",
  Short = "short"
}

export enum BonusTypes {
  Leverage = "Leverage",
  PositiveLeverage = "PositiveLeverage",
  CapitalProtection = "CapitalProtection",
  TimeReduction = "TimeReduction",
  Friends = "Friends"
}


// Bonus terms are in seconds
export enum BonusTerms {
  None = -1,
  Short = 10800,
  Long = 21600
}