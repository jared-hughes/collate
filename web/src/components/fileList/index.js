import { h, Component } from 'preact';
import style from './style.css';
import { resolve } from '../../config.js';

export default class FileList extends Component {
	uploadFile = async (profileID, file, files, onModifyFiles) => {
		let data = new FormData();
		data.append('file', file)
		const pendingKey = file.name + Date.now();
		onModifyFiles([
			...files,
			{filename: file.name, fileID: pendingKey, status: "pending"}
		]);
		try {
			const resp = await fetch(resolve(`/profiles/${profileID}`), {
				method: 'POST',
				body: data
			})
			const json = await resp.json();
			console.log("fileID", json);
			onModifyFiles(this.props.files.map((file) => {
				if (file.fileID == pendingKey) {
					return {
						...file,
						fileID: json.fileID,
						status: "success"
					}
				}
				return file;
			}));
		} catch {
			onModifyFiles(this.props.files.map((file) => {
				if (file.fileID == pendingKey) {
					return {
						...file,
						status: "failed"
					}
				}
				return file;
			}));
		}
	}
	
	deleteFile = (profileID, fileID, files, onModifyFiles, serverToo) => {
		if (serverToo) {
			fetch(resolve(`/profiles/${profileID}/${fileID}`), {
				method: 'DELETE'
			})
		}
		// do this whether or not it is successful server-side
		// the resource might as well stay there
		onModifyFiles(this.props.files.filter(
			(file) => file.fileID !== fileID)
		)
	}
	
	viewFile = (profileID, fileID) => {
		window.open(resolve(`/profiles/${profileID}/${fileID}/file.pdf`))
	}
	
	render = ({files, profileID, onModifyFiles}, {}) => {
		return (
			<div>
				<table class="files-table">
					{
						files.map(({filename, fileID, status}) => (
							<tr key={fileID}>
								<td className={style.filePreview}>
									{ status==="success" ? (
											<img src={`/profiles/${profileID}/${fileID}/preview.jpg`}/>
										) : 
										(
											status==="failed" ? (
												<div> X </div>
											) : (
												<div> O </div>
											)
										)
									}
								</td>
								<td class="file-name">{filename}</td>
								<td class="file-delete" disabled={status==="pending"} onClick={
									(e) => {
										this.deleteFile(profileID, fileID, files, onModifyFiles, status!=="failed");
									}
								}>
									<button>Delete</button></td>
								<td class="file-download">
									<button disabled={status!=="success"} onClick={
										(e) => {
											this.viewFile(profileID, fileID);
										}
									}> Download </button>
								</td>
							</tr>
						))
					}
					<tr>
						<td></td>
						<td>
						<form>
							<input type="file" name="file" id="fileInput" accept="application/pdf" required></input>
							<input type="reset" value="Upload" onClick={async (event)=>{
								const fileInput = document.querySelector("#fileInput");
								const file = fileInput.files[0];
								this.uploadFile(profileID, file, files, onModifyFiles);
							}}></input>
						</form>
						</td>
						<td></td>
						<td></td>
					</tr>
				</table>
			</div>
		)
	}
}
