import { h, Component } from 'preact';
import style from './style';
import FileList from '../../components/fileList';
import BundleList from '../../components/bundleList';
import { resolve } from '../../config.js';
import { showPDF, showImage } from '../../utils/utils.js';

export default class Index extends Component {
	state = {
		files: [],
		bundles: []
	};
	
	onModifyFiles = (files) => {
		this.setState({files: files})
	}
	
	onModifyBundles = (bundles) => {
		this.setState({bundles: bundles})
	}
	
	output = async () => {
		let data = new FormData();
		data.append('bundles', JSON.stringify(this.state.bundles));
		for (const {file, fileID} of this.state.files) {
			data.append('files', file, fileID);
		}
		// const data = {"bundles": this.state.bundles, "files": this.state.files};
		const response = await fetch(resolve(`/collate`), {
			method: "POST",
			body: data
		})
		// https://blog.jayway.com/2017/07/13/open-pdf-downloaded-api-javascript/
		const blob = await response.blob();
		showPDF(blob);
	}

	render = ({}, {files, bundles}) => {
		console.log("files", this.state.files);
		console.log("bundles", this.state.bundles);
		return (
			<div class={style.profile}>
				<h1> Collate </h1>
				<FileList files={files} onModifyFiles={this.onModifyFiles}/>
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
