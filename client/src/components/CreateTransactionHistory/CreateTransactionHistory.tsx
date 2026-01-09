import { Box, Button, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import './createTransactionHistory.css'
import { useState } from 'react';
import { api } from '../../api/api';

export default function CreateTransactionHistory() {
    const [open, setOpen] = useState(false);
    const [pair, setPair] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [type, setType] = useState<'long' | 'short' | null>(null);
    const [entryPrice, setEntryPrice] = useState<string>('');
    const [exitPrice, setExitPrice] = useState<string>('');
    const [leverage, setLeverage] = useState<number | ''>('');
    const [tradeResult, setTradeResult] = useState<string>('');

    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const sessionUserId = sessionStorage.getItem('userId');

    const isFormValid = type && amount && pair && entryPrice && exitPrice && leverage && tradeResult; //TODO: validation to improve

    const handleCreateCryptoTransaction = async () => {
        try {
            const response = await api(`http://localhost:3000/user/${sessionUserId}/add_trade_transaction`, {
                method: 'POST',
                body: JSON.stringify({
                    cryptoAmount: amount,
                    cryptoType: type,
                    cryptoPair: pair,
                    entryPrice,
                    exitPrice,
                    leverage,
                    tradeResult,
                })
            })
            const data = await response.json();

            if (response.ok) {
                setNotification({ message: data.message || 'Crypto transaction was successfully created!', type: 'success' })
                setAmount('');
                setType(null);
                setPair('');
                setEntryPrice('');
                setExitPrice('');
                setLeverage('');
                setTradeResult('');
                setTimeout(() => {
                    setNotification(null);
                    setOpen(false);
                }, 1500)
            }
        }
        catch (error) {
            setNotification({ message: 'Crypto transaction is not created', type: 'error' })
            console.error('Error: ', error)
        }
    }

    return (
        <div className='trading_button_wrapper'>
            {notification && (
                <div className={`goal_notification ${notification.type} animate crypto_notification`}>
                    {notification.message}
                </div>
            )}
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
                        type='number'
                        label="Amount"
                        name='amount'
                        value={amount}
                        className="main_textfield"
                        fullWidth
                        onChange={(e) => setAmount(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Typography sx={{ color: 'white', fontWeight: 700 }}>$</Typography>
                                </InputAdornment>
                            ),
                        }}
                    />

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

                    <FormControl fullWidth className='main_textfield'>
                        <InputLabel className="leverage_label">Leverage</InputLabel>
                        <Select
                            className="main_textfield"
                            value={leverage}
                            label="Leverage"
                            onChange={(e) => setLeverage(Number(e.target.value))}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: '12px',
                                        color: '#fff',
                                    },
                                },
                            }}
                        >
                            <MenuItem value={1}>1x</MenuItem>
                            <MenuItem value={2}>2x</MenuItem>
                            <MenuItem value={5}>5x</MenuItem>
                            <MenuItem value={10}>10x</MenuItem>
                            <MenuItem value={20}>20x</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        type='number'
                        label="Trade result"
                        name='result'
                        value={tradeResult}
                        className="main_textfield"
                        fullWidth
                        onChange={(e) => setTradeResult(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Typography sx={{ color: 'white', fontWeight: 700 }}>$</Typography>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button className='add_transaction_btn' disabled={!isFormValid} onClick={handleCreateCryptoTransaction}>ADD</Button>
                </Box>
            )}
        </div>
    )
}
