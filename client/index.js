import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Camera from 'react-camera';
import axios from 'axios';
const style = {
	preview: {
		position: 'relative'
	},
	captureContainer: {
		position: 'absolute',
		justifyContent: 'center',
		width: '50%',
		height: '50%'
	},
	captureButton: {
		backgroundColor: '#fff',
		borderRadius: '50%',
		height: 100,
		width: 100,
		color: '#000',
		margin: 20
	},
	captureImage: {
		width: '100px',
		height: '100px'
	}
};
class Main extends Component {
	constructor() {
		super();
		this.state = {
			file: null
		};
		this.takePicture = this.takePicture.bind(this);
	}
	submitFile = (event) => {
		event.preventDefault();
		const formData = new FormData();
		formData.append('file', this.state.file);
		axios
			.post(`/test-upload`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				},
				body: formData
			})
			.then((response) => {
				// handle your response;
				console.log('response', response.data.ETag);
			})
			.catch((error) => {
				console.error(error);
			});
	};
	comparePicture() {
		const res = axios.get('/compare-images');
	}
	takePicture() {
		this.camera.capture().then((data) => {
			this.setState({ file: data });

			this.img.src = URL.createObjectURL(data);
			this.img.onload = () => {
				URL.revokeObjectURL(this.src);
			};
			var photo = {
				uri: data,
				type: 'image/jpeg',
				name: 'photo.jpg'
			};

			var uploadForm = new FormData();
			uploadForm.userKey = this.state.userKey;
			uploadForm.append('image', photo);
		});
	}
	render() {
		return (
			<div id="main">
				<div id="navbar">
					<div>Upload Images With Camera...</div>
				</div>
				<div id="container">
					<form onSubmit={this.submitFile}>
						<button type="button" onClick={this.takePicture}>
							Take Photo
						</button>
						<div style={style.container}>
							<Camera
								style={style.captureImage}
								ref={(cam) => {
									this.camera = cam;
								}}
							>
								{/* <div style={style.captureContainer} onClick={this.takePicture}>
								<div style={style.captureButton} />
							</div> */}
							</Camera>
							<img
								style={style.captureImage}
								ref={(img) => {
									this.img = img;
								}}
							/>
							<button type="submit">Send</button>
							<button type="button" onClick={this.comparePicture}>
								Compare
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

ReactDOM.render(<Main />, document.getElementById('app'));
