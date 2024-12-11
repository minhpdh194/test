import React from 'react';

const ListFriend: React.FC<any> = ({ referedUser }) => {
    const date = new Date(referedUser.created_at);
    const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;

    return referedUser && (
        <div className="flex justify-between items-center pb-2 pt-3" style={{ borderBottom: `.3px solid #FFFFFF33` }}>
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
                        {formattedDate}
                    </p>
                </div>
            </div>
            <div className="flex justify-center items-center space-x-1">
                <img
                    src="/images/friends/accept.png"
                    alt="coin"
                    className="h-4 w-4"
                />
                <span className="text-sm text-[#46FF00]">Accept</span>
            </div>
        </div>
    );
};

export default ListFriend;
