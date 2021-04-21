let nullFormat = {
	isLoading: false,
	data: null,
	error: false,
};
let ArrayFormat = {
	isLoading: false,
	data: [],
	error: false,
};

export const ProjectInitialStates = {
	project: ArrayFormat,
};

export const GetOneProjectStates = {
	getOneProject: nullFormat,
};

export const TaskMessageInitialStates = {
	taskMessage: nullFormat,
};

export const ProjectTasksInitialStates = {
	projectTasks: ArrayFormat,
};

export const ProjectMembersInitialStates = {
	projectMembers: ArrayFormat,
};
