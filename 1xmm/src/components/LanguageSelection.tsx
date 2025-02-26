import { Drawer, FormControl, MenuItem, Select } from '@mui/material';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { LanguageOption } from '@/types/LanguageOption';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { popup } from '@/referential/i18nPrefixes';

interface DetailBonusProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function LanguageSelection({
    open,
    onOpenChange,
    ...props
}: DetailBonusProps) {
    const { t } = useTranslation();
    const languageOptions: LanguageOption[] = [
        { language: "English", code: "en" },
        { language: "French", code: "fr" },
        { language: "Spanish", code: "es" },
    ];

    const [selectedLanguage, setSelectedLanguage] = useState<string>(i18next.language);
    const { i18n } = useTranslation();

    useEffect(() => {
        document.body.dir = i18n.dir(); //sets the body to ltr or rtl
    }, [i18n, i18n.language]);

    const handleToggle = (e: any) => {
        const languageCode = e.target.value as string;
        setSelectedLanguage(languageCode);
    };

    const saveLanguage = () => {
        i18next.changeLanguage(selectedLanguage);
        onOpenChange(false);
    }

    return (
        <Drawer anchor="bottom" open={open} onClose={() => onOpenChange(false)} {...props}>
            <div className='min-h-[65vh] bg-black flex flex-col justify-between p-4'>
                <div>
                    <h2 className="text-xl text-white font-medium uppercase p-2 text-center">
                        {t(`${popup}.language_selection.header`)}
                    </h2>
                    <FormControl fullWidth className='bg-white'>
                        <Select
                            value={selectedLanguage}
                            onChange={(e) => handleToggle(e)}
                        >
                            {languageOptions?.map((language) => (
                                <MenuItem key={language.code} value={language.code} className='text-black'>
                                    {language.language}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

                <div className="max-w-sm mx-auto rounded-lg w-full">
                    <Button
                        className="rounded flex w-full fw-semibold py-2 space-x-1 bg-[linear-gradient(142.18deg,#5155DA_21.85%,#2B2D74_78.15%)] mt-4"
                        onClick={saveLanguage}
                    >
                        <span className="font-normal text-lg">{t(`${popup}.language_selection.button`)}</span>
                    </Button>
                </div>
            </div>
        </Drawer>
    );
}
