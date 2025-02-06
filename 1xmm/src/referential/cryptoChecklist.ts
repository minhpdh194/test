import { CryptoChecklist } from "@/types/CryptoChecklist";

export const CryptoList: Array<CryptoChecklist> = [
    createCryptoItem(1, "Ethereum"),
    createCryptoItem(2, "Solana"),
    createCryptoItem(3, "BSC"),
    createCryptoItem(4, "Arbitrum"),
    createCryptoItem(5, "Polygon"),
];

function createCryptoItem(id: number, name: string): CryptoChecklist {
    const item: CryptoChecklist = {
        id: id,
        name: name
    };

    return item;
}