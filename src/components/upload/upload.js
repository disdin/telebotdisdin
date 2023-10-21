import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// assets
import { CardActionArea, MenuItem } from '@mui/material';
import { useSnackbar } from 'notistack';
import { UploadIllustration } from 'src/assets/illustrations';
//
import Iconify from '../iconify';
//
import RejectionFiles from './errors-rejection-files';
import MultiFilePreview from './preview-multi-file';
import Scrollbar from '../scrollbar';
import CustomPopover, { usePopover } from '../custom-popover';
import FileThumbnail from '../file-thumbnail';
import Label from '../label';

// ----------------------------------------------------------------------

export default function Upload({
  disabled,
  multiple = false,
  inputSourceFormatOptions,
  inputFileTypeOptions,
  inputSourceFormat,
  onInputSourceFormatChange,
  inputFileType,
  onInputFileTypeChange,
  inputFileTypeButtonRef,
  inputSourceFormatButtonRef,
  setInsideButtonClicked,
  error,
  helperText,
  //
  file,
  onDelete,
  //
  files,
  thumbnail,
  onUpload,
  onRemove,
  onRemoveAll,
  sx,
  ...other
}) {
  const {
    open,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    multiple,
    disabled,
    ...other,
  });

  const hasFile = !!file && !multiple;

  const inputFileTypePopover = usePopover();
  const inputSourceFormatPopover = usePopover();

  const hasFiles = !!files && multiple && !!files.length;
  const { enqueueSnackbar } = useSnackbar();

  const hasError = isDragReject || !!error;

  const onBrowse = () => {
    if (
      inputFileType === 'pdf' ||
      (inputFileType === 'excel' && inputSourceFormat)
    ) {
      open();
    } else {
      enqueueSnackbar({
        message: 'Please choose the source format',
        variant: 'error',
      });
    }
  };

  const renderPlaceholder = (
    <Stack
      spacing={3}
      alignItems="center"
      justifyContent="center"
      flexWrap="wrap"
    >
      <UploadIllustration sx={{ width: 1, maxWidth: 200 }} />
      <Stack alignItems="center" spacing={2}>
        {multiple ? (
          <Stack spacing={1} alignItems="center">
            <Stack
              direction="row"
              textAlign="center"
              gap={1}
              alignItems="center"
            >
              <Stack
                direction="row"
                gap={0.5}
                textAlign="center"
                alignItems="center"
              >
                <Typography variant="h6">Drop or</Typography>
                <Box
                  onClick={onBrowse}
                  sx={{
                    color: 'primary.main',
                    fontSize: 18,
                    fontWeight: 600,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                  component="span"
                >
                  Browse
                </Box>
              </Stack>
              <>
                <Button
                  disableRipple
                  variant="outlined"
                  color="inherit"
                  ref={inputFileTypeButtonRef}
                  onClick={event => {
                    setInsideButtonClicked(true);

                    if (inputFileTypeButtonRef.current) {
                      inputFileTypeButtonRef.current.click();
                    }
                    // if (inputSourceFormatButtonRef.current) {
                    //   inputSourceFormatButtonRef.current.click();
                    // }
                    // setTimeout(() => {
                    //   setInsideButtonClicked(false);
                    // }, 2000);
                    inputFileTypePopover.onOpen(event);
                  }}
                  endIcon={
                    <Iconify
                      icon={
                        inputFileTypePopover.open
                          ? 'eva:arrow-ios-upward-fill'
                          : 'eva:arrow-ios-downward-fill'
                      }
                    />
                  }
                  sx={{ fontWeight: 'fontWeightSemiBold' }}
                >
                  <Box
                    component="span"
                    sx={{
                      fontWeight: 'fontWeightBold',
                      textTransform: 'capitalize',
                    }}
                  >
                    {
                      inputFileTypeOptions.find(
                        item => item.value === inputFileType,
                      ).label
                    }
                  </Box>
                </Button>
                <CustomPopover
                  open={inputFileTypePopover.open}
                  onClose={() => {
                    inputFileTypePopover.onClose();
                    setInsideButtonClicked(false);
                  }}
                  sx={{ width: 140 }}
                >
                  {inputFileTypeOptions.map(option => (
                    <MenuItem
                      key={option.value}
                      selected={option.value === inputFileType}
                      onClick={() => {
                        setInsideButtonClicked(false);
                        inputFileTypePopover.onClose();
                        if (option.value === 'pdf')
                          onInputSourceFormatChange('');
                        onInputFileTypeChange(option.value);
                      }}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </CustomPopover>
              </>
            </Stack>
          </Stack>
        ) : (
          <Stack spacing={1} alignItems="center">
            <Typography variant="h6">Drop or Select Resume</Typography>
            <Stack direction="row" textAlign="center" alignItems="center">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Drop Resumes here or
              </Typography>
              <Box
                component="span"
                sx={{
                  mx: 0.5,
                  fontSize: 14,
                  color: 'primary.main',
                  textDecoration: 'underline',
                }}
              >
                browse
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                through your machine
              </Typography>
            </Stack>
          </Stack>
        )}
        {inputFileType === 'excel' && (
          <Stack
            direction="row"
            spacing={1}
            textAlign="center"
            alignItems="center"
          >
            <Typography variant="body2">
              I have {inputFileType.toLowerCase()} file of{' '}
              <Box component="span" sx={{ color: 'red' }}>
                *
              </Box>
            </Typography>

            <Button
              disableRipple
              variant="outlined"
              color="inherit"
              onClick={inputSourceFormatPopover.onOpen}
              endIcon={
                <Iconify
                  icon={
                    inputSourceFormatPopover.open
                      ? 'eva:arrow-ios-upward-fill'
                      : 'eva:arrow-ios-downward-fill'
                  }
                />
              }
              sx={{
                fontWeight: 'fontWeightSemiBold',
                fontSize: 12,
              }}
            >
              <Box
                component="span"
                sx={{
                  fontWeight: 'fontWeightBold',
                  textTransform: 'capitalize',
                }}
              >
                {inputSourceFormat
                  ? inputSourceFormatOptions.find(
                      item => item.value === inputSourceFormat,
                    ).label
                  : 'Choose Source'}
              </Box>
            </Button>

            <CustomPopover
              open={inputSourceFormatPopover.open}
              onClose={inputSourceFormatPopover.onClose}
              sx={{ p: 2.5 }}
            >
              <Stack spacing={2.5}>
                <Box
                  gap={1}
                  display="grid"
                  gridTemplateColumns="repeat(1, 1fr)"
                >
                  {inputSourceFormatOptions.map(type => (
                    <CardActionArea
                      key={type.value}
                      onClick={() => {
                        inputSourceFormatPopover.onClose();
                        onInputSourceFormatChange(type.value);
                      }}
                      sx={{
                        p: 1,
                        borderRadius: 1,
                        cursor: 'pointer',
                        border: theme =>
                          `solid 1px ${alpha(theme.palette.grey[500], 0.08)}`,
                        ...(type.value === inputSourceFormat && {
                          bgcolor: 'action.selected',
                        }),
                      }}
                    >
                      <Stack spacing={1} direction="row" alignItems="center">
                        <Box
                          component="img"
                          src={type.logo}
                          sx={{
                            width: 32,
                            height: 32,
                            flexShrink: 0,
                            ...sx,
                          }}
                        />
                        <Typography
                          variant={
                            type.value === inputSourceFormat
                              ? 'subtitle2'
                              : 'body2'
                          }
                        >
                          {type.label}
                        </Typography>
                      </Stack>
                    </CardActionArea>
                  ))}
                </Box>
              </Stack>
            </CustomPopover>
          </Stack>
        )}
        {inputSourceFormat === 'HIREINTEL' && (
          <Label color="info" startIcon={<Iconify icon="ic:outline-info" />}>
            <Stack
              direction="row"
              textAlign="center"
              gap={0.5}
              alignItems="center"
            >
              <Typography variant="caption">Upload excel in this</Typography>
              <Box
                component="span"
                sx={{
                  color: 'primary.main',
                  textDecoration: 'underline',
                }}
                variant="caption"
              >
                format
              </Box>
            </Stack>
          </Label>
        )}
      </Stack>
    </Stack>
  );

  const renderSinglePreview = (
    // <SingleFilePreview imgUrl={typeof file === 'string' ? file : file?.preview} />
    <MultiFilePreview files={[file]} />
  );

  const removeSinglePreview = hasFile && onDelete && (
    <IconButton
      size="small"
      onClick={onDelete}
      sx={{
        top: 16,
        right: 16,
        zIndex: 9,
        position: 'absolute',
        color: theme => alpha(theme.palette.common.white, 0.8),
        bgcolor: theme => alpha(theme.palette.grey[900], 0.72),
        '&:hover': {
          bgcolor: theme => alpha(theme.palette.grey[900], 0.48),
        },
      }}
    >
      <Iconify icon="mingcute:close-line" width={18} />
    </IconButton>
  );

  const renderMultiPreview = hasFiles && (
    <>
      <Scrollbar sx={{ maxHeight: 250 }}>
        <MultiFilePreview
          files={files}
          thumbnail={thumbnail}
          onRemove={onRemove}
        />
      </Scrollbar>

      <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
        {onRemoveAll && (
          <Button
            color="inherit"
            variant="outlined"
            size="small"
            onClick={onRemoveAll}
          >
            Remove All
          </Button>
        )}

        {onUpload && (
          <Button
            size="small"
            variant="contained"
            onClick={onUpload}
            startIcon={<Iconify icon="eva:cloud-upload-fill" />}
          >
            Upload
          </Button>
        )}
      </Stack>
    </>
  );

  return (
    <Box sx={{ width: 1, position: 'relative', ...sx }}>
      <Box
        {...getRootProps()}
        sx={{
          p: 5,
          outline: 'none',
          borderRadius: 1,
          cursor: 'pointer',
          overflow: 'hidden',
          position: 'relative',
          bgcolor: theme => alpha(theme.palette.grey[500], 0.08),
          border: theme => `1px dashed ${alpha(theme.palette.grey[500], 0.2)}`,
          transition: theme => theme.transitions.create(['opacity', 'padding']),
          '&:hover': {
            opacity: 0.72,
          },
          ...(isDragActive && {
            opacity: 0.72,
          }),
          ...(disabled && {
            opacity: 0.48,
            pointerEvents: 'none',
          }),
          ...(hasError && {
            color: 'error.main',
            borderColor: 'error.main',
            bgcolor: theme => alpha(theme.palette.error.main, 0.08),
          }),
          ...(hasFile && {
            padding: '3% 0',
            // height:'7.5rem'
            height: '7.85rem',
          }),
        }}
      >
        <input {...getInputProps()} />

        {hasFile ? renderSinglePreview : renderPlaceholder}
      </Box>

      {removeSinglePreview}

      {helperText && helperText}

      <RejectionFiles fileRejections={fileRejections} />

      {renderMultiPreview}
    </Box>
  );
}

Upload.propTypes = {
  disabled: PropTypes.object,
  error: PropTypes.bool,
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  files: PropTypes.array,
  helperText: PropTypes.object,
  multiple: PropTypes.bool,
  onDelete: PropTypes.func,
  onRemove: PropTypes.func,
  onRemoveAll: PropTypes.func,
  onUpload: PropTypes.func,
  sx: PropTypes.object,
  thumbnail: PropTypes.bool,
  inputFileTypeOptions: PropTypes.array,
  inputSourceFormatOptions: PropTypes.array,
  inputSourceFormat: PropTypes.object,
  inputFileType: PropTypes.object,
  onInputFileTypeChange: PropTypes.func,
  onInputSourceFormatChange: PropTypes.func,
  inputFileTypeButtonRef: PropTypes.object,
  inputSourceFormatButtonRef: PropTypes.object,
  setInsideButtonClicked: PropTypes.func,
};
