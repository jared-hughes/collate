import { h, Component } from 'preact';
import style from './style.css';
import { resolve } from '../../config.js';
import { showPDF } from '../../utils/utils.js';

function humanFilename(pdfname) {
	let dotsplit = pdfname.split(".");
	if (dotsplit.length > 1) {
		dotsplit.splice(-1, 1);
	}
	return dotsplit.join(".");
}

export default class FileList extends Component {
	state = {
		nextID: 1
	}
	
	addFile = async (file) => {
		const filenumID = this.state.nextID;
		this.setState({nextID: filenumID+1})
		const fileID = "file-" + filenumID;
		this.props.onModifyFiles([
			...this.props.files,
			/* name kept separate from file.name for different human names */
			{file, fileID, name: humanFilename(file.name)}
		]);
		let data = new FormData();
		data.append('file', file);
		const response = await fetch(resolve(`/get_preview`), {
			method: "POST",
			body: data
		})
		const blob = await response.blob();
	  const previewURL = window.URL.createObjectURL(blob);
		this.props.onModifyFiles(this.props.files.map((file) =>
			(file.fileID == fileID) ? {...file, preview: previewURL} : file
		))
	}
	
	deleteFile = (fileID) => {
		this.props.onModifyFiles(this.props.files.filter(
			(file) => file.fileID !== fileID)
		)
	}
	
	viewFile = (fileID) => {
		for (const file of this.props.files) {
			if (file.fileID === fileID) {
				showPDF(file.file)
				return;
			}
		}
	}
	
	render = ({files, onModifyFiles}, {}) => {
		return (
			<div>
				<table class="files-table">
					{
						files.map(({file, fileID, preview, name}) => (
							<tr key={fileID}>
								<td className={style.filePreview}>
									{ preview ? (
											<img src={preview}/>
										) : 
										(
											<div> O </div>
										)
									}
								</td>
								<td class="file-name">{name}</td>
								<td class="file-delete" disabled={status==="pending"} onClick={
									(e) => {
										this.deleteFile(fileID);
									}
								}>
									<button>Delete</button></td>
								<td class="file-download">
									<button disabled={status!=="success"} onClick={
										(e) => {
											this.viewFile(fileID);
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
							<input type="reset" value="Add" onClick={(event)=>{
								const fileInput = document.querySelector("#fileInput");
								const file = fileInput.files[0];
								this.addFile(file);
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
