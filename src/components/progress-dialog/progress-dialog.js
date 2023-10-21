import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import './style.css';
import PropTypes from 'prop-types';
import Iconify from '../iconify';
import { CircularProgressWithLabel } from '../circular-progress-bar/circular-progress-bar';

export const ProgressDialog = ({ title, progressText, list }) => (
  <Box
    position="fixed"
    right={20}
    bottom={0}
    display="flex"
    bgcolor="white"
    flexDirection="column"
    sx={{
      border: '1px solid #dedede',
      borderTopLeftRadius: '14px',
      borderTopRightRadius: '14px',
    }}
  >
    <Stack px={2} py={0.3} direction="row" alignItems="center" spacing={7}>
      <Typography>{title}</Typography>
      <Stack direction="row" alignContent="center" spacing={1}>
        <IconButton>
          <Iconify icon="mingcute:up-line" />
        </IconButton>
        <IconButton>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </Stack>
    </Stack>
    <Stack
      bgcolor="#c4cced"
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      px={2}
      py={0.3}
    >
      <Typography variant="body2" color="#606060">
        {progressText}
      </Typography>
      <Button
        sx={{
          fontSize: '13px',
          textDecoration: 'underline',
          color: '#1539f3',
          padding: 0,
        }}
        variant="text"
      >
        Cancel
      </Button>
    </Stack>
    {list.map((item, index) => (
      <Stack key={`item-${index + 1}`} spacing={1}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          px={2}
          py={1}
          spacing={1}
          borderBottom={index !== list.length - 1 && '1px solid #f0f0f0'}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Iconify icon="teenyicons:pdf-solid" />
            <Typography variant="body2">{item}</Typography>
          </Stack>
          <CircularProgressWithLabel value={Math.random() * 100} />
        </Stack>
      </Stack>
    ))}
  </Box>
);

ProgressDialog.propTypes = {
  title: PropTypes.string,
  progressText: PropTypes.string,
  list: PropTypes.array,
};
