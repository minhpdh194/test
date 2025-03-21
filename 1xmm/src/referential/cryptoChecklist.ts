import { CryptoChecklist } from "@/types/CryptoChecklist";

export const CryptoList: Array<CryptoChecklist> = [
    createCryptoItem(1, "TON"),
    createCryptoItem(2, "Arbitrum"),
    createCryptoItem(3, "BSC"),
    createCryptoItem(4, "Ethereum"),
    createCryptoItem(5, "Polygon"),
    createCryptoItem(6, "Solana"),
];

function createCryptoItem(id: number, name: string): CryptoChecklist {
    const item: CryptoChecklist = {
        id: id,
        name: name
    };

    return item;
}