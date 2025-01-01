import GooglePayButton from "@google-pay/button-react";
import Drawer from "../../../components/ui/drawer";
import { TonConnectButton } from "@tonconnect/ui-react";

interface WalletListProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    //onBuySuccess: any;
}

export default function WalletList({
    open,
    onOpenChange,
    //onBuySuccess,
    ...props
}: WalletListProps) {
    const gatewayMerchantId = import.meta.env.VITE_GATEWAY_MERCHANT_ID;
    const merchantId = import.meta.env.VITE_MERCHANT_ID;

    return (
        <Drawer open={open} onOpenChange={onOpenChange} {...props}>
            <div className="flex flex-col justify-start items-center gap-4 pb-6 overflow-y-auto">
                <GooglePayButton
                    environment="TEST"
                    paymentRequest={{
                        apiVersion: 2,
                        apiVersionMinor: 0,
                        allowedPaymentMethods: [
                            {
                                type: 'CARD',
                                parameters: {
                                    allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                                    allowedCardNetworks: ['MASTERCARD', 'VISA'],
                                },
                                tokenizationSpecification: {
                                    type: 'PAYMENT_GATEWAY',
                                    parameters: {
                                        gateway: 'example',
                                        gatewayMerchantId: gatewayMerchantId,
                                    },
                                },
                            },
                        ],
                        merchantInfo: {
                            merchantId: merchantId,
                            merchantName: 'Demo Merchant',
                        },
                        transactionInfo: {
                            totalPriceStatus: 'FINAL',
                            totalPriceLabel: 'Total',
                            totalPrice: '100.00',
                            currencyCode: 'USD',
                            countryCode: 'US',
                        }
                    }}
                    onLoadPaymentData={(paymentRequest: any) => {
                        console.log('Load payment data:', paymentRequest);
                    }}
                    onError={(error) => {
                        console.error('Google Pay Error:', error);
                    }}
                />

                <TonConnectButton />
            </div>

        </Drawer>
    );
}
