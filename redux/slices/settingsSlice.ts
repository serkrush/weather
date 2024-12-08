import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UnitType = 'C' | 'F';

interface SettingsState {
  unit: UnitType;
}

const initialState: SettingsState = {
  unit: 'C',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleUnit(state) {
      state.unit = state.unit === 'C' ? 'F' : 'C';
    },
    setUnit(state, action: PayloadAction<UnitType>) {
      state.unit = action.payload;
    },
  },
});

export const { toggleUnit, setUnit } = settingsSlice.actions;
export default settingsSlice.reducer;