import {
  StyledAttributeWrapper,
  StyledAttributeModalContent,
} from "./StatementEditorAttributesStyles";

import {
  certaintyDict,
  elvlDict,
  logicDict,
  moodDict,
  moodVariantsDict,
  partitivityDict,
  virtualityDict,
  operatorDict,
} from "@shared/dictionaries";

import {
  Button,
  ButtonGroup,
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter,
  Tooltip,
  Loader,
} from "components";

import { MdSettings } from "react-icons/md";
import {
  ActantType,
  Certainty,
  Elvl,
  Logic,
  Mood,
  MoodVariant,
  Virtuality,
  Partitivity,
  Operator,
} from "@shared/enums";
import React, { useState } from "react";
import { ElvlToggle } from "../..";
import { AttributeIcon } from "../../../../../components/AttributeIcon/AttributeIcon";
import { Colors, Entities } from "types";
import { CheckboxRow } from "./CheckboxRow/CheckboxRow";
import { AttributeRow } from "./AttributeRow/AttributeRow";
import { TooltipAttributeRow } from "./TooltipAttributeRow/TooltipAttributeRow";

type AttributeName =
  | "certainty"
  | "elvl"
  | "logic"
  | "mood"
  | "moodvariant"
  | "virtuality"
  | "partitivity"
  | "operator"
  | "bundleStart"
  | "bundleEnd";

interface AttributeData {
  certainty?: Certainty;
  elvl?: Elvl;
  logic?: Logic;
  mood?: Mood[];
  moodvariant?: MoodVariant;
  virtuality?: Virtuality;
  partitivity?: Partitivity;
  operator?: Operator;
  bundleStart?: boolean;
  bundleEnd?: boolean;
}

interface StatementEditorAttributes {
  modalTitle: string;
  entityType?: ActantType;
  data: AttributeData;
  handleUpdate: (data: AttributeData) => void;
  loading?: boolean;
}

export const StatementEditorAttributes: React.FC<StatementEditorAttributes> = ({
  modalTitle,
  entityType,
  data,
  handleUpdate,
  loading,
}) => {
  const [modalData, setModalData] = useState<AttributeData>(data);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleModalDataChange = (
    attributeName: AttributeName,
    newValue:
      | Certainty
      | Elvl
      | Logic
      | Mood[]
      | MoodVariant
      | Virtuality
      | Partitivity
      | Operator
      | boolean
  ) => {
    const newModalData = Object.assign({}, modalData);

    switch (attributeName) {
      case "logic":
        newModalData["logic"] = newValue as Logic;
        break;
      case "certainty":
        newModalData["certainty"] = newValue as Certainty;
        break;
      case "elvl":
        newModalData["elvl"] = newValue as Elvl;
        break;
      case "mood":
        newModalData["mood"] = newValue as Mood[];
        break;
      case "moodvariant":
        newModalData["moodvariant"] = newValue as MoodVariant;
        break;
      case "virtuality":
        newModalData["virtuality"] = newValue as Virtuality;
        break;
      case "partitivity":
        newModalData["partitivity"] = newValue as Partitivity;
        break;
      case "operator":
        newModalData["operator"] = newValue as Operator;
        break;
      case "bundleStart":
        newModalData["bundleStart"] = newValue as boolean;
        break;
      case "bundleEnd":
        newModalData["bundleEnd"] = newValue as boolean;
        break;
    }

    setModalData(newModalData);
  };

  const handleAcceptClick = () => {
    const updateModalData: AttributeData = {};
    Object.keys(modalData).forEach((modelDataKey) => {
      const modelDataValue = modalData[modelDataKey as AttributeName];

      if (modelDataValue) {
        //@ts-ignore
        updateModalData[modelDataKey as AttributeName] = modelDataValue;
      }
    });
    handleUpdate(updateModalData);
  };

  const handleOpenModalClick = () => {
    setModalOpen(true);
  };

  const handleCancelClick = () => {
    setModalOpen(false);
  };

  const renderModal = (showModal: boolean) => {
    return (
      <Modal
        key="edit-modal"
        showModal={showModal}
        disableBgClick={false}
        onClose={() => {
          handleCancelClick();
        }}
      >
        <ModalHeader
          title={modalTitle}
          color={entityType ? Entities[entityType].color : undefined}
        />
        <ModalContent>
          <StyledAttributeModalContent>
            {modalData.elvl && (
              <AttributeRow
                value={modalData.elvl}
                multi={false}
                items={elvlDict}
                label="Epistemic level"
                onChangeFn={(newValue: string | string[]) => {
                  handleModalDataChange("elvl", newValue as Elvl);
                }}
                attributeName="elvl"
              ></AttributeRow>
            )}
            {modalData.logic && (
              <AttributeRow
                value={modalData.logic}
                multi={false}
                items={logicDict}
                label="Logical level"
                attributeName="logic"
                onChangeFn={(newValue: string | string[]) => {
                  handleModalDataChange("logic", newValue as Logic);
                }}
              ></AttributeRow>
            )}
            {modalData.certainty && (
              <AttributeRow
                value={modalData.certainty}
                multi={false}
                items={certaintyDict}
                label="Certainty"
                attributeName="certainty"
                onChangeFn={(newValue: string | string[]) => {
                  handleModalDataChange("certainty", newValue as Certainty);
                }}
              ></AttributeRow>
            )}
            {modalData.mood && (
              <AttributeRow
                value={modalData.mood}
                multi={true}
                items={moodDict}
                label="Mood"
                attributeName="mood"
                onChangeFn={(newValue: string | string[]) => {
                  handleModalDataChange("mood", newValue as Mood[]);
                }}
              ></AttributeRow>
            )}
            {modalData.moodvariant && (
              <AttributeRow
                value={modalData.moodvariant}
                multi={false}
                items={moodVariantsDict}
                label="Mood Variant"
                attributeName="moodvariant"
                onChangeFn={(newValue: string | string[]) => {
                  handleModalDataChange("moodvariant", newValue as MoodVariant);
                }}
              ></AttributeRow>
            )}
            {modalData.virtuality && (
              <AttributeRow
                value={modalData.virtuality}
                multi={false}
                items={virtualityDict}
                label="Virtuality"
                attributeName="virtuality"
                onChangeFn={(newValue: string | string[]) => {
                  handleModalDataChange("virtuality", newValue as Virtuality);
                }}
              ></AttributeRow>
            )}
            {modalData.partitivity && (
              <AttributeRow
                value={modalData.partitivity}
                multi={false}
                items={partitivityDict}
                label="Partitivity"
                attributeName="partitivity"
                onChangeFn={(newValue: string | string[]) => {
                  handleModalDataChange("partitivity", newValue as Partitivity);
                }}
              ></AttributeRow>
            )}
            {modalData.operator && (
              <AttributeRow
                value={modalData.operator}
                multi={false}
                items={operatorDict}
                label="Logical Operator"
                attributeName="operator"
                onChangeFn={(newValue: string | string[]) => {
                  handleModalDataChange("operator", newValue as Operator);
                }}
              ></AttributeRow>
            )}
            {modalData.operator && (
              <CheckboxRow
                value={modalData.bundleStart ? modalData.bundleStart : false}
                label="Bundle start"
                attributeName="bundleStart"
                onChangeFn={(newValue: boolean) => {
                  handleModalDataChange("bundleStart", newValue as boolean);
                }}
              />
            )}
            {modalData.operator && (
              <CheckboxRow
                value={modalData.bundleEnd ? modalData.bundleEnd : false}
                label="Bundle end"
                attributeName="bundleEnd"
                onChangeFn={(newValue: boolean) => {
                  handleModalDataChange("bundleEnd", newValue as boolean);
                }}
              />
            )}
          </StyledAttributeModalContent>
        </ModalContent>

        <ModalFooter>
          <ButtonGroup>
            <Button
              key="cancel"
              label="Cancel"
              color="warning"
              onClick={() => {
                handleCancelClick();
              }}
            />
            <Button
              key="submit"
              label="Apply changes"
              color="primary"
              onClick={() => {
                handleAcceptClick();
              }}
            />
          </ButtonGroup>
        </ModalFooter>
        <Loader show={loading} />
      </Modal>
    );
  };

  return (
    <>
      {renderModal(modalOpen)}

      <StyledAttributeWrapper>
        <Tooltip
          attributes={[
            <TooltipAttributeRow
              attributeName="elvl"
              value={data.elvl}
              items={elvlDict}
            />,
            <TooltipAttributeRow
              attributeName="logic"
              value={data.logic}
              items={logicDict}
            />,
            <TooltipAttributeRow
              attributeName="certainty"
              value={data.certainty}
              items={certaintyDict}
            />,
            <TooltipAttributeRow
              attributeName="mood"
              value={data.mood}
              items={moodDict}
            />,
            <TooltipAttributeRow
              attributeName="moodvariant"
              value={data.moodvariant}
              items={moodVariantsDict}
            />,
            <TooltipAttributeRow
              attributeName="virtuality"
              value={data.virtuality}
              items={virtualityDict}
            />,
            <TooltipAttributeRow
              attributeName="partitivity"
              value={data.partitivity}
              items={partitivityDict}
            />,
            <TooltipAttributeRow
              attributeName="operator"
              value={data.operator}
              items={operatorDict}
            />,
          ]}
        >
          <div>
            <Button
              key="settings"
              icon={<MdSettings />}
              color="primary"
              onClick={() => {
                handleOpenModalClick();
              }}
            />
          </div>
        </Tooltip>
      </StyledAttributeWrapper>
    </>
  );
};
