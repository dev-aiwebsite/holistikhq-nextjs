import React, { useEffect, useState } from 'react';
import { triggersList } from '@lib/const';
import { SelectScrollable } from '../ui/select';
import UserList from '../UserList';
import { useAppStateContext } from '@app/context/AppStatusContext';
import { AutomationTriggerType } from '@lib/types';


type TriggerCardProps = {
  boardId:string;
  triggerType?: string;
  value: string;
  onChange?: (t:AutomationTriggerType)=>void
}

const TriggerCard = ({boardId,triggerType,value,onChange}:TriggerCardProps) => {
  // Handler for trigger selection change
  const {appState} = useAppStateContext()

  const handleOnTriggerChange = (v:string) => {
    if (onChange && triggerType) {
      onChange({ type: v, value: "" });
    }
  };
  
  const handleOnValueChange = (v:string)=>{
    if (onChange && triggerType) {
      onChange({ type: triggerType, value:v});
    }
  }

  const boardData = appState.currentUser.boards.find(board => board.id == boardId)
  let boardStatusOptions = [
      { text: 'Set Status', value: "" },
  ];

  if (boardData && boardData.BoardStatus) {
    const statuses = boardData.BoardStatus;
    boardStatusOptions = statuses.map(status => ({
        text: status.name,
        value: status.id,
    }));
}

console.log(boardId, boardData, 'triggercard board data')

  return (
    <div className="bg-white rounded-xl shadow-lg ring-1 ring-gray-200 p-6">
      {/* Trigger selection dropdown */}
      <SelectScrollable onChange={handleOnTriggerChange} value={triggerType} options={triggersList} />

      {/* Conditional rendering based on the selected trigger */}
      <div className="flex items-center flex-row px-3 pt-4">
        {triggerType === 'assignee' && (
          <>
            <span className="w-8">Is:</span>
            <UserList className="!w-full !max-w-[100%]" value={value} onChange={handleOnValueChange}/>
          </>
        )}
        {triggerType === 'status' && (
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

export default TriggerCard;
