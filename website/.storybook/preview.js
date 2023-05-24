import React from 'react';
import EmotionThemeProvider from '../src/styles/EmotionThemeProvider';
import cmTheme from '../src/styles/theme/cancermodels';

export const decorators = [
  (Story) => (
    <EmotionThemeProvider theme={cmTheme}>
      <Story />
    </EmotionThemeProvider>
  ),
];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};
