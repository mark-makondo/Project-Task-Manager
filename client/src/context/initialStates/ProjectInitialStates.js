let dataFormat = {
	isLoading: false,
	data: null,
	error: false,
};

export const ProjectInitialStates = {
	project: dataFormat,
};

export const GetOneProjectStates = {
	getOneProject: dataFormat,
};

export const TaskMessageInitialStates = {
	taskMessage: dataFormat,
};

export const MembersInitialStates = {
	members: dataFormat,
};

export const ProjectTasksInitialStates = {
	projectTasks: {
		isLoading: false,
		data: [],
		error: false,
	},
};
