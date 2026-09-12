'use client';

import ReactSelect, { type MultiValue, type SingleValue } from 'react-select';
import { useId, useMemo } from 'react';

import { cn } from '@/utils/cn';
import { InputWrapper } from '@/components/ui/inputs/InputWrapper';

export interface SelectOption {
  value: string;
  label: string;
}

const SELECT_ALL_VALUE = '__select_all__';

interface SharedSelectProps {
  label?: string | undefined;
  error?: string | undefined;
  hint?: string | undefined;
  required?: boolean | undefined;
  wrapperClassName?: string | undefined;
  options: SelectOption[];
  placeholder?: string | undefined;
  isSearchable?: boolean | undefined;
  isDisabled?: boolean | undefined;
  isLoading?: boolean | undefined;
  isClearable?: boolean | undefined;
  id?: string | undefined;
  name?: string | undefined;
}

interface SingleSelectProps extends SharedSelectProps {
  isMulti?: false | undefined;
  value: string | null | undefined;
  onChange: (value: string | null) => void;
}

interface MultiSelectProps extends SharedSelectProps {
  isMulti: true;
  /** Adds a "Select all" option that toggles every option at once. */
  allowSelectAll?: boolean | undefined;
  value: string[] | null | undefined;
  onChange: (value: string[]) => void;
}

type SelectProps = SingleSelectProps | MultiSelectProps;

const selectClassNames = {
  control: ({ isFocused, isDisabled }: { isFocused: boolean; isDisabled: boolean }) =>
    cn(
      'rounded-sm border bg-surface px-1 py-0.5 transition-colors',
      isFocused ? 'border-brand' : 'border-border',
      isDisabled && 'cursor-not-allowed opacity-50',
    ),
  placeholder: () => 'text-text-secondary text-body',
  singleValue: () => 'text-text-primary text-body',
  input: () => 'text-text-primary text-body',
  menu: () => 'rounded-sm border border-border bg-surface shadow-elevated overflow-hidden',
  menuList: () => 'py-1',
  option: ({ isFocused, isSelected }: { isFocused: boolean; isSelected: boolean }) =>
    cn(
      'text-body-sm cursor-pointer px-3 py-2',
      isSelected
        ? 'bg-brand text-white'
        : isFocused
          ? 'bg-neutral-tint text-text-primary'
          : 'text-text-primary',
    ),
  multiValue: () => 'bg-neutral-tint rounded-pill flex items-center gap-1 pl-2 pr-1 my-0.5 mr-1',
  multiValueLabel: () => 'text-body-sm text-text-primary',
  multiValueRemove: () => 'cursor-pointer text-text-secondary hover:text-error-text rounded-full',
  clearIndicator: () => 'cursor-pointer text-text-secondary hover:text-text-primary',
  dropdownIndicator: () => 'cursor-pointer text-text-secondary hover:text-text-primary',
  indicatorSeparator: () => 'bg-border',
  noOptionsMessage: () => 'text-body-sm text-text-secondary px-3 py-2',
  loadingMessage: () => 'text-body-sm text-text-secondary px-3 py-2',
};

export function Select(props: SelectProps) {
  const {
    label,
    error,
    hint,
    required,
    wrapperClassName,
    options,
    placeholder,
    isSearchable = true,
    isDisabled,
    isLoading,
    isClearable = false,
    id,
    name = '',
  } = props;
  const generatedId = useId();
  const selectId = id ?? generatedId;

  const allowSelectAll = props.isMulti && props.allowSelectAll;
  const optionsWithSelectAll = useMemo(() => {
    if (!allowSelectAll || options.length === 0) return options;
    return [{ value: SELECT_ALL_VALUE, label: 'Select all' }, ...options];
  }, [options, allowSelectAll]);

  const optionByValue = useMemo(
    () => new Map(options.map((option) => [option.value, option])),
    [options],
  );

  if (props.isMulti) {
    const { value, onChange } = props;
    const selected = (value ?? [])
      .map((v) => optionByValue.get(v))
      .filter((option): option is SelectOption => Boolean(option));

    const handleChange = (next: MultiValue<SelectOption>) => {
      const selectedValues = next.map((option) => option.value);
      if (props.allowSelectAll && selectedValues.includes(SELECT_ALL_VALUE)) {
        const allSelected = options.length > 0 && value?.length === options.length;
        onChange(allSelected ? [] : options.map((option) => option.value));
        return;
      }
      onChange(selectedValues);
    };

    return (
      <InputWrapper
        label={label}
        htmlFor={selectId}
        error={error}
        hint={hint}
        required={required}
        className={wrapperClassName}
      >
        <ReactSelect<SelectOption, true>
          instanceId={selectId}
          inputId={selectId}
          name={name}
          isMulti
          unstyled
          isSearchable={isSearchable}
          isDisabled={isDisabled}
          isLoading={isLoading}
          isClearable={isClearable}
          placeholder={placeholder}
          options={optionsWithSelectAll}
          value={selected}
          onChange={handleChange}
          classNames={selectClassNames}
          hideSelectedOptions={false}
          closeMenuOnSelect={false}
        />
      </InputWrapper>
    );
  }

  const { value, onChange } = props;
  const selected = value ? (optionByValue.get(value) ?? null) : null;

  const handleChange = (next: SingleValue<SelectOption>) => {
    onChange(next?.value ?? null);
  };

  return (
    <InputWrapper
      label={label}
      htmlFor={selectId}
      error={error}
      hint={hint}
      required={required}
      className={wrapperClassName}
    >
      <ReactSelect<SelectOption, false>
        instanceId={selectId}
        inputId={selectId}
        name={name}
        unstyled
        isSearchable={isSearchable}
        isDisabled={isDisabled}
        isLoading={isLoading}
        isClearable={isClearable}
        placeholder={placeholder}
        options={options}
        value={selected}
        onChange={handleChange}
        classNames={selectClassNames}
      />
    </InputWrapper>
  );
}
