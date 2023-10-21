import { Box, Button, Card, Grid, Stack, Typography } from '@mui/material';
import { useRef } from 'react';
import PropTypes from 'prop-types';
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { LoadingButton } from '@mui/lab';

export default function JobLayout({
  jobCreationState,
  setJobCreationState,
  children,
}) {
  // ref
  const backRef = useRef();

  // functions
  const getTitle = () => {
    if (jobCreationState === 'INITIAL') return 'Job Details';
    if (jobCreationState === 'SEND_EMAIL') return 'Email Template';
    return 'Interview Questions';
  };

  const onButtonClick = () => {
    if (jobCreationState === 'ENTER_NO_OF_QUES') setJobCreationState('INITIAL');
    if (jobCreationState === 'ADD_QUES')
      setJobCreationState('ENTER_NO_OF_QUES');
  };

  const getButtonText = () => {
    let displayText;

    if (jobCreationState === 'ENTER_NO_OF_QUES') {
      displayText = 'Generate questions with AI';
    } else if (jobCreationState === 'INITIAL') {
      displayText = 'Save & Continue';
    } else if (jobCreationState === 'ADD_QUES') {
      displayText = 'Save';
    } else if (jobCreationState === 'SEND_EMAIL') {
      displayText = 'Send Email';
    }
    return displayText;
  };

  return (
    <Grid
      sx={{ display: 'flex', justifyContent: 'center' }}
      container
      spacing={3}
      px={5}
      py={2}
    >
      <Grid item xs={12} sx={{ width: '80%' }}>
        <Stack
          spacing={1.5}
          direction="row"
          alignItems="center"
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ mb: '1rem' }}>
              <Typography variant="h5" sx={{ mb: 0.5 }}>
                {getTitle()}
              </Typography>
            </Box>
            <Box>
              <Button
                ref={backRef}
                component={RouterLink}
                href={
                  jobCreationState === 'INITIAL' && paths.dashboard.job.root
                }
                onClick={onButtonClick}
                startIcon={
                  <Iconify icon="eva:arrow-ios-back-fill" width={16} />
                }
              >
                Back
              </Button>
            </Box>
          </Box>
        </Stack>
        <Card style={{ minHeight: '60vh' }}>{children}</Card>
      </Grid>
      <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          sx={{ ml: 2, margin: 'auto' }}
        >
          {getButtonText()}
        </LoadingButton>
      </Grid>
    </Grid>
  );
}

JobLayout.propTypes = {
  jobCreationState: PropTypes.string,
  setJobCreationState: PropTypes.func,
  children: PropTypes.element,
};
