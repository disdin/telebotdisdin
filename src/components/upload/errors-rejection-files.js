import PropTypes from 'prop-types';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
// utils
import { fData } from 'src/utils/format-number';
//
import { fileData } from '../file-thumbnail';

// ----------------------------------------------------------------------

export default function RejectionFiles({ fileRejections, maxSize }) {
  console.log(maxSize)
  if (!fileRejections.length) {
    return null;
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        py: 1,
        px: 2,
        mt: 1.8,
        mb:-7,
        textAlign: 'left',
        borderStyle: 'dashed',
        borderColor: 'error.main',
        bgcolor: theme => alpha(theme.palette.error.main, 0.08),
      }}
    >
      {fileRejections.map(({ file, errors }) => {
        const { path, size } = fileData(file);

        return (
          <Box key={path} sx={{ my: 0 }}>
            {/* <Typography variant="subtitle2" noWrap>
              {path} - {size ? fData(size) : ''}
            </Typography> */}

            {errors.map(error => (
              <Box
                key={error.code}
                component="span"
                sx={{ typography: 'caption' }}
              >
                {/* - {error.message} */}
                File size upto {maxSize/1000000} MB
              </Box>
            ))}
          </Box>
        );
      })}
    </Paper>
  );
}

RejectionFiles.propTypes = {
  fileRejections: PropTypes.array,
};
