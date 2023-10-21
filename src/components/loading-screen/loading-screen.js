import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { Stack, Typography } from '@mui/material';

// ----------------------------------------------------------------------

export default function LoadingScreen({ sx, loadingText, ...other }) {
  return (
    <Box
      sx={{
        px: 5,
        width: 1,
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx,
      }}
      {...other}
    >
      <Stack alignItems="center" spacing={1.5} width="100%">
        <Typography textAlign="center" variant="h5">
          {loadingText}
        </Typography>
        <LinearProgress color="primary" sx={{ width: 1, maxWidth: 360 }} />
      </Stack>
    </Box>
  );
}

LoadingScreen.propTypes = {
  sx: PropTypes.object,
  loadingText: PropTypes.string,
};
