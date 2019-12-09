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
	
	output = async () => {
		// let data = new FormData();
		// data.append('bundles', this.state.bundles)
		const data = {"bundles": this.state.bundles};
		const response = await fetch(resolve(`/profiles/${this.state.profileID}/collate`), {
			method: "POST",
			headers: {
      	'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
		// https://blog.jayway.com/2017/07/13/open-pdf-downloaded-api-javascript/
		const newBlob = new Blob([await response.blob()], {type: "application/pdf"});
		const href = window.URL.createObjectURL(newBlob);
		let link = document.createElement("a");
		link.href = href;
		link.download = "file.pdf";
		link.click();
		setTimeout(function(){
	    // For Firefox it is necessary to delay revoking the ObjectURL
	    window.URL.revokeObjectURL(data);
	  }, 100);
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
							<button onClick={this.output}>
								Download output PDF
							</button>
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
