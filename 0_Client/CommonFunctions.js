// DESCRIPTION: Common functions that other files can import. 

/*	Posts <data_to_send> to ross-dev.live:5000/<api_endpoint> using XMLHTTP
	Returns the response or an error
*/
export const postData = async (api_endpoint, data_to_send) => {

	return new Promise((resolve, reject) => {

		const xhr = new XMLHttpRequest();
		xhr.open('POST', 'http://ross-dev.live:5000' + api_endpoint, true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(JSON.stringify(data_to_send));

		xhr.onload = () => {
		try {
			const response = JSON.parse(xhr.response); 
			if (response.result == 'success') {
				resolve(response);
			} else {
				console.log(response);
				reject("Problem detecting puzzle, please try again.");
			}
		} catch(error) {
			reject("Problem detecting puzzle, please try again.");
		}
		};

		xhr.onerror = e => {
			reject('Upload failed - are both the client and server online?');
		};

		xhr.ontimeout = e => {
			reject('Upload timed out');
		};

		if (xhr.upload) {
			xhr.upload.onprogress = ({ total, loaded }) => {
				let uploadProgress = (loaded / total) * 100;
				uploadProgress = uploadProgress.toFixed(2);
				console.log(uploadProgress + "% uploaded");
				if(uploadProgress == 100) {
					console.log("Uploaded and sent to server!");
				}
			};
		}
	});
}



/*	Posts data supplied to the api_endpoint supplied using fetch
	Returns the response
	TODO: Add error checking
*/
export async function fetchData(api_endpoint, data) {

	const url = 'http://ross-dev.live:5000' + api_endpoint;
	
	const response = await fetch(url, {
		method: 'POST', 
		headers: {
		'Content-Type': 'application/json'
		},
		body: JSON.stringify(data),
	});

	return await response.json(); 
}