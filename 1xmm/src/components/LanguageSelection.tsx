import { Checkbox, List, ListItem, ListItemText } from '@mui/material';
import Drawer from './ui/drawer';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { LanguageOption } from '@/types/LanguageOption';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

interface DetailBonusProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function LanguageSelection({
    open,
    onOpenChange,
    ...props
}: DetailBonusProps) {
    const languageOptions: LanguageOption[] = [
        {
            language: "English",
            code: "en",
        },
        { language: "French", code: "fr" },
        { language: "German", code: "de" },
        { language: "Spanish", code: "es" },
        { language: "Arabic", code: "ar" },
        { language: "Yoruba", code: "yo" },
        { language: "Tiếng việt", code: "vn" },
    ];

    const [selectedLanguage, setSelectedLanguage] = useState<string>(i18next.language);
    const { i18n } = useTranslation();

    useEffect(() => {
        document.body.dir = i18n.dir(); //sets the body to ltr or rtl
    }, [i18n, i18n.language]);

    const handleToggle = (languageCode: any) => {
        setSelectedLanguage(languageCode);
    };

    const saveLanguage = () => {
        i18next.changeLanguage(selectedLanguage);
        onOpenChange(false);
    }
    return (
        <Drawer open={open} onOpenChange={onOpenChange} {...props}>
            <h2 className="text-xl font-medium uppercase p-2 text-center">
                Language Selection
            </h2>
            <div className="max-w-sm mx-auto rounded-lg">
                <List>
                    {languageOptions && languageOptions.map((language, index) => (
                        <ListItem key={index} onClick={() => handleToggle(language.code)} >
                            <ListItemText primary={language.language} />
                            <Checkbox
                                className='bg-white'
                                checked={selectedLanguage === language.code}
                                tabIndex={-1}
                                disableRipple
                            />
                        </ListItem>
                    ))}
                </List>

                <Button className="rounded flex w-full fw-semibold py-2 space-x-1 bg-[linear-gradient(142.18deg,#5155DA_21.85%,#2B2D74_78.15%)] mt-4" onClick={saveLanguage}>
                    <span className="font-normal text-lg">Save</span>
                </Button>
            </div>
        </Drawer>
    );
}
