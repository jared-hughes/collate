import { h, Component } from 'preact';
import style from './style';
import FileList from '../../components/fileList';
import { resolve } from '../../config.js';

export default class Index extends Component {
	state = {
		profileID: undefined,
		files: [],
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
	
	componentWillMount = () => {
		fetch(resolve("/profiles"), {
			method: "POST"
		}).then((resp) => resp.json())
		.then(({profileID}) => {
			this.setState({profileID: profileID});
		})
	}
	
	onModifyFiles = (files) => {
		console.log("newfiles", files);
		this.setState({files: files})
	}

	render = ({}, {profileID, files, bundles}) => {
		return (
			<div class={style.profile}>
				<h1> Collate </h1>
				<FileList profileID={profileID} files={files} onModifyFiles={this.onModifyFiles}/>
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
