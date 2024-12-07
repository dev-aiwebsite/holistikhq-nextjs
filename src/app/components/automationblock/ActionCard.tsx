import React, { useMemo, useState } from 'react';
import { actionsList, triggersList } from '@lib/const';
import { SelectScrollable } from '../ui/select';
import UserList from '../UserList';
import { useAppStateContext } from '@app/context/AppStatusContext';

export type ActionDataType = {
  type: string,
  value: string
}
type ActionCardProps = {
  boardId: string;
  actionType?: string;
  value: string;
  onChange: (t: ActionDataType) => void
}
const ActionCard = ({ boardId, actionType, value, onChange }: ActionCardProps) => {
  const { boards } = useAppStateContext()
  if (!boardId) return
  const board = useMemo(() => {
    return boards.find(b => b.id == boardId)
  }, [boards, boardId])
  if (!board) return

  let boardStatusOptions = [
    { text: 'Set Status', value: "" },
  ];

  const statuses = board.BoardStatus;
  if (statuses) {
    boardStatusOptions = statuses.map(status => ({
      text: status.name,
      value: status.id,
    }));
  }



  // Handler for trigger selection change
  const handleOnActionChange = (v: string) => {
    if (onChange && v) {
      onChange({ type: v, value: "" });
    }
  };

  const handleOnValueChange = (v: string) => {
    if (onChange && actionType) {
      onChange({ type: actionType, value: v });
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg ring-1 ring-gray-200 p-6">
      {/* Trigger selection dropdown */}
      <SelectScrollable onChange={handleOnActionChange} value={actionType} options={actionsList} />

      {/* Conditional rendering based on the selected trigger */}
      <div className="flex items-center flex-row px-3 pt-4">
        {actionType === 'assign_to' && (
          <>
            <span className="w-8">Is:</span>
            <UserList className="!w-full !max-w-[100%]" value={value} onChange={handleOnValueChange} />
          </>
        )}
        {actionType === 'change_status' && (
          <>
            <span className="w-8">Is:</span>
            <SelectScrollable className="w-72"
              options={boardStatusOptions}
              onChange={handleOnValueChange}
              value={value}
            />
          </>
        )}
        {/* Add more conditions for other trigger types */}
      </div>
    </div>
  );
};

export default ActionCard;
