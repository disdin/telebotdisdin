import PropTypes from 'prop-types';
// @mui
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { LinearProgress, Link, Stack, Tooltip } from '@mui/material';
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import MultipartProgressBar from 'src/components/multipart-progress-bar/multipart-progress-bar';
import { fDateDifference } from 'src/utils/format-time';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { deleteUser, putUserDetails } from 'src/services/user.service';
import { enqueueSnackbar } from 'notistack';

// ----------------------------------------------------------------------

export default function JobTableRow({
  row,
  selected,
  onSelectRow,
  setDetailsChanged

}) {
  const {
    id,
    userName,
    created,
    status,
  } = row;
  // console.log("row",row)

  const confirm = useBoolean(false);

  const popover = usePopover();

  const onDeleteRow = async () => {
    const res = await deleteUser(id);
    enqueueSnackbar(res.message);
    setDetailsChanged((prev) => !prev)
    confirm.onFalse();
  }

  const toggleBlock = async () => {
    const res = await putUserDetails({ blocked: !status }, id);
    enqueueSnackbar(res.message);
    setDetailsChanged((prev) => !prev)
  }

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ width: 200, wordBreak: 'break-word' }}>
          <Link
            component={RouterLink}
            to={`${paths.dashboard.root}`}
          >
            <Typography variant="body2">{userName}</Typography>
          </Link>

        </TableCell>

        <TableCell>
          <ListItemText
            primary={fDateDifference(created)}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          />
        </TableCell>

        <TableCell align="center">
          <Label
            variant="soft"
            color={
              (status === true && 'error') ||
              (status === false && 'success') ||
              'default'
            }
          >
            {status === true ? "Blocked" : "Active"}
          </Label>
        </TableCell>

        <TableCell align="center" sx={{ px: 1 }}>
          <IconButton
            color={popover.open ? 'inherit' : 'default'}
            onClick={popover.onOpen}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            toggleBlock();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          {status === true ? "Unblock" : "Block"}
        </MenuItem>
        <MenuItem
          onClick={() => {
            confirm.onTrue()
            popover.onClose();
          }}
        >
          <Iconify icon="ant-design:delete-outlined" />
          Delete
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}

JobTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
