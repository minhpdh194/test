import { Drawer, FormControl, FormLabel, MenuItem, Select, TextField } from '@mui/material';
import { useState } from 'react';
import { CryptoList } from '@/referential/cryptoChecklist';
import { Button } from './ui/button';
import { $http } from '@/lib/http';
import { useTranslation } from 'react-i18next';
import { menu } from '@/referential/i18nPrefixes';

interface DetailBonusProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function WalletConnector({
    open,
    onOpenChange,
    ...props
}: DetailBonusProps) {
    const [selectedItem, setSelectedItem] = useState<number>(userProfile.selected_crypto ? userProfile.selected_crypto : 1);
    const [walletAddress, setWalletAddress] = useState<string | ''>(userProfile.wallet_address);

    const { t } = useTranslation();

    const handleToggle = (e: any) => {
        const index = e.target.value as number;
        setSelectedItem(index === selectedItem ? -1 : index);
    };

    const saveWallet = async () => {
        if (selectedItem && walletAddress) {
            const response = await $http.post('/save-user-wallet-info', {
                crypto_id: selectedItem,
                wallet_address: walletAddress
            });
            if (response) {
                userProfile.UpdateUserWallet(selectedItem, walletAddress);
                onOpenChange(false);
            }
        }
    }

    return (
        <Drawer anchor="bottom" open={open} onClose={() => onOpenChange(false)} {...props}>
            <div className='min-h-[65vh] bg-black flex flex-col justify-between p-4'>
                <div className='w-full'>
                    <h2 className="text-xl font-medium uppercase p-2 text-center text-white">
                        {t(`${menu}.wallet_connector.title`)}
                    </h2>
                    <div className="rounded-lg">
                        <FormLabel className='text-white text-sm'>{t(`${menu}.wallet_connector.label_wallet_address`)}</FormLabel>
                        <TextField
                            fullWidth
                            variant="outlined"
                            className="mb-4 bg-white rounded-lg"
                            value={walletAddress}
                            onChange={(e) => setWalletAddress(e.target.value)}
                        />

                        <FormLabel className='text-white text-sm'>{t(`${menu}.wallet_connector.label_network`)}</FormLabel>
                        <FormControl fullWidth className='bg-white'>
                            <Select
                                value={selectedItem}
                                onChange={(e) => handleToggle(e)}
                            >
                                {CryptoList?.map((crypto) => (
                                    <MenuItem key={crypto.id} value={crypto.id} className='text-black'>
                                        {crypto.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                </div>

                <Button className="rounded flex w-full fw-semibold py-2 space-x-1 bg-[linear-gradient(142.18deg,#5155DA_21.85%,#2B2D74_78.15%)] mt-4" onClick={saveWallet}>
                    <span className="font-normal text-lg">{t(`${menu}.wallet_connector.save`)}</span>
                </Button>
            </div>
        </Drawer>
    );
}
