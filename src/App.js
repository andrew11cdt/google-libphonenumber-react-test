import './App.css';
import { PhoneNumberUtil, PhoneNumberFormat, PhoneNumberType } from 'google-libphonenumber';

import Box from '@mui/material/Box';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { TextareaAutosize, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
const phoneUtil = PhoneNumberUtil.getInstance();
const ValidCodes = PhoneNumberUtil.ValidationResult

const parseResultKey = (key, obj) => Object.keys(obj).find(k => obj[k] === key)
console.log(phoneUtil.isValidNumberForRegion(phoneUtil.parse('202-456-1414', 'US'), 'US'));
function App() {
  const [data, setData] = useState({
    number: "0865343051",
    code: "VN"
  })
  function verifyNumber() {
    try {
      const number = phoneUtil.parseAndKeepRawInput(data.number, data.code)
      if (!number) return
      const validCode = phoneUtil.isPossibleNumberWithReason(number)
      setData(pre => ({
        ...pre, ...{
          result: {
            validationResult: parseResultKey(validCode, ValidCodes), 
            regionCode: phoneUtil.getRegionCodeForNumber(number),
            isValidNumberForRegion: phoneUtil.isValidNumberForRegion(number, data.code),
            isPossibleNumber: phoneUtil.isPossibleNumber(number),
            type: parseResultKey(phoneUtil.getNumberType(number), PhoneNumberType),
          }
        }
      }))
    } catch (error) {
      setData(pre => ({ ...pre, ...{ result: null, error } }))
    }
  }
  useEffect(() => {
    if (data.number && data.code) {
      setData(pre => { delete pre['error']; return pre})
      verifyNumber()
    } else {
      setData(pre => ({...pre, error: null}))
    }
  }, [data.number, data.code])
  useEffect(()=> {
    console.log(data);
  })
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <header className="App-header">
          <h4>International Phone Verification</h4>
          <Box
            display="flex"
            flexDirection="column"
            component="form"
            noValidate
            autoComplete="off"
          >
            <TextField id="outlined-basic" label="Input a Phone number" defaultValue={data.number} variant="outlined" onChange={(e) => {
              setData(pre => ({ ...pre, number: e.target.value }))
            }} />
            <br />
            <TextField id="outlined-basic" label="Country code" defaultValue={data.code} variant="outlined" onChange={(e) => {
              setData(pre => ({ ...pre, code: e.target.value.toUpperCase() }))
            }} />
            <br />
            <TextareaAutosize
              maxRows={10}
              aria-label="maximum height"
              placeholder="Result"
              value={data.result ? JSON.stringify(data.result, null, 2) : ''}
              style={{ width: 500, height: 200, background: 'none', color: 'whitesmoke', padding: '10px', lineHeight: '20px' }}
            />
            <br />
            <TextareaAutosize
              maxRows={10}
              aria-label="maximum height"
              placeholder="Error"
              value={data.error || ''}
              style={{ width: 500, height: 200, background: 'none', color: 'whitesmoke', padding: '10px' }}
            />
          </Box>
        </header>
      </div>
    </ThemeProvider>
  );
}

export default App;
