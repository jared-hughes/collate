import { h, Component } from 'preact';
import style from './style';
import FileList from '../../components/fileList';
import BundleList from '../../components/bundleList';
import { resolve } from '../../config.js';

export default class Index extends Component {
	state = {
		profileID: undefined,
		files: [],
		bundles: []
	};
	
	componentDidMount = () => {
		fetch(resolve("/profiles"), {
			method: "POST"
		}).then((resp) => resp.json())
		.then(({profileID}) => {
			this.setState({profileID: profileID});
		})
	}
	
	onModifyFiles = (files) => {
		this.setState({files: files})
	}
	
	onModifyBundles = (bundles) => {
		this.setState({bundles: bundles})
	}

	render = ({}, {profileID, files, bundles}) => {
		console.log("files", this.state.files);
		console.log("bundles", this.state.bundles);
		return (
			<div class={style.profile}>
				<h1> Collate </h1>
				<FileList profileID={profileID} files={files} onModifyFiles={this.onModifyFiles}/>
				<BundleList files={files} bundles={bundles} onModifyBundles={this.onModifyBundles}/>
				{
					bundles.length > 0 && bundles[0].files.length > 0 && (
						<div>
							<button> Download output PDF </button>
						</div>
					)
				}
				{/*
				<!-- 1. upload/rename pdfs -->
				<!-- 2. setup bundles + counts -->
				<!-- 3. download -->
				*/}
			</div>
		);
	}
}
