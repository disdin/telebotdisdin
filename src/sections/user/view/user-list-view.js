import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Card,
  Container,
  Stack,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material';
import { LoadingScreen } from 'src/components/loading-screen';
import { getUsers } from 'src/services/user.service';
import { useSettingsContext } from 'src/components/settings';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  emptyRows,
  getComparator,
  useTable,
} from 'src/components/table';
import JobTableToolbar from 'src/sections/user/user-table-toolbar';
import JobTableFiltersResult from 'src/sections/user/user-table-filters-result';
import Scrollbar from 'src/components/scrollbar';
import { useRouter } from 'src/routes/hooks';
import styles from './styles.module.css';
import JobTableRow from '../user-table-row';
import { OverviewAppView } from 'src/sections/overview/app/view';

function applyFilter({ inputData, comparator, filters }) {
  const { userName, status } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map(el => el[0]);
  if (userName) {
    console.log(userName)
    inputData = inputData.filter(
      job =>
        job.userName.toLowerCase().indexOf(userName.toLowerCase()) !== -1,
    );
  }

  if (status.length) {
    inputData = inputData.filter(job => status.includes(!job.status));
  }

  return inputData;
}

const defaultFilters = {
  userName: '',
  status: [],
};

const TABLE_HEAD = [
  { id: 'userName', label: 'User' },
  { id: 'created', label: 'Created' },
  { id: 'status', label: 'Status', align: 'center', sortable: false },
  { id: '' },
];

const STATUS_OPTIONS = [
  { value: true, label: 'Active' },
  { value: false, label: 'Blocked' },
];

const UserDashboard = () => {
  // variables

  // context
  const settings = useSettingsContext();

  // states
  const [loader, setLoader] = useState(true);
  const [detailsChanged,setDetailsChanged] = useState(false)

  // router
  const router = useRouter();

  // hooks
  const table = useTable({ defaultOrderBy: 'created', order: 'desc' });

  // states
  const [tableData, setTableData] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);

  // variables
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const denseHeight = table.dense ? 56 : 76;

  const canReset =
    !!filters.userName ||
    !!filters.status.length;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  // functions
  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters(prevState => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table],
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // effects
  useEffect(() => {
    const getUsersCaller = async () => {
      try {
        setLoader(true);
        const data = await getUsers();
        console.log("data = ",data)
        if (data !== undefined && data !== null && data.success) {
          const users = data.body;
          const rolesArr = users.map(user => {
            const userName = user.first_name;
            const status = user.blocked;
            const created = user.created_at;
            const id = user.user_id;

            return {
              id,
              created,
              userName,
              status,
            };
          });

          setTableData(rolesArr);
        }
      }
      catch (err) {
        console.log(err)
      }
    };
    getUsersCaller();
  },[detailsChanged]);

  useEffect(() => {
    if (tableData) setLoader(false);
  }, [tableData]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <div className={styles.heading}>
        <OverviewAppView />
      </div>

      {loader && <LoadingScreen />}
      {!loader && (
        <Card>
          <JobTableToolbar
            filters={filters}
            onFilters={handleFilters}
            statusOptions={STATUS_OPTIONS}
          />

          {canReset && (
            <JobTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData.length}
              onSelectAllRows={checked =>
                table.onSelectAllRows(
                  checked,
                  tableData.map(row => row.id),
                )
              }
              action={
                  <Stack direction="row">
                    <Button variant="contained">Delete</Button>
                  </Stack>
              }
            />

            <Scrollbar>
              <Table
                size={table.dense ? 'small' : 'medium'}
                sx={{ minWidth: 800 }}
              >
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={checked =>
                    table.onSelectAllRows(
                      checked,
                      tableData.map(row => row.id),
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage,
                    )
                    .map(row => (
                      <JobTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        setDetailsChanged={setDetailsChanged}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(
                      table.page,
                      table.rowsPerPage,
                      tableData.length,
                    )}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      )}
    </Container>
  );
};

export default UserDashboard;
