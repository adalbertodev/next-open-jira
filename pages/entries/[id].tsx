import {
  ChangeEvent,
  FC,
  useMemo,
  useState,
  useEffect,
  useContext
} from 'react';
import { GetServerSideProps } from 'next';
import {
  Button,
  capitalize,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  TextField
} from '@mui/material';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

import { Layout } from '../../components/layouts';
import { Entry, EntryStatus } from '../../interfaces';
import { dbEntries } from '../../database';
import { EntriesContext } from '../../context/entries';
import { useRouter } from 'next/router';
import { dateFunctions } from '../../utils';

const validStatus: EntryStatus[] = ['pending', 'in-progress', 'finished'];

interface Props {
  entry: Entry;
}

const EntryPage: FC<Props> = ({ entry }) => {
  const { updateEntry, deleteEntry } = useContext(EntriesContext);

  const [inputValue, setInputValue] = useState(entry.description);
  const [status, setStatus] = useState<EntryStatus>(entry.status);
  const [touched, setTouched] = useState(false);

  const router = useRouter();

  const isValid = useMemo(
    () => !(inputValue.length <= 0 && touched),
    [inputValue.length, touched]
  );

  const onTextFieldChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const onStatusChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setStatus(event.target.value as EntryStatus);
  };

  const onSave = () => {
    if (inputValue.trim().length === 0) return;
    const updatedEntry: Entry = {
      ...entry,
      description: inputValue,
      status
    };

    updateEntry(updatedEntry, true);
    router.push('/');
  };

  const onDelete = () => {
    deleteEntry(entry._id, true);
    router.push('/');
  };

  return (
    <Layout title={entry.description.substring(0, 20) + '...'}>
      <Grid container justifyContent='center' sx={{ marginTop: 2 }}>
        <Grid item xs={12} sm={8} md={6}>
          <Card>
            <CardHeader
              title={`Entrada:`}
              subheader={`Creada ${dateFunctions.getFormatDistanceToNow(
                entry.createdAt
              )}`}
            />
            <CardContent>
              <TextField
                sx={{ marginTop: 2, marginBottom: 1 }}
                fullWidth
                placeholder='Nueva Entrada...'
                autoFocus
                multiline
                label='Nueva Entrada'
                value={inputValue}
                onBlur={() => setTouched(true)}
                onChange={onTextFieldChanged}
                helperText={!isValid && 'Ingrese un valor'}
                error={!isValid}
              />

              <FormControl>
                <FormLabel>Entado:</FormLabel>
                <RadioGroup row value={status} onChange={onStatusChanged}>
                  {validStatus.map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={<Radio />}
                      label={capitalize(option)}
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              <CardActions>
                <Button
                  startIcon={<SaveOutlinedIcon />}
                  variant='contained'
                  fullWidth
                  onClick={onSave}
                  disabled={inputValue.length <= 0}
                >
                  Save
                </Button>
              </CardActions>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <IconButton
        sx={{
          position: 'fixed',
          bottom: 30,
          right: 30,
          backgroundColor: 'error.dark'
        }}
        onClick={onDelete}
      >
        <DeleteOutlinedIcon />
      </IconButton>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params as { id: string };
  const entry = await dbEntries.getEntryById(id);

  if (!entry) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  }

  return {
    props: { entry }
  };
};

export default EntryPage;
