import Drawer from './ui/drawer';

interface DetailBonusProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSendAirDrop: () => void;
}

export default function AirDrop({
    open,
    onOpenChange,
    onSendAirDrop,
    ...props
}: DetailBonusProps) {
    console.log(onSendAirDrop);
    
    return (
        <Drawer open={open} onOpenChange={onOpenChange} {...props}>
            <h2 className="text-xl font-medium uppercase p-2 text-center">
                Air Drop
            </h2>
            <div className="flex flex-col justify-start pb-6 overflow-y-auto">
                <p>
                    1xMM Tokens will be provided to users based on targets described in the website;
                    part of the tokens will be provided for Marketing purposes and another part will
                    be distributed to mini-game users. 1XMM tokens will be issued on different blokchains;
                </p>
                <br />
                <p>
                    Up to 2 million tokens will be offered in exchange of bonuses purchased through the mini-app,
                    at a rate of US$0.30 per token (or a discount of 40% compared to sales target price).
                    If we try to inform users in real time when bonuses are purchased, to indicate whether
                    the limit of 2 million has been reached, we cannot guarantee that users purchasing bonuses
                    when around the 2 million limit will receive any 1XMM token in compensation. Nevertheless,
                    we will manage case by case basis the edge situation, in the best interest of our users.
                    Communication will be sent to users that will be impacted by the situation.
                </p>
                <br />
                <p>
                    Up to 2 million tokens will be distributed based on users' ranking.
                    Top 100 users will received a fixed amount of tokens (as indicated in 1xMM website);
                    the remaining tokens will be distrtibuted based on the number of users.
                </p>
                <br />
                <p>
                    Terms and Conditions can change at any time, we invite users to regularly check our website: <a href="www.one-xmm.com">1xmm</a>
                </p>
            </div>
            <div />
            {/* <Button className="rounded flex w-full fw-semibold py-2 space-x-1 bg-[linear-gradient(142.18deg,#5155DA_21.85%,#2B2D74_78.15%)]" onClick={onSendAirDrop}>
                <span className="font-normal text-lg">Send</span>
            </Button> */}
        </Drawer>
    );
}
