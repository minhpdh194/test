import { useTranslation } from 'react-i18next';
import { home } from '@/referential/i18nPrefixes';

const GoBox: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="mt-3">
            <div className="bg-[#68bd87] bg-opacity-70 rounded-xl mb-3">
                    <div className="pt-3 pb-3 space-y-2 text-center text-gray-100 font-bold">
                        {t(`${home}.lets_go`)}
                    </div>
                </div>
        </div>
    );
}

export default GoBox;