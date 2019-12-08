import { h, Component } from 'preact';
import style from './style.css';
import BundleFileList from '../bundleFileList';

export default class BundleList extends Component {
	onDragEnd = (result) => {
		// dropped outside the list
		if (!result.destination) return;
		
		const items = reorder(
			this.props.bundles,
			result.source.index,
			result.destination.index
		)
		
		this.setState({items: items});
	}
	
	onModifyFiles = (bundleID, files) => {
		const newBundles = this.props.bundles.map((bundle) => {
			if (bundle.bundleID === bundleID) {
				return {...bundle, files};
			}
			return bundle;
		})
		this.props.onModifyBundles(newBundles);
		if (files.length == 0) {
			this.deleteBundle(bundleID);
		}
	}
	
	deleteBundle = (bundleID) => {
		this.props.onModifyBundles(this.props.bundles.filter(b => b.bundleID !== bundleID))
	}
	
	addBundle = () => {
		this.props.onModifyBundles([...this.props.bundles, {
			bundleID: Math.max(this.props.bundles.map(bundle => bundle.bundleID)) + 1,
			name: "Untitled Bundle",
			quantity: 1,
			files: []
		}])
	}
	
	changeQuantity = (bundleID, quantity) => {
		this.props.onModifyBundles(this.props.bundles.map((bundle) => {
			if (bundle.bundleID === bundleID) {
				return {...bundle, quantity: quantity};
			}
			return bundle;
		}))
	}

	render = ({files, bundles}, {}) => {
		console.log("files", files);
		return (
			<div>
				<ul>
					{
						bundles.map(({bundleID, name, quantity, files: bundleFiles}) => (
							<li>
								{name}&nbsp;
								(quantity:
									<input type="number" min={1} value={quantity} class={style.smallInput}
										onChange={(e) => {this.changeQuantity(bundleID, parseInt(e.target.value))}}
									>
									</input>
								)
								<button onClick={() => {
									this.deleteBundle(bundleID);
								}}>
									Delete
								</button>
								<BundleFileList allFiles={files} files={bundleFiles}
									onModifyFiles={(files)=>{this.onModifyFiles(bundleID, files)}}
								/>
							</li>
						))
					}
				</ul>
				{
					files.length > 0 && (
						<button onClick={this.addBundle}>
							Add Bundle
						</button>
					)
				}
			</div>
		)
	}
}
