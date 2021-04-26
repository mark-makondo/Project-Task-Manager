const { google } = require('googleapis');
const fs = require('fs');
const googlePrivateKey = require('../googlePrivateKey.json');
const mime = require('mime-types');
const async = require('async');

/**
 * We need to call the 'init' method first before we can
 * use the other specfic methods exluding the methods that
 * contains multiple methods inside.
 */
class GoogleDrive {
	constructor() {
		this.drive = google.drive('v3');
		this.email = googlePrivateKey.client_email;
		this.key = googlePrivateKey.private_key;
		this.scope = ['https://www.googleapis.com/auth/drive'];
		this.auth = null;
	}

	/**
	 * Used for initializing google service connection.
	 */
	async init() {
		try {
			let token = new google.auth.JWT(this.email, googlePrivateKey, this.key, this.scope, null);

			await token.authorize();

			this.auth = token;
			// console.log('User permission granted.', token);
			return true;
		} catch (error) {
			console.error(error.message);
			return error.message;
		}
	}

	/**
	 * @param {String?} targetFolderId optional if we want to be specific.
	 * @param {String?} trashed include the trashed items if true.
	 */
	async listFiles(folderOnly = false, targetFolderId = null, trashed = false) {
		try {
			let q = null;

			if (targetFolderId) q = "'" + targetFolderId + "' in parents and trashed=false";
			if (!trashed) q = 'trashed=false';
			if (folderOnly) q = "mimeType = 'application/vnd.google-apps.folder'";

			let response = await this.drive.files.list({
				auth: this.auth,
				pageSize: 10,
				q,
			});

			return response.data.files;
		} catch (error) {
			console.error(error.message);
			return error.message;
		}
	}

	/**
	 * @param {String} id file/folder id.
	 * @param {String} type 'permission' or 'capabilities'.
	 * @param {String} permissionId needed for type 'permission'. The email of the owner of the permission.
	 */
	async verifyCapabilitiesOrPermission(id, type, permissionId = null) {
		try {
			if (type === 'capabilities') {
				let response = await this.drive.files.get({
					auth: this.auth,
					fileId: id,
					fields: 'capabilities',
				});
				return response.data;
			} else if (type === 'permission') {
				let response = await this.drive.permissions.get({
					auth: this.auth,
					fileId: id,
					permissionId,
				});
				return response.data;
			}
		} catch (error) {
			console.error(error.message);
			return error.message;
		}
	}

	/**
	 * @param {String} folderName folder name.
	 */
	async createFolder(folderName) {
		try {
			let requestBody = {
				name: folderName,
				mimeType: 'application/vnd.google-apps.folder',
			};

			let response = await this.drive.files.create({
				auth: this.auth,
				requestBody,
				fields: 'id',
			});

			return {
				message: `${folderName} was created successfully to google drive.`,
				result: response.data,
			};
		} catch (error) {
			console.error(error.message);
			return error.message;
		}
	}

	/**
	 * @param {String} filename name of the file.
	 * @param {String} filepath path of the file.
	 * @param {String} extension valid extention of the file
	 */
	async createFile(filename, filepath, extension) {
		try {
			let requestBody = {
				name: filename,
				mimeType: mime.contentType(extension),
			};

			let media = {
				body: fs.createReadStream(filepath),
				mimeType: mime.contentType(extension),
			};

			let response = await this.drive.files.create({
				auth: this.auth,
				requestBody,
				media,
			});

			return {
				message: `${filename} was created successfully to google drive.`,
				result: response.data,
			};
		} catch (error) {
			console.error(error.message);
			return error.message;
		}
	}

	/**
	 * @param {String} id file/folder to be moved.
	 * @param {String} folderId the designated folder.
	 */
	async moveResource(id, folderId) {
		try {
			let { data } = await this.drive.files.update({
				auth: this.auth,
				fileId: id,
				fields: 'parents',
			});

			let prevParent;

			if (data.parents.length === 1) prevParent = data.parents;
			else prevParent = data.parents.join(',');

			let move = await this.drive.files.update({
				auth: this.auth,
				fileId: id,
				addParents: folderId,
				removeParents: prevParent,
				fields: 'id, parents',
			});

			return move.data;
		} catch (error) {
			console.error(error.message);
			return error.message;
		}
	}

	/**
	 * @param {String} id file/folder id to be deleted
	 */
	async deleteResource(id) {
		try {
			let response = await this.drive.files.delete({
				auth: this.auth,
				fileId: id,
			});

			return { message: 'Resource deleted successfully', result: response.status };
		} catch (error) {
			console.error(error.message);
			return error.message;
		}
	}

	/**
	 * @param {String} id file/folder to be targeted.
	 * @param {String?} type user, anyone.
	 * @param {String?} role reader, commenter, writer, fileOrganizer, organizer/owner.
	 * @param {String?} email valid google email for google drive.
	 * @param {String?} moveToNewOwnersRoot default is 'false' if ommited.
	 */
	async createPermission(id, type = null, role = null, email = null, root = null) {
		try {
			let transferOwnership = false;
			let sendNotificationEmail = false;
			let moveToNewOwnersRoot;

			if (!root) moveToNewOwnersRoot = false;
			else moveToNewOwnersRoot = true;

			if (!type) type = 'anyone';
			if (!role) role = 'reader';

			if (role === 'user' || role === 'group') {
				emailAddress = email;
			} else if (role === 'owner') {
				transferOwnership = true;
				sendNotificationEmail = true;
			}
			let requestBody = {
				role,
				type,
				emailAddress: email,
			};

			let response = await this.drive.permissions.create({
				auth: this.auth,
				fileId: id,
				requestBody,
				transferOwnership,
				sendNotificationEmail,
				moveToNewOwnersRoot,
			});

			return {
				message: 'Permission to the file was created successfully.',
				result: response.data,
			};
		} catch (error) {
			console.error(error.message);
			return error.message;
		}
	}

	/**
	 * Update a permission to a specific folder/file.
	 *
	 * @param {String} id file/folder to be targeted.
	 * @param {String} permissionId the email of the owner of the permission that youre going to change.
	 * @param {String} role reader, commenter, writer, fileOrganizer, organizer/owner.
	 */
	async updatePermission(id, permissionId, role) {
		try {
			let requestBody = {
				role,
			};

			let response = await this.drive.permissions.update({
				auth: this.auth,
				fileId: id,
				permissionId,
				requestBody,
			});

			return response.data;
		} catch (error) {
			console.error(error.message);
			return error.message;
		}
	}

	/**
	 * @param {String} id id of the file/folder
	 */
	async generatePublicUrl(id) {
		try {
			const response = await this.drive.files.get({
				auth: this.auth,
				fileId: id,
				fields: 'webViewLink, webContentLink',
			});

			return response.data;
		} catch (error) {
			console.error(error.message);
			return error.message;
		}
	}

	/**
	 * @param {String} name file/folder name to be deleted
	 * @returns
	 */
	async findNameAndDelete(name) {
		try {
			await list.forEach((file) => {
				if (file.name === name) {
					let id = file.id;
					this.deleteResource(id);
				}
			});

			return { message: `${name} has been deleted.` };
		} catch (error) {
			console.error(error.message);
			return error.message;
		}
	}

	/**
	 * Used for testing, all the non-user owned file or folders will be deleted.
	 */
	async findAllAndDelete() {
		try {
			let lists = await this.listFiles();

			for await (let file of lists) {
				let res = await this.verifyCapabilitiesOrPermission(file.id, 'capabilities');

				if (res.capabilities.canDelete === true) {
					await this.deleteResource(file.id);
					console.log('deleting', file.id);
				}
				// console.log('creating url for files tht cant be deleted.');
				// await this.generatePublicUrl(file.id);
			}
			console.log('done, showing lists');
			console.log(lists);
			console.log('process done');
			return { message: `deletion success` };
		} catch (error) {
			console.error(error);
			return error.message;
		}
	}

	/**
	 * @param {String} targetId file id
	 * @param {String} shortcutName name of the shortcut
	 */
	async createShortcut(targetId, shortcutName) {
		try {
			shortcutMetadata = {
				name: shortcutName,
				mimeType: 'application/vnd.google-apps.shortcut',
				shortcutDetails: {
					targetId: targetId,
				},
			};

			let result = await this.drive.files.create({
				resource: shortcutMetadata,
				fields: 'id,name,mimeType,shortcutDetails',
			});

			return { result, message: `${result.name} shortcut has been created.` };
		} catch (error) {
			console.error(error.message);
			return error.message;
		}
	}

	/**
	 * @param {String} targetResourceId file/folder id.
	 * @param {String} parentFolderId the folder where you want to move your folder/files.
	 * @param {String} type 'anyone', 'user',
	 * @param {String} role 'owner', 'fileOrganizer', 'writer', 'commenter', 'reader'.
	 * @param {String} email only applicable if type is 'user' || 'group'.
	 */
	async moveResourceWithPermission(targetResourceId, parentFolderId, type, role, email) {
		try {
			await this.moveResource(targetResourceId, parentFolderId);
			await this.createPermission(targetResourceId, type, role, email);
		} catch (error) {
			console.error(error.message);
			return error.message;
		}
	}

	/**
	 * @param {String} parentFolderId the project folder id.
	 * @param {String} folderName the folder to be created.
	 */
	async createFolderAndMove(parentFolderId, folderName) {
		try {
			var fileMetadata = {
				name: folderName,
				parents: [parentFolderId],
				mimeType: 'application/vnd.google-apps.folder',
			};

			let res = await this.drive.files.create({
				auth: this.auth,
				resource: fileMetadata,
				fields: 'id',
			});

			return { result: res, message: `${folderName} has been moved to ${parentFolderId}.` };
		} catch (error) {
			console.error(error.message);
			return error.message;
		}
	}

	/**
	 * @param {String} parentTaskFolderId the task folder id that was already created.
	 * @param {String} originalname the full name of the file that includes the extention.
	 * @param {String} filepath filepath of the file.
	 * @param {String} mimeType the extension of the file.
	 */
	async createFileAndMove(parentTaskFolderId, originalname, filepath, mimeType) {
		try {
			let fileMetadata = {
				name: originalname,
				mimeType,
				parents: [parentTaskFolderId],
			};

			let media = {
				body: fs.createReadStream(filepath),
				mimeType,
			};

			let response = await this.drive.files.create({
				auth: this.auth,
				resource: fileMetadata,
				media,
				fields: 'id',
			});

			let fileId = response.data.id;

			let publicUrl = await this.generatePublicUrl(fileId);

			let formatToSend = {
				fileId,
				publicUrl,
			};

			return formatToSend;
		} catch (error) {
			console.error(error.message);
			return error.message;
		}
	}

	/**
	 * This method gives ownerEmail and companyEmail a writer role to the root or parent
	 * folder name, this is necessary to be able to make the folder visible to their
	 * google drive. And whenever a project folder is created we automaticaly give the companyEmail
	 * the owner role.
	 *
	 * @param {String} folderName the folder to be created.
	 * @param {String} parentFolderName the name format for the parent foldername.
	 * @param {String} ownerEmail the email of the current user logged in.
	 * @param {String} companyEmail the owner of the project folder that we are going to make.
	 */
	async createFolderAndMoveWithPermission(folderName, parentFolderName, ownerEmail, companyEmail) {
		try {
			await this.init();

			let emailIsOnePerson = companyEmail === ownerEmail;
			let type = 'user';

			// create a project folder all the tasks folder will be designated here.
			let createFolder = await this.createFolder(folderName);
			let targetFolderId = createFolder.result.id;

			let list = await this.listFiles(true);

			// check if the 'root' folder that was created already exists.
			for await (let file of list) {
				if (file.name === parentFolderName) {
					let parentFolderId = file.id;

					if (!emailIsOnePerson) {
						await this.createPermission(parentFolderId, type, 'writer', companyEmail);
					}

					await this.moveResourceWithPermission(targetFolderId, parentFolderId, type, 'owner', companyEmail);

					return {
						result: targetFolderId,
						message: `${parentFolderName} found and ${folderName} has been moved.`,
					};
				}
			}

			// create the 'root' folder of the user, all the projects that the user will create will go here.
			let createParentFolder = await this.createFolder(parentFolderName);
			let parentFolderId = createParentFolder.result.id;

			if (!emailIsOnePerson) {
				await this.createPermission(parentFolderId, type, 'owner', ownerEmail, true);
				await this.createPermission(parentFolderId, type, 'writer', companyEmail);
				await this.moveResourceWithPermission(targetFolderId, parentFolderId, type, 'owner', companyEmail);
			} else {
				await this.createPermission(parentFolderId, type, 'owner', ownerEmail, true);
				await this.moveResourceWithPermission(targetFolderId, parentFolderId, type, 'owner', companyEmail);
			}

			return {
				result: targetFolderId,
				message: `${parentFolderName} was created and ${folderName} has been moved.`,
			};
		} catch (error) {
			console.error(error.message);
			return error.message;
		}
	}

	/**
	 * Combine all the permission into a one request. Useful for minimizing the number of sent request to the
	 * google server, since they have a limit.
	 *
	 * @param {String} fileId The folder or file that we are going to give a batch of permission.
	 * @param {Array} permissions Array of permission following the format for requestBody or resource paramater.
	 */
	async batchPermissionRequest(fileId, permissions) {
		try {
			// example of permissions
			// let permissions = [
			// 	{
			// 		type: type,
			// 		role: 'writer',
			// 		emailAddress: ownerEmail,
			// 	},
			// 	{
			// 		type: type,
			// 		role: 'writer',
			// 		emailAddress: companyEmail,
			// 	},
			// ];
			async.eachSeries(
				permissions,
				async (permission) => {
					await this.drive.permissions.create({
						auth: this.auth,
						resource: permission,
						fileId: fileId,
						fields: 'id',
					});
				},
				(err) => {
					console.error(err);
				}
			);
		} catch (error) {
			coonsole.error(error.message);
			return error.message;
		}
	}
}

module.exports = GoogleDrive;

/**
 * for google drive development only! remove when finished developing.
 */
const googleDriveTesting = async () => {
	try {
		// test
		let google = new GoogleDrive();
		await google.init();

		// let test = await google.drive.files.get({
		// 	auth: google.auth,
		// 	fileId: '1zBEbdANZUAwkkxWzbM9ilMknYy_JDcYC',
		// 	supportsAllDrives: true,
		// });

		// let id = '1uHVQTMm6WaGiSFuqd1vm_304_XFwfp5m';
		// let parentFolderName = 'PTM-606ed6d16e35644970789c28';
		// let folderName = 'testing';

		// await google.createFolderAndMoveWithPermission(folderName, parentFolderName);
		// await google.createPermission;

		// let link = await google.generatePublicUrl(id);

		// let res = await google.deleteResource(id);

		// let get = await google.verifyCapabilitiesOrPermission(id, 'capabilities');

		// let lists = await google.listFiles();

		// await google.findAllAndDelete();

		// console.log(lists);
	} catch (error) {
		console.error(error);
	}
};

// googleDriveTesting();
