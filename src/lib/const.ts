export const priorityOptions = [
    { label: 'low', 'text': 'Low', 'value': 'low' },
    { label: 'medium', 'text': 'Medium', 'value': 'medium' },
    { label: 'high', 'text': 'High', 'value': 'high' },
];

export const triggersList = [
    { 'text': 'Status', 'value': 'status' },
    { 'text': 'All Subtasks Completed', 'value': 'subtasks_completed' },
    { 'text': 'Assignee', 'value': 'assignee' },
    { 'text': 'Clinic', 'value': 'clinic' },
    { 'text': 'Task has been moved to this board', 'value': 'task_moved_to_board' }
];


export const actionsList = [
    { 'text': 'Mark as complete', 'value': 'mark_as_complete' },
    { 'text': 'Assign to', 'value': 'assign_to' },
    { 'text': 'Change status', 'value': 'change_status' },
    { 'text': 'Move to board', 'value': 'move_to_board' },
    { 'text': 'Create a new subtask', 'value': 'add_subtask' },
    { 'text': 'Add comment', 'value': 'add_comment' },
    { 'text': 'Change due date', 'value': 'change_due_date' },
    { 'text': 'Change task description', 'value': 'change_description' },
    { 'text': 'Create task', 'value': 'create_task' },
    { 'text': 'Create message', 'value': 'create_message' },

]

export const mainBoards = [
    {id:"cm3vhdw9n00002e5apwuup18x"},
    {id:"cm3vheqc400072e5axwx44uwb"},
    {id:"cm3vhfsn2000e2e5a58y4v4nz"},
    {id:"cm3vhgmjw000l2e5akoupba0u"},
]

export const roles = ['client','va','admin']

export const defaultStatusesName = ["Pending","Active","Complete"]

export const defaultTaskCompleteData = {
    id: "",
    name: "",
    taskLink: "",
    description: "",
    isCompleted: false,
    statusId: "",
    priority: "",
    dueDate: null,
    createdBy: "",
    createdAt: null,
    updatedAt: null,
    assigneeId: "",
    updatedById: null,
    parentId: null,
    clinicId: "",
    subtasks: [],
    status: {
      id: "",
      createdBy: "",
      createdAt: null,
      name: "",
      boardId: "",
      position: 0,
      isComplete: false,
    },
    assignedTo: {
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      isAdmin: false,
      isDeleted: false,
      password: "",
      createdAt: null,
      isLogin: false,
      lastLogin: null,
      roles: [],
      profileImage: "",
      readNotifications: [],
    },
    clinic: {
      id: "",
      createdBy: "",
      name: "",
      description: null,
      meta: null,
      createdAt: null,
    },
  };

export const appAccess = {
  mainboards: {
    specialactions: ['va','admin'],
    dnd: ['va','admin'],
  }
}