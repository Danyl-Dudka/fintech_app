import { Box, Button, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material'
import './createTransactionHistory.css'
import { useState } from 'react';

export default function CreateTransactionHistory() {
    const [open, setOpen] = useState(false);
    const [pair, setPair] = useState<string>('');
    const [type, setType] = useState<'long' | 'short' | null>(null);
    const [entryPrice, setEntryPrice] = useState<string>('');
    const [exitPrice, setExitPrice] = useState<string>('');

    return (
        <div className='trading_button_wrapper'>
            <Button className='trading_transaction_btn' onClick={() => setOpen(prev => !prev)}>Create trading transaction</Button>
            {open && (
                <Box className="crypto_transaction_form">
                    <ToggleButtonGroup
                        value={type}
                        exclusive
                        onChange={(_, value) => setType(value)}
                    >
                        <ToggleButton value='long' className='long_toggle'>
                            LONG
                        </ToggleButton>

                        <ToggleButton value='short' className='short_toggle'>
                            SHORT
                        </ToggleButton>
                    </ToggleButtonGroup>
                    <TextField
                        label="Pair name"
                        name='pair'
                        value={pair}
                        className="main_textfield"
                        fullWidth
                        onChange={(e) => setPair(e.target.value.toUpperCase())}
                    />

                    <TextField
                        type='number'
                        label="Entry price"
                        name='entry'
                        value={entryPrice}
                        className="main_textfield"
                        fullWidth
                        onChange={(e) => setEntryPrice(e.target.value)}
                    />
                    <TextField
                        type='number'
                        label="Exit price"
                        name='exit'
                        value={exitPrice}
                        className="main_textfield"
                        fullWidth
                        onChange={(e) => setExitPrice(e.target.value)}
                    />
                </Box>
            )}
        </div>
    )
}
