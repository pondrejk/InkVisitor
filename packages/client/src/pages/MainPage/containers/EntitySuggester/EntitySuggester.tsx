import {
  ActantStatus,
  ActantType,
  AllActantType,
  CategoryActantType,
  UserRole,
  UserRoleMode,
} from "@shared/enums";
import { IActant, IOption } from "@shared/types";
import api from "api";
import { EntitySuggestionI, Suggester } from "components/Suggester/Suggester";
import { CActant, CStatement, CTerritoryActant } from "constructors";
import { useDebounce, useSearchParams } from "hooks";
import React, { useEffect, useState } from "react";
import { DragObjectWithType } from "react-dnd";
import { FaHome } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { OptionTypeBase, ValueType } from "react-select";
import { toast } from "react-toastify";
import { DropdownAny, rootTerritoryId } from "Theme/constants";
import { Entities } from "types";

interface EntitySuggesterI {
  categoryTypes: ActantType[];
  onSelected: Function;
  placeholder?: string;
  allowCreate?: boolean;
  disableWildCard?: boolean;
  inputWidth?: number | "full";
  openDetailOnCreate?: boolean;
  territoryActants?: string[];
  excludedEntities?: ActantType[];
  excludedActantIds?: string[];
  filterEditorRights?: boolean;
}

export const EntitySuggester: React.FC<EntitySuggesterI> = ({
  categoryTypes,
  onSelected,
  placeholder = "",
  allowCreate,
  inputWidth,
  disableWildCard = false,
  openDetailOnCreate = false,
  territoryActants,
  excludedEntities = [],
  filterEditorRights = false,
  excludedActantIds = [],
}) => {
  const queryClient = useQueryClient();
  const [typed, setTyped] = useState<string>("");
  const debouncedTyped = useDebounce(typed, 100);
  const [selectedCategory, setSelectedCategory] = useState<any>();
  const [allCategories, setAllCategories] = useState<IOption[]>();

  const { setActantId } = useSearchParams();
  const userRole = localStorage.getItem("userrole");

  // Suggesions query
  const {
    status: statusStatement,
    data: suggestions,
    error: errorStatement,
    isFetching: isFetchingStatement,
  } = useQuery(
    ["suggestion", debouncedTyped, selectedCategory],
    async () => {
      const resSuggestions = await api.actantsGetMore({
        label: debouncedTyped,
        class:
          selectedCategory?.value === DropdownAny
            ? false
            : selectedCategory.value,
        excluded: excludedEntities.length ? excludedEntities : undefined,
      });

      // TODO: status -> data.status
      const suggestions = resSuggestions.data;
      suggestions.sort((a, b) => {
        if (a.status == ActantStatus.Discouraged) {
          return 1;
        } else {
          return -1;
        }
      });
      return (
        resSuggestions.data
          //.filter((s) => s.status !== ActantStatus.Discouraged)
          .filter((s) =>
            filterEditorRights && userRole !== UserRole.Admin
              ? s.right === UserRoleMode.Write
              : s
          )
          .filter((s) =>
            excludedActantIds.length ? !excludedActantIds.includes(s.id) : s
          )
          .map((s: IActant) => {
            const entity = Entities[s.class];

            const icons: React.ReactNode[] = [];

            if (territoryActants?.includes(s.id)) {
              icons.push(<FaHome key={s.id} color="" />);
            }

            return {
              color: entity.color,
              category: s.class,
              label: s.label,
              detail: s.detail,
              status: s.status,
              ltype: s.data.logicalType,
              id: s.id,
              icons: icons,
            };
          })
      );
    },
    {
      enabled:
        debouncedTyped.length > 1 &&
        !!selectedCategory &&
        !excludedEntities
          .map((key) => key.valueOf())
          .includes(selectedCategory.value) &&
        api.isLoggedIn(),
    }
  );

  const handleClean = () => {
    setTyped("");
  };

  // initial load of categories
  useEffect(() => {
    const categories: IOption[] = [];
    categoryTypes.forEach((category) => {
      categories.push({
        label: category.valueOf(),
        value: category.valueOf(),
      });
    });
    if (categories.length > 1 && !disableWildCard) {
      categories.unshift({
        label: ActantType.Any,
        value: DropdownAny,
      });
    }
    if (categories.length) {
      setAllCategories(categories);
      setSelectedCategory(categories[0]);
    }
  }, [categoryTypes]);

  const actantsCreateMutation = useMutation(
    async (newActant: IActant) => await api.actantsCreate(newActant),
    {
      onSuccess: (data, variables) => {
        onSelected(variables.id);
        handleClean();
        if (variables.class === "T") {
          queryClient.invalidateQueries("tree");
          toast.info(`Terrritory [${variables.label}] created!`);
        } else if (variables.class === "S") {
          toast.info(`Statement [${variables.label}] created!`);
        } else if (variables.class === "A") {
          toast.info(`Action [${variables.label}] created!`);
        } else {
          toast.info(`Actant [${variables.label}] created!`);
        }
        if (openDetailOnCreate) {
          setActantId(variables.id);
        }
      },
    }
  );

  const handleCreate = async (newCreated: {
    label: string;
    category: ActantType;
    detail: string;
    territoryId?: string;
  }) => {
    if (
      newCreated.category === ActantType.Statement &&
      newCreated.territoryId
    ) {
      const newStatement = CStatement(
        newCreated.territoryId,
        localStorage.getItem("userrole") as UserRole,
        newCreated.label,
        newCreated.detail
      );
      actantsCreateMutation.mutate(newStatement);
    } else if (newCreated.category === ActantType.Territory) {
      const newActant = CTerritoryActant(
        newCreated.label,
        newCreated.territoryId ? newCreated.territoryId : rootTerritoryId,
        -1,
        localStorage.getItem("userrole") as UserRole,
        newCreated.detail
      );
      actantsCreateMutation.mutate(newActant);
    } else {
      const newActant = CActant(
        newCreated.category as CategoryActantType,
        newCreated.label,
        localStorage.getItem("userrole") as UserRole,
        newCreated.detail
      );
      actantsCreateMutation.mutate(newActant);
    }
  };

  const handlePick = (newPicked: EntitySuggestionI) => {
    onSelected(newPicked.id);
    handleClean();
  };
  const handleDropped = (newDropped: any) => {
    const droppedCategory = newDropped.category;
    if (categoryTypes.includes(droppedCategory)) {
      onSelected(newDropped.id);
    }
    handleClean();
  };

  const [isWrongDropCategory, setIsWrongDropCategory] = useState(false);

  const handleHoverred = (newHoverred: any) => {
    const hoverredCategory = newHoverred.category;
    if (!categoryTypes.includes(hoverredCategory)) {
      setIsWrongDropCategory(true);
    } else {
      setIsWrongDropCategory(false);
    }
  };

  return selectedCategory && allCategories ? (
    <Suggester
      isFetching={isFetchingStatement}
      marginTop={false}
      suggestions={suggestions || []}
      placeholder={placeholder}
      typed={typed} // input value
      category={selectedCategory} // selected category
      categories={allCategories} // all possible categories
      suggestionListPosition={""} // todo not implemented yet
      onCancel={() => {
        handleClean();
      }}
      //disabled?: boolean; // todo not implemented yet
      onType={(newType: string) => {
        setTyped(newType);
      }}
      onChangeCategory={(option: ValueType<OptionTypeBase, any>) => {
        setSelectedCategory(option);
      }}
      onCreate={(newCreated: {
        label: string;
        category: AllActantType;
        detail: string;
        territoryId?: string;
      }) => {
        handleCreate(newCreated);
      }}
      onPick={(newPicked: EntitySuggestionI) => {
        handlePick(newPicked);
      }}
      onDrop={(newDropped: DragObjectWithType) => {
        handleDropped(newDropped);
      }}
      onHover={(newHoverred: DragObjectWithType) => {
        handleHoverred(newHoverred);
      }}
      isWrongDropCategory={isWrongDropCategory}
      allowCreate={allowCreate}
      inputWidth={inputWidth}
    />
  ) : (
    <div />
  );
};
