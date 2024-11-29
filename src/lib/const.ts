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
    { 'text': 'Assign to', 'value': 'assignee' },
    { 'text': 'Change status', 'value': 'status' },
    { 'text': 'Mark as complete', 'value': 'isComplete' },
    { 'text': 'Create a new subtask', 'value': 'subtask' },
    { 'text': 'Add comment', 'value': 'comment' },
    { 'text': 'Move to board', 'value': 'boardId' },
    { 'text': 'Change due date', 'value': 'dueDate' },
    { 'text': 'Change task description', 'value': 'description' },
    { 'text': 'Create task', 'value': 'newTask' },
    { 'text': 'Create message', 'value': 'newMessage' },

]

export const mainBoards = [
    {id:"cm3vhdw9n00002e5apwuup18x"},
    {id:"cm3vheqc400072e5axwx44uwb"},
    {id:"cm3vhfsn2000e2e5a58y4v4nz"},
    {id:"cm3vhgmjw000l2e5akoupba0u"},
]

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