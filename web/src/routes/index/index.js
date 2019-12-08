import { h, Component } from 'preact';
import style from './style';

export default class Index extends Component {
	state = {
		profileID: 1,
		files: [
			{
				filename: "File A",
				file_id: "b86c50cb2dc2420a8efac02a8e650006"
			},
			{
				filename: "File B",
				file_id: "4a7f14c0f0dc4ce09ad1d5aee0851a87"
			},
			{
				filename: "File C",
				file_id: "14a81e6fd6224c63a56eba7a3fc2be8e"
			},
		],
		bundles: [
			{
				name: "Bundle A",
				quantity: 1,
				files: [
					"b86c50cb2dc2420a8efac02a8e650006",
					"4a7f14c0f0dc4ce09ad1d5aee0851a87"
				]
			},
			{
				name: "Bundle B",
				quantity: 2,
				files: [
					"14a81e6fd6224c63a56eba7a3fc2be8e"
				]
			}
		]
	};

	render({}, { time, count }) {
		return (
			<div class={style.profile}>
				<h1> Collate </h1>
				<div>
					<table class="files-table">
						<tr>
							<td class={style.filePreview}><img src="assets/Test A-0.jpg"/></td>
							<td class="file-name">File A</td>
							<td class="file-delete"><button>Delete</button></td>
							<td class="file-download"><button> Download </button></td>
						</tr>
						<tr>
							<td class={style.filePreview}><img src="assets/Test B-0.jpg"/></td>
							<td class="file-name">File B</td>
							<td class="file-delete"><button>Delete</button></td>
							<td class="file-download"><button> Download </button></td>
						</tr>
						<tr>
							<td></td>
							<td>
							<form>
								<input type="file" name="file" id="fileInput" required></input>
								<input type="reset" value="Upload" onClick={async (event)=>{
									let fileInput = document.querySelector("#fileInput");
									let data = new FormData();
									data.append('file', fileInput.files[0])
									const resp = await fetch("/profiles/example", {
										method: 'POST',
										body: data
									})
									const json = await resp.json();
									if (json.error) {
										console.error(json.error);
									} else {
										console.log("file_id", json.file_id);
									}
								}}></input>
							</form>
							</td>
							<td></td>
							<td></td>
						</tr>
					</table>
				</div>
				<div>
					<ul>
						<li> Bundle A (quantity:<input type="number" min={1} value={1} class={style.smallInput}></input>) <button>Delete</button>
							<ul>
								<li> File A </li>
								<li> File B </li>
								<li> <button> Add File </button> </li>
							</ul>
						</li>
						<li> Bundle B (quantity:<input type="number" min={1} value={1} class={style.smallInput}></input>) <button>Delete</button>
							<ul>
								<li> File B </li>
								<li> <button> Add File </button> </li>
							</ul>
						</li>
						<li> <button> New Bundle </button> </li>
					</ul>
				</div>
				<div>
					<button> Download output PDF </button>
				</div>
				{/*
				<!-- 1. upload/rename pdfs -->
				<!-- 2. setup bundles + counts -->
				<!-- 3. download -->
				*/}
			</div>
		);
	}
}
