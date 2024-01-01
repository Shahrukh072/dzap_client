import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FormControl, InputLabel, Select, MenuItem, TextField, Button, Typography, Grid } from '@mui/material';


const Converter = () => {
  const [sourceCrypto, setSourceCrypto] = useState('');
  const [targetCurrency, setTargetCurrency] = useState('usd');
  const [amount, setAmount] = useState(0);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [cryptoList, setCryptoList] = useState([]);
  const [error, setError] = useState('');

  // Fetch the list of cryptocurrencies from the backend
  useEffect(() => {
    const fetchCryptoList = async () => {
      try {
        const response = await axios.get('https://tiny-blue-lion-hose.cyclic.app/cryptocurrencies');
        setCryptoList(response.data);
        setSourceCrypto(response.data[0]?.id); 
      } catch (error) {
        setError('Error fetching cryptocurrencies');
      }
    };

    fetchCryptoList();
  }, []);

  const handleConvert = async () => {
    try {
      const response = await axios.post('https://tiny-blue-lion-hose.cyclic.app/convert', {
        sourceCrypto,
        amount,
        targetCurrency,
      });
  
      setConvertedAmount(response.data.convertedAmount);
      setError('');
    } catch (error) {
      setConvertedAmount(0);
      setError('Error converting currency');
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Crypto Currency Converter
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Select Source Cryptocurrency</InputLabel>
          <Select value={sourceCrypto} onChange={(e) => setSourceCrypto(e.target.value)}>
            {cryptoList.map((crypto) => (
              <MenuItem key={crypto.id} value={crypto.id}>
                {crypto.name} ({crypto.symbol.toUpperCase()})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          type="number"
          label="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Select Target Currency</InputLabel>
          <Select value={targetCurrency} onChange={(e) => setTargetCurrency(e.target.value)}>
            <MenuItem value="usd">USD</MenuItem>
            <MenuItem value="eur">EUR</MenuItem>
            <MenuItem value="inr">INR</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleConvert}>
          Convert
        </Button>
      </Grid>
      {error && (
        <Grid item xs={12}>
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        </Grid>
      )}
      {convertedAmount > 0 && (
        <Grid item xs={12}>
          <Typography variant="h5">
            Converted Amount: {convertedAmount} {targetCurrency.toUpperCase()}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default Converter;