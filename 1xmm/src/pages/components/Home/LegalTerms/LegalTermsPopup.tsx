import { Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, FormControlLabel, Button } from '@mui/material';
import React, { useState } from 'react';
import LegalTerms from './LegalTerms';

export type LegalTermProps = {
    checkValidation: (v: boolean) => void;
}

const LegalTermPopup: React.FC<LegalTermProps> = ({checkValidation}) => {
    const [isValidated, setValidation] = useState(false);

    const handleCheck = () => {
        if (isValidated) setValidation(false);
        else setValidation(true);
    }

    return (
        <div className="bg-[#32363C] rounded-xl mt-2">
            <Dialog open={true} fullWidth>
                <DialogTitle>1xMM Telegram Mini-App – Terms of Use</DialogTitle>
                <DialogContent>
                    {LegalTerms()}
                </DialogContent>
                <DialogActions>
                        <FormControlLabel control={<Checkbox checked={isValidated} onChange={() => handleCheck()} />} label={'I agree with all the above Terms and Conditions'} /> 
                        <Button onClick={() => checkValidation(isValidated)} color="primary">
                            Submit
                        </Button>
                    </DialogActions>
            </Dialog>
        </div>
    );
};

export default LegalTermPopup;