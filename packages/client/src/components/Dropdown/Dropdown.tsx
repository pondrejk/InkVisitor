import React, { ReactNode } from "react";
import {
  OptionsType,
  OptionTypeBase,
  GroupedOptionsType,
  ValueType,
} from "react-select";

import { StyledSelect, StyledSelectWrapper } from "./DropdownStyles";
import { Tooltip } from "components";

interface Dropdown {
  options?: OptionsType<OptionTypeBase> | GroupedOptionsType<OptionTypeBase>;
  value?: ValueType<OptionTypeBase>;
  onChange: (selectedOption: ValueType<OptionTypeBase>) => void;
  ref?: React.RefObject<ReactNode>;
  width?: number | "full";
  hideSelectedOptions?: boolean;
  noDropDownIndicator?: boolean;
  formatOptionLabel?: Function;
  isOptionSelected?: Function;
  getOptionLabel?: Function;
  placeholder?: string;
  isClearable?: boolean;
  isMulti?: boolean;
}
export const Dropdown: React.FC<Dropdown> = ({
  options,
  value,
  onChange,
  width,
  isOptionSelected,
  getOptionLabel,
  formatOptionLabel,
  hideSelectedOptions = false,
  noDropDownIndicator = false,
  placeholder = "select..",
  isClearable = false,
  isMulti = false,
}) => {
  return (
    <StyledSelectWrapper width={width}>
      <StyledSelect
        isMulti={isMulti}
        className="react-select-container"
        classNamePrefix="react-select"
        placeholder={placeholder}
        isClearable={isClearable}
        {...(getOptionLabel ? { getOptionLabel: getOptionLabel } : {})}
        {...(formatOptionLabel ? { formatOptionLabel: formatOptionLabel } : {})}
        {...(isOptionSelected ? { isOptionSelected: isOptionSelected } : {})}
        value={value}
        styles={{
          dropdownIndicator: () => {
            return {
              display: noDropDownIndicator ? "none" : "",
            };
          },
        }}
        onChange={onChange}
        options={options}
        width={width}
        hideSelectedOptions={hideSelectedOptions}
      />
    </StyledSelectWrapper>
  );
};
