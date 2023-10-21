// @mui
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// _mock
// import { _appFeatured, _appAuthors, _appInstalled, _appRelated, _appInvoices } from 'src/_mock';

// components
import { useSettingsContext } from 'src/components/settings';
// assets
import { SeoIllustration } from 'src/assets/illustrations';
//
import AppWelcome from '../app-welcome';
import { Button, Card, Stack, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useEffect, useState } from 'react';
import { getApiDetails } from 'src/services/user.service';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

export default function OverviewAppView({ availableCredit }) {
  const { user } = useMockedUser();
  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();
  const [apiData, setApiData] = useState({});
  const [copySuccess, setCopySuccess] = useState(0);

  const settings = useSettingsContext();

  useEffect(() => {
    const caller = async () => {
      const res = await getApiDetails();
      console.log(res);
      setApiData(res.body);
    }
    caller();
  }, []);

  const handleCopyClick = (interviewUrl,ind) => {
    navigator.clipboard.writeText(interviewUrl).then(
      () => {
        enqueueSnackbar('Api key copied to clipboard');
        setCopySuccess(ind);

        setTimeout(() => {
          setCopySuccess(0);
        }, 2000);
      },
      () => {
        enqueueSnackbar({ message: 'Failed to copy URL', variant: "error" });
      },
    );
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <AppWelcome
            title="Welcome 👋"
            description="From disdin"
            img={<SeoIllustration />}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <Card sx={{ height: "100%", p: "20% 10%", display: "flex", flexDirection: "column", justifyContent: "space-around", background: "#e8e8ff", color: "#010B73" }}>
            <Stack sx={{display:"flex",flexDirection:"row"}}>
              <Typography sx={{width:"70%"}} variant="h5">Telegram Api</Typography>
              <Button
              sx={{width:"10px",display:"inline-block"}}
                disabled={copySuccess===1}
                onClick={() =>
                  handleCopyClick(
                    apiData.telegramToken,1
                  )
                }
              >
                {copySuccess===1 ? 'Copied' : 'Copy'}
              </Button>
            </Stack>

            <Stack sx={{display:"flex",flexDirection:"row"}}>
              <Typography sx={{width:"70%"}} variant="h5">Weather Api</Typography>
              <Button
              sx={{width:"10px",display:"inline-block"}}
                disabled={copySuccess===2}
                onClick={() =>
                  handleCopyClick(
                    apiData.weatherkey,2
                  )
                }
              >
                {copySuccess===2 ? 'Copied' : 'Copy'}
              </Button>
            </Stack>

          </Card>
        </Grid>

      </Grid>
    </Container>
  );
}
