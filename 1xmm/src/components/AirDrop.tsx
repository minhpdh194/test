import Drawer from './ui/drawer';
import i18next from 'i18next';

interface DetailBonusProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSendAirDrop: () => void;
}

const airdropText: { [key: string]: JSX.Element } = {
    "en": (<div className="flex flex-col justify-start pb-6 overflow-y-auto">
        <p>
            1xMM Tokens will be provided to users based on targets described in the website;
            part of the tokens will be provided for Marketing purposes - linked to ranking -
            while another part will be distributed to mini-game users buying bonuses.
        </p>
        <br/>
        <p>
            Up to 20 million tokens will be offered in exchange of bonuses purchased through the mini-app,
            at a rate of 2 stars per token (or a discount of around 40% compared to sales target price).
            If we try to inform users in real time when bonuses are purchased, to indicate whether
            the limit of 20 million has been reached, we cannot guarantee that users purchasing bonuses
            when around the 20 million limit will receive any 1XMM token in compensation. Nevertheless,
            we will manage case by case basis the edge situation, in the best interest of our users.
            Communication will be sent to users that will be impacted by the situation.
        </p>
        <br/>
        <p>
            Up to 15 million tokens will be distributed based on users' ranking.
            Top 100 users will received a fixed amount of tokens (as indicated in 1xMM website);
            the remaining tokens will be distrtibuted based on the number of users.
        </p>
        <br/>
        <p>
            Terms and Conditions may change in time; we invite users to regularly check our website www.one-xmm.com
        </p>
        </div>),
    "fr": (<div className="flex flex-col justify-start pb-6 overflow-y-auto">
        <p>
            Les tokens 1xMM Tokens seront distribués aux utilisateurs suivant la distribution specifiée sur le site internet;
            les tokens seront distribués sur le compte du marketing - pour le classement des joueurs - et sur le compte de l'allocation
            destinée aux utilisateurs achetant des bonus.
        </p>
        <br/>
        <p>
            Jusqu'à 20 millions de tokens seront distribués en échange de l'achat de bonus via la mini-app,
            à un taux de 2 étoiles Telegram pour 1 token (soit un rabais de 40% par rapport à l'objectif de prix de vente public).
            Si nous essayons d'informer les utilisateurs en temps réel quant à la quantité d'étoiles déjà allouées, afin 
            d'indiquer si la limite des 20 millions de tokens a été atteinte, nous ne pouvons malheureusement pas garantir 
            l'exactitude de l'information temps réelle et si les utilisateurs pourront obtenir des tokens lorsque la jauge 
            sera aux alentours de la limte des 20 millions. Néanmoins, nous verrons les situations limites aux cas par cas, 
            afin de ne léser aucun utilisateurs. Nous communiquerons avec les utilisateurs qui seront impactés par la situation.
        </p>
        <br/>
        <p>
            Jusqu'à 15 millions de tokens seront distribués aux utilisateurs suivant leur classement. Les 100 premiers utilisateurs
            recevront un montant fixe de tokens 1XMM (comme indiqué sur notre site internet); les tokens restants seront distribués 
            suivant le nombre d'utilisateurs.
        </p>
        <br/>
        <p>
            Les Termes & Conditions pourront etre mis à jour; nous invitons les utilisateur à consulter regulièrement le site internet:
            www.one-xmm.com
        </p>
        </div>),
    "es": (<div className="flex flex-col justify-start pb-6 overflow-y-auto">
        <p>
            Los tokens 1xMM serán distribuidos a los usuarios según la distribución especificada en el sitio web;
            los tokens se distribuirán en la cuenta de marketing - para la clasificación de jugadores - y en la cuenta de asignación
            destinada a los usuarios que compren bonos.
        </p>
        <br/>
        <p>
            Hasta 20 millones de tokens serán distribuidos a cambio de la compra de bonos a través de la mini-app,
            a una tasa de 2 estrellas de Telegram por 1 token (lo que representa un descuento del 40% en comparación con el objetivo de precio de venta pública).
            Aunque intentamos informar a los usuarios en tiempo real sobre la cantidad de estrellas ya asignadas, para 
            indicar si se ha alcanzado el límite de 20 millones de tokens, lamentablemente no podemos garantizar 
            la precisión de la información en tiempo real ni asegurar que los usuarios podrán obtener tokens cuando el contador 
            esté cerca del límite de los 20 millones. No obstante, evaluaremos los casos límite individualmente, 
            para no perjudicar a ningún usuario. Nos comunicaremos con los usuarios que se vean afectados por esta situación.
        </p>
        <br/>
        <p>
            Hasta 15 millones de tokens serán distribuidos a los usuarios según su clasificación. Los 100 primeros usuarios
            recibirán una cantidad fija de tokens 1XMM (como se indica en nuestro sitio web); los tokens restantes serán distribuidos 
            según el número total de usuarios.
        </p>
        <br/>
        <p>
            Los Términos y Condiciones podrán actualizarse; invitamos a los usuarios a consultar regularmente el sitio web:
            www.one-xmm.com
        </p>
        </div>)
};

export default function AirDrop({
    open,
    onOpenChange,
    onSendAirDrop,
    ...props
}: DetailBonusProps) {    
    return (
        <Drawer open={open} onOpenChange={onOpenChange} {...props}>
            <h2 className="text-xl font-medium uppercase p-2 text-center">
                Air Drop
            </h2>
            {airdropText[i18next.language]}
        </Drawer>
    );
}
