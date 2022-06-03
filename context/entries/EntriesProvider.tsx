import { FC, useReducer } from 'react';
import { v4 as uuid } from 'uuid';

import { Entry } from '../../interfaces';
import { EntriesContext, entriesReducer } from './';

export interface EntriesState {
  entries: Entry[];
}

const Entries_INITIAL_STATE: EntriesState = {
  entries: [
    {
      _id: uuid(),
      description: 'Lo que sea',
      status: 'pending',
      createdAt: Date.now()
    },
    {
      _id: uuid(),
      description: 'Lo que sea 2',
      status: 'in-progress',
      createdAt: Date.now() - 1000000
    },
    {
      _id: uuid(),
      description: 'Lo que sea 3',
      status: 'finished',
      createdAt: Date.now() - 100000
    }
  ]
};

interface Props {
  children: JSX.Element | JSX.Element[];
}

export const EntriesProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(entriesReducer, Entries_INITIAL_STATE);

  const addNewEntry = (description: string) => {
    const newEntry: Entry = {
      _id: uuid(),
      description,
      createdAt: Date.now(),
      status: 'pending'
    };

    dispatch({ type: '[Entry] Add-Entry', payload: newEntry });
  };

  const updateEntry = (entry: Entry) => {
    dispatch({ type: '[Entry] Entry-Updated', payload: entry });
  };

  return (
    <EntriesContext.Provider value={{ ...state, addNewEntry, updateEntry }}>
      {children}
    </EntriesContext.Provider>
  );
};
