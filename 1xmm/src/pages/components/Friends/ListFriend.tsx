import { Friend } from '@/types/Friend';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { friends } from '@/referential/i18nPrefixes';

const ListFriend: React.FC<any> = ({ referedUsers }) => {
    const { t } = useTranslation();

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
    const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
        return formattedDate;
    }

    return referedUsers && referedUsers.length > 0 && referedUsers.map((referedUser: Friend) => (
            <div key={referedUser.telegram_user_id} className="flex justify-between items-center pb-2 pt-3" style={{ borderBottom: `.3px solid #FFFFFF33` }}>
            <div className="row flex items-center">
                <div className="col-4">
                    <div className="bg-white rounded w-10 h-10">
                    </div>
                </div>
                <div className="col-8">
                    <p className="text-sm font-bold">
                        {referedUser.first_name} {referedUser.last_name}
                    </p>
                    <p className="text-xs font-light flex items-center mt-1">
                            {formatDate(referedUser.created_at)}
                    </p>
                </div>
            </div>
            <div className="flex justify-center items-center space-x-1">
                <img
                    src="/images/friends/accept.png"
                    alt="coin"
                    className="h-4 w-4"
                />
                <span className="text-sm text-[#46FF00]">{t(`${friends}.accepted`)}</span>
            </div>
        </div>
        )
    );
};

export default ListFriend;
