import { Checkbox, List, ListItem, ListItemText, TextField } from '@mui/material';
import Drawer from './ui/drawer';
import { useState } from 'react';
import { CryptoList } from '@/referential/cryptoChecklist';
import { Button } from './ui/button';
import { $http } from '@/lib/http';

interface DetailBonusProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function WalletConnector({
    open,
    onOpenChange,
    ...props
}: DetailBonusProps) {
    const [selectedItem, setSelectedItem] = useState<number | ''>(userProfile.selected_crypto);
    const [walletAddress, setWalletAddress] = useState<string | ''>(userProfile.wallet_address);

    const handleToggle = (index: any) => {
        setSelectedItem(index === selectedItem ? null : index);
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
        <Drawer open={open} onOpenChange={onOpenChange} {...props}>
            <h2 className="text-xl font-medium uppercase p-2 text-center">
                Wallet Connector
            </h2>
            <div className="max-w-sm mx-auto rounded-lg">
                <List>
                    {CryptoList && CryptoList.map((crypto, index) => (
                        <ListItem key={index} onClick={() => handleToggle(crypto.id)} >
                            <ListItemText primary={crypto.name} />
                            <Checkbox
                                className='bg-white'
                                checked={selectedItem === crypto.id}
                                tabIndex={-1}
                                disableRipple
                            />
                        </ListItem>
                    ))}
                </List>

                <TextField
                    fullWidth
                    label="Wallet address"
                    variant="outlined"
                    className="mt-4 bg-white rounded-lg"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                />

                <Button className="rounded flex w-full fw-semibold py-2 space-x-1 bg-[linear-gradient(142.18deg,#5155DA_21.85%,#2B2D74_78.15%)] mt-4" onClick={saveWallet}>
                    <span className="font-normal text-lg">Save</span>
                </Button>
            </div>
        </Drawer>
    );
}
