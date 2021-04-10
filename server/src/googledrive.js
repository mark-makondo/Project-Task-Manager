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
	 * Only use this with the method that does not include multiple methods inside.
	 * For example the createFolderAndMoveWithPermission since it already contains
	 * the init method inside.
	 *
	 * @returns
	 */
	async init() {
		try {
			let token = new google.auth.JWT(this.email, googlePrivateKey, this.key, this.scope, null);

			await token.authorize();

			this.auth = token;

			return console.log('User permission granted.');
		} catch (error) {
			console.error(error.message);
			return error.message;
		}
	}

	/**
	 * @param {String?} targetFolderId optional if we want to be specific
	 * @param {String?} trashed include the trashed items if true
	 * @returns
	 */
	async listFiles(targetFolderId = null, trashed = false) {
		try {
			let q = null;

			if (targetFolderId) q = "'" + targetFolderId + "' in parents and trashed=false";
			if (!trashed) q = 'trashed=false';

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
	 * @param {String} id
	 * @param {String} type 'permission' or 'capabilities'.
	 * @param {String} permissionId needed for type 'permission'. The email of the owner of the permission.
	 * @returns
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
	 * @returns
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
	 * @returns
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
	 * @returns
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
	 * @returns
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
	 *  @param {String?} moveToNewOwnersRoot default is 'false' if ommited.
	 * @returns
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
	 * @returns
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
	 * @returns
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
	 * @param {String} targetResourceId file/folder id.
	 * @param {String} parentFolderId the folder where you want to move your folder/files.
	 * @param {String} type 'anyone', 'user',
	 * @param {String} role 'owner', 'fileOrganizer', 'writer', 'commenter', 'reader'.
	 * @param {String} email only applicable if type is 'user' || 'group'.
	 * @returns
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
	 * @returns
	 */
	async createFolderAndMove(parentFolderId, folderName) {
		try {
			let createFolder = await this.createFolder(folderName);
			let targetFolderId = createFolder.result.id;

			this.moveResource(targetFolderId, parentFolderId);

			return { result: targetFolderId, message: `${folderName} has been moved to ${parentFolderId}.` };
		} catch (error) {
			console.error(error.message);
			return error.message;
		}
	}

	/**
	 * The method already calls the 'init()' method inside.
	 * Used for moving the uploaded files from user to the designated tasks folder.
	 *
	 * @param {String} parentFolderName the folder name that was already created.
	 * @param {String} filename the file to be created.
	 * @param {String} filepath filepath of the file.
	 * @param {String} extension the extension of the file.
	 * @returns
	 */
	async createFileAndMove(parentFolderName, filename, filepath, extension) {
		try {
			await this.init();

			let { result } = await this.createFile(filename, filepath, extension);

			let list = await this.listFiles();
			await list.forEach((file) => {
				if (file.name === parentFolderName) {
					let parentId = file.id;
					this.moveResource(result.id, parentId);
				}
			});

			let publicUrl = await this.generatePublicUrl(result.id);

			return { publicUrl, result, message: `${filename} has been moved to ${parentFolderName}` };
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
	 * @returns
	 */
	async createFolderAndMoveWithPermission(folderName, parentFolderName, ownerEmail, companyEmail) {
		try {
			await this.init();

			let emailIsOnePerson = companyEmail === ownerEmail;
			let type = 'user';

			let createFolder = await this.createFolder(folderName);
			let targetFolderId = createFolder.result.id;

			let list = await this.listFiles();

			for await (let file of list) {
				if (file.name === parentFolderName) {
					let parentFolderId = file.id;

					if (!emailIsOnePerson) {
						await this.createPermission(parentFolderId, type, 'writer', companyEmail);
					}

					await this.moveResourceWithPermission(targetFolderId, parentFolderId, type, 'owner', companyEmail);

					return { result: targetFolderId, message: `${parentFolderName} found and ${folderName} has been moved.` };
				}
			}

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

			return { result: targetFolderId, message: `${parentFolderName} was created and ${folderName} has been moved.` };
		} catch (error) {
			console.error(error.message);
			return error.message;
		}
	}

	/**
	 * Combine all the permission into a one request. Usefull for minimizing the number of sent request to the
	 * google server, since they have a limit.
	 *
	 * @param {String} fileId The folder or file that we are going to give a batch of permission.
	 * @param {Array} permissions Array of permission following the format for requestBody or resource paramater.
	 * @returns
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

// const test = async () => {
// 	let google = new GoogleDrive();
// 	await google.init();

// 	let id = '1dN_bTaaQqsT7lvYsqUs-7O9wd3TgKVER';
// 	// await google.deleteResource(id);
// 	let parentFolderName = 'PTM-606ed6d16e35644970789c28';
// 	let folderName = 'testing';

// 	// await google.createFolderAndMoveWithPermission(folderName, parentFolderName);
// 	// await google.createPermission;
// 	// let link = await google.generatePublicUrl(id);
// 	// console.log(link);
// 	// await google.deleteResource(id);
// 	// console.log(test);

// 	// let capa = await google.verifyCapabilitiesOrPermission('1p72Gkq4Mrz98ayuWwJT8pG8QXOQ53S6f', 'capabilities');
// 	let list = await google.listFiles();
// 	console.log(list);
// };

// test();
