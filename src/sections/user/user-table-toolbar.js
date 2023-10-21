import PropTypes from 'prop-types';
import { useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
// components
import {
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
// ----------------------------------------------------------------------

export default function JobTableToolbar({
  filters,
  onFilters,
  statusOptions,
}) {
  const popover = usePopover();

  const handleFilterOpeningRole = useCallback(
    event => {
      onFilters('userName', event.target.value);
    },
    [onFilters],
  );


  const handleFilterStatus = useCallback(
    event => {
      onFilters(
        'status',
        typeof event.target.value === 'string'
          ? event.target.value.split(',')
          : event.target.value,
      );
    },
    [onFilters],
  );

  const useStyles = makeStyles(theme => ({
    button: {
      // Apply select styles to the button
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontWeight: 400,
      color: '#637381',
      whiteSpace: 'nowrap',
      backgroundColor: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      width: '200px',
      padding: '14px',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: theme.palette.background.default,
      },
    },
    buttonText: {
      marginRight: theme.spacing(1),
    },
  }));

  const classes = useStyles();
  
  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          p: 2.5,
          pr: { xs: 2.5, md: 1 },
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'flex-end', md: 'center' }}
          spacing={2}
          flexGrow={1}
          sx={{ width: 1 }}
        >
          <TextField
            sx={{
              width: { xs: 1, md: 260 },
            }}
            value={filters.userName}
            onChange={handleFilterOpeningRole}
            placeholder="Search opening role..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify
                    icon="eva:search-fill"
                    sx={{ color: 'text.disabled' }}
                  />
                </InputAdornment>
              ),
            }}
          />
          <Stack
            spacing={1}
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            flexGrow={1}
          >
            <FormControl
              sx={{
                flexShrink: 0,
                width: { xs: 1, md: 200 },
              }}
            >
              <InputLabel>Status</InputLabel>

              <Select
                multiple
                value={filters.status}
                onChange={handleFilterStatus}
                input={<OutlinedInput label="Status" />}
                renderValue={selected =>
                  selected.map(value => value===true?"Active":"Blocked").join(', ')
                }
                sx={{ textTransform: 'capitalize' }}
              >
                {statusOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    <Checkbox
                      disableRipple
                      size="small"
                      checked={filters.status.includes(option.value)}
                    />
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Stack>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:printer-minimalistic-bold" />
          Print
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:import-bold" />
          Import
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:export-bold" />
          Export
        </MenuItem>
      </CustomPopover>
    </>
  );
}

JobTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  openDateRange: PropTypes.any,
  onCloseDateRange: PropTypes.func,
  onOpenDateRange: PropTypes.func,
  statusOptions: PropTypes.array,
  dateError: PropTypes.any,
};
