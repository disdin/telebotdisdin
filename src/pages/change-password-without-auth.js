import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
// routes
import { useRouter, useSearchParams } from 'src/routes/hooks';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useCountdownSeconds } from 'src/hooks/use-countdown';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import CompactLayout from 'src/layouts/compact';
import { updateUserDetailsApi } from 'src/services/user.service';
import { Card, Container, Link, Typography } from '@mui/material';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { useSnackbar } from 'src/components/snackbar';
import { useSettingsContext } from 'src/components/settings';
import { useQuery } from 'src/hooks/use-query';

// ----------------------------------------------------------------------

export default function ChangePasswordWithoutAuth() {
  const { enqueueSnackbar } = useSnackbar();
  const settings = useSettingsContext();
  const router = useRouter();

  const searchParams = useSearchParams();

  const email = searchParams.get('email');

  const password = useBoolean();

  const params = useQuery();
  const token_id = params.get("token");
  // console.log(token_id)

  const { countdown, counting, startCountdown } = useCountdownSeconds(60);

  const VerifySchema = Yup.object().shape({
    password: Yup.string().required('Password is required'),
    confirmPassword: Yup.string()
      .required('Please confirm password')
      .oneOf([Yup.ref('password')], 'Passwords must match')
  });

  const defaultValues = {
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(VerifySchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async data => {
    console.log(data);
    try {
      const payload = {
        password: data.confirmPassword
      }
      const res = await updateUserDetailsApi(payload,token_id);
      console.log(res)
      if(res.success) enqueueSnackbar('Password Changed Successfully !');
      // router.push(paths.auth.amplify.login);
    } catch (error) {
      console.error(error);
    }
  });

  //   const handleResendCode = useCallback(async () => {
  //     try {
  //       startCountdown();
  //       await forgotPassword?.(values.email);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }, [forgotPassword, startCountdown, values.email]);

  const renderForm = (
    <Stack component={Card} sx={{ p: 3, }}>
      <Stack spacing={3} alignItems="center">
        <Typography variant="h4">Change Password</Typography>
        <RHFTextField
          name="password"
          label="Enter Password"
          type={password.value ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify
                    icon={
                      password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'
                    }
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <RHFTextField
          name="confirmPassword"
          label="Confirm New Password"
          type={password.value ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify
                    icon={
                      password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'
                    }
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Update Password
        </LoadingButton>

        <Link
          component={RouterLink}
          href={paths.auth.jwt.login}
          color="inherit"
          variant="subtitle2"
          sx={{
            alignItems: 'center',
            display: 'inline-flex',
          }}
        >
          <Iconify icon="eva:arrow-ios-back-fill" width={16} />
          Return to login
        </Link>
      </Stack>
    </Stack>
  );

  return (
    <Container sx={{ margin: "auto" }}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </FormProvider>
    </Container>
  );
}
