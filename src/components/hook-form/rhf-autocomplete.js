import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useRef, useState } from 'react';
import { endsWith } from 'lodash';

// ----------------------------------------------------------------------

export default function RHFAutocomplete({
  name,
  label,
  placeholder,
  helperText,
  ...other
}) {
  const { control, getValues, setValue } = useFormContext();
  const [inputValue, setInputValue] = useState('');
  // const refe = useRef();

  return (
    <div>
      <Controller
        name={name}
        render={({ field, fieldState: { error } }) => {
          // console.log(field)
          return (
            <Autocomplete
              {...field}
              inputValue={inputValue}
              onKeyDown={e => {
                // if (e.key == ',') {
                //   document.getElementById("xxx").dispatchEvent(new KeyboardEvent('keypress', {
                //     key: 'Enter',
                //   }));
                // }
              }}
              onInputChange={(event, newInputValue) => {
                //console.log("input change detected ",newInputValue);
                if (newInputValue.endsWith(',')) {
                  // event.target.blur()
                  // event.target.focus()
                  let oldValues = getValues();
                  oldValues = oldValues.skills;
                  console.log('old values is ', oldValues);
                  let newValueArr = newInputValue.split(',').slice(0, -1);
                  newValueArr = oldValues.concat(newValueArr);
                  console.log(newValueArr);
                  setValue(name, newValueArr, { shouldValidate: true });
                  setInputValue('');
                } else {
                  setInputValue(newInputValue);
                }
              }}
              onChange={(event, newValue) => {
                console.log('on change called ', newValue);
                return setValue(name, newValue, { shouldValidate: true });
              }}
              renderInput={params => {
                //console.log("render input called..")
                // if(params.inputProps.value.endsWith(',')){
                //   return(setValue(name, params.inputProps.value, { shouldValidate: true }))
                // }
                return (
                  <TextField
                    label={label}
                    placeholder={placeholder}
                    error={!!error}
                    helperText={error ? error?.message : helperText}
                    {...params}
                  />
                );
              }}
              {...other}
            />
          );
        }}
      />
    </div>
  );
}

RHFAutocomplete.propTypes = {
  helperText: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
};
