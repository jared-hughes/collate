import { h, Component } from 'preact';
import style from './style.css';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};

export default class BundleList extends Component {
	getFile = (fileID) => {
		for (const file of this.props.allFiles) {
			if (file.fileID == fileID) {
				return file;
			}
		}
		// not found --- doesn't exist
		this.removeBundleFile(fileID);
		return {filename:"Deleting..."};
	}
	
	getContent = (fileID) => this.getFile(fileID).filename
	
	onDragEnd = (result) => {
		// dropped outside the list
		if (!result.destination) return;
		
		const items = reorder(
			this.props.files,
			result.source.index,
			result.destination.index
		)
		
		this.props.onModifyFiles(items);
	}
	
	addBundleFile = (fileID) => {
		this.props.onModifyFiles([...this.props.files, this.getFile(fileID).fileID]);
	}
	
	removeBundleFile = (index) => {
		let files = this.props.files;
		files.splice(index, 1);
		this.props.onModifyFiles(files);
	}

	render = ({files, allFiles}, {}) => {
    return (
			<>
	      <DragDropContext onDragEnd={this.onDragEnd}>
	        <Droppable droppableId="droppable">
	          {(provided, snapshot) => (
	            <ul
	              {...provided.droppableProps}
	              ref={provided.innerRef}
	            >
	              {files.map((fileID, index) => (
									/* use fileID+index in case of repeat files in bundle */
	                <Draggable key={fileID+index} draggableId={fileID+index} index={index}>
	                  {(provided, snapshot) => (
	                    <li
	                      ref={provided.innerRef}
	                      {...provided.draggableProps}
	                      {...provided.dragHandleProps}
	                    >
	                      {this.getContent(fileID)}
												<button onClick={()=>{
													this.removeBundleFile(index);
												}}>
													Delete
												</button>
	                    </li>
	                  )}
	                </Draggable>
	              ))}
	              {provided.placeholder}
	            </ul>
	          )}
	        </Droppable>
	      </DragDropContext>
				<ul><li>
					<form>
						<select name="select-file" id="select-file">
							{
								allFiles.map(({filename, fileID}) => (
									<option value={fileID}>
										{filename}
									</option>
								))
							}
						</select>
						<input type="reset" value="Add" onClick={(event)=>{
							const fileSelect = document.querySelector("#select-file");
							const fileID = fileSelect.value;
							this.addBundleFile(fileID);
						}}></input>
					</form>
				</li></ul>
			</>
    );
	}
}
