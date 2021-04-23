import React from 'react';
import MaskedInput from 'react-text-mask';

type TextMaskCustomProps = {
  inputRef: (ref: HTMLInputElement | null) => void;
};

export const InputMask = (props: TextMaskCustomProps) => {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={(ref: any) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[
        /[7, 8]/,
        '-',
        /\d/,
        /\d/,
        /\d/,
        '-',
        /\d/,
        /\d/,
        /\d/,
        '-',
        /\d/,
        /\d/,
        '-',
        /\d/,
        /\d/,
      ]}
      placeholderChar="_"
      showMask
    />
  );
};
