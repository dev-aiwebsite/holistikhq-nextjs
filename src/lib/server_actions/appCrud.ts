"use client"

import { Conversation, Message } from "@prisma/client";
import { BoardAddType, MessageAddType, TypeBoardComplete } from "@lib/types";
import { _addBoard, _addBoardStatus, _addConversation, _addMessage, _getConversations } from "./database_crud";


export const ADD_MSG_TO_CONVO = async (data: MessageAddType) => {
  const res = {
    success: false,
    message: 'Failed to add message',
    conversation: null as Conversation | null,
    newMessage: null as Message | null
  };

  try {
    // Ensure conversation exists or create a new one
    const getConvoRes = await _getConversations(data.conversationId)
    res.conversation = getConvoRes.conversations[0]

    if (!res.conversation) {
      if (!data?.users || data.users.length == 0) {
        res.message = 'No recipients';
        return res;
      }
      !data.users.includes(data.createdBy) && data.users.push(data.createdBy)
      const addConvoRes = await _addConversation({
        id: data.conversationId,
        name: data.conversationId,
        createdBy: data.createdBy,
        userIds: data.users
      });

      res.conversation = addConvoRes.conversation;
      res.message = addConvoRes.message;
    }

    if (res.conversation) {
      res.message = getConvoRes.message
      delete data.users
      data.conversationId = res.conversation.id
      const addMsgRes = await _addMessage(data);
      console.log(data.conversationId, res.conversation.id, 'conversation ids')


      res.newMessage = addMsgRes.messages;
      res.success = true;
    }

    return res

  } catch (error) {
    res.message = `Error: ${error}`;
  }

  return res;
};

export const ADD_BOARD = async (data: BoardAddType) => {
  const res = {
    success: false,
    message: 'Failed to add board',
    board: null as TypeBoardComplete | null
  };
  try {
    const addBoardRes = await _addBoard(data);
    
    res.board = addBoardRes.board;
    res.success = addBoardRes.success;
    res.message = addBoardRes.message;

    return res
  } catch (error) {
    res.message = `Error: ${error}`;
  }
  return res;
}