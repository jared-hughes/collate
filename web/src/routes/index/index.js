import { h, Component } from 'preact';
import style from './style';

export default class Index extends Component {
	state = {
		time: Date.now(),
		count: 10
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
							<td><button> Upload New File </button></td>
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
