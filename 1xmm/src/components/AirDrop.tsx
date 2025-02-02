import { Button } from '@/components/ui/button';
import Drawer from './ui/drawer';

interface DetailBonusProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function AirDrop({
    open,
    onOpenChange,
    ...props
}: DetailBonusProps) {
    return (
        <Drawer open={open} onOpenChange={onOpenChange} {...props}>
            <h2 className="text-xl font-medium uppercase p-2 text-center">
                Air Drop
            </h2>
            <div className="flex flex-col justify-start pb-6 overflow-y-auto">
                1xMM Tokens will be provided to users based on targets described in the website; 
                part of the tokens will be provided for Marketing purposes and another part will 
                be distributed to mini-game users. 1XMM tokens will be issued on different blokchains; 
           </div>
            <div />
            <Button className="rounded flex w-full fw-semibold py-2 space-x-1 bg-[linear-gradient(142.18deg,#5155DA_21.85%,#2B2D74_78.15%)]">
                <span className="font-normal text-lg">Send</span>
            </Button>
        </Drawer>
    );
}
