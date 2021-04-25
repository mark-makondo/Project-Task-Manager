import React, { useEffect, useContext, useState } from 'react';

// ui
import ProfileModal from './ProfileModal.js';

// helper
import Query from '../../../helper/query.js';

// context
import Context from '../../../context/Context.js';
import { UpdateUserInfo, ChangeUserPassword } from '../../../context/actions/user/UserAction.js';

const ProfileModalContainer = ({ isActive, setIsActive }) => {
	const [user, setUser] = useState({});
	const [isEditable, setIsEditable] = useState(false);
	const [isChangingPassword, setIsChangingPassword] = useState(false);
	const [input, setInput] = useState({
		name: '',
		currentPassword: '',
		newPassword: '',
	});

	const {
		userState: {
			user: { isLoading, data, error },
		},
		userDispatch,
	} = useContext(Context);

	useEffect(() => {
		data && setUser(data);
	}, [user, data]);

	// responsible for getting the data of inputs.
	const inputOnChangeHandler = (e) => {
		setInput({
			...input,
			[e.target.name]: e.target.value,
		});
	};

	//#region edit name handler
	const nameSaveClickHandler = (e) => {
		let formatToUpdate = {
			name: input.name,
		};

		UpdateUserInfo(formatToUpdate, setIsEditable)(userDispatch);
	};

	//#endregion

	//#region  change password handler
	const changePassSubmitHandler = (e) => {
		e.preventDefault();

		let id = user?._id;

		let formatToUpdate = {
			currentPassword: input.currentPassword,
			newPassword: input.newPassword,
		};

		ChangeUserPassword({ id, formatToUpdate }, setIsChangingPassword)(userDispatch);

		setInput({
			currentPassword: '',
			newPassword: '',
		});
		console.log(formatToUpdate);
	};

	//#endregion

	// current modal active modifier
	useEffect(() => {
		let profileModalQuery = Query.profileModalQuery();

		if (profileModalQuery) {
			if (isActive) {
				profileModalQuery.classList.add('active');
			} else {
				profileModalQuery.classList.remove('active');
			}

			profileModalQuery.addEventListener('click', (e) => {
				if (e.target === profileModalQuery) {
					setIsActive(false);
				}
			});
		}
	}, [isActive, setIsActive]);

	if (isActive) {
		return (
			<ProfileModal
				isLoading={isLoading}
				user={user}
				error={error}
				input={input}
				nameSaveClickHandler={nameSaveClickHandler}
				inputOnChangeHandler={inputOnChangeHandler}
				changePassSubmitHandler={changePassSubmitHandler}
				isEditable={isEditable}
				setIsEditable={setIsEditable}
				isChangingPassword={isChangingPassword}
				setIsChangingPassword={setIsChangingPassword}
			/>
		);
	}
	return <></>;
};

export default ProfileModalContainer;
