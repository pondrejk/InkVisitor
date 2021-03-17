import React, { useEffect, useState, useMemo } from "react";

import { Dropdown } from "components";
import api from "api";
import { IAction } from "@shared/types";
import { useQuery, useMutation, useQueryClient } from "react-query";

import { OptionTypeBase, ValueType } from "react-select";

interface IActionDropdown {
  value: string;
  onSelectedChange: Function;
}

export const ActionDropdown: React.FC<IActionDropdown> = ({
  value,
  onSelectedChange,
}) => {
  const [selectedItem, setSelectedItem] = useState<ValueType<OptionTypeBase>>();

  // Actions query
  const {
    status: statusActions,
    data: actions,
    error: errorActions,
    isFetching: isFetchingActions,
  } = useQuery(
    ["actions"],
    async () => {
      const res = await api.actionsGetMore({});
      return res.data;
    },
    {}
  );
  const options = useMemo(() => {
    return actions?.map((action: IAction) => {
      const label = action.labels[0].value;
      return { value: action.id, label: label };
    });
  }, [actions]);

  // initialization
  useEffect(() => {
    const defaultOption = options?.find((option) => option.value === value);
    if (defaultOption) {
      setSelectedItem(defaultOption);
    }
  }, [actions]);

  return (
    <Dropdown
      value={selectedItem}
      onChange={(selectedItem: ValueType<OptionTypeBase>) => {
        setSelectedItem(selectedItem);
        onSelectedChange(selectedItem);
      }}
      options={options}
    />
  );
};