import { createAsyncThunk } from '@reduxjs/toolkit';
import firebaseInstance, {
  Collections,
  getCollectionEntries,
} from 'utils/firebase';
import { showSnackBar, StatusTypes } from 'store/app';
import { Settings } from '../../entities/Settings';
import { SettingsState } from '.';

enum ActionTypes {
  FETCH_SETTINGS = 'settings/fetchSettings',
  SET_DEPOSIT = 'settings/setDeposit',
}

const settingsCollection = firebaseInstance.collection(Collections.Settings);

export const fetchSettings = createAsyncThunk(
  ActionTypes.FETCH_SETTINGS,
  async (_, { dispatch }) => {
    try {
      const data = await settingsCollection.get();

      const settingsData = getCollectionEntries<Settings>(data);

      return settingsData[0];
    } catch (err) {
      dispatch(
        showSnackBar({
          status: StatusTypes.error,
          message: err.message.data.message,
        }),
      );
      return err.message.data;
    }
  },
);

export const setDeposit = createAsyncThunk(
  ActionTypes.SET_DEPOSIT,
  async (status: boolean, { getState, dispatch }) => {
    const {
      settings: { id },
    } = getState() as { settings: SettingsState };

    try {
      await settingsCollection.doc(id).update({ deposit: status });

      return status;
    } catch (err) {
      dispatch(
        showSnackBar({
          status: StatusTypes.error,
          message: err.message.data.message,
        }),
      );
      return err.message.data;
    }
  },
);
