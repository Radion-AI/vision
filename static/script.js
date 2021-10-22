

var buffer = [];
const BUFF_LEN = 5;
if (localStorage.getItem("imagelist") != null) {
	bufferstring = localStorage.getItem('imagelist')
	buffer = JSON.parse(bufferstring)
	for(i = 0; i < buffer.length; i++) {
		console.log(buffer[i])
	}
}

var images = [];
function image_select() {
	var image = document.getElementById('image').files;
	var numleft = 3 - images.length - image.length;
	if (numleft < 0) {
		alert("Only upto 3 images are allowed at a time.");
	}
	else {
		for (i = 0; i < image.length; i++) {
			if (check_duplicate(image[i].name)) {
				images.push({
					"name" : image[i].name,
					"url" : URL.createObjectURL(image[i]),
					"file" : image[i],
				})
			} else 
			{
				alert(image[i].name + " is already added to the list");
			}
		}
	document.getElementById('form').reset();
	document.getElementById('container').innerHTML = image_show();
	}
	}

	function image_show() {
		var image = "";
		images.forEach((i) => {
			image += `<div class="card" style="max-width : 300px">
			<button type="button" class="close" aria-label="Close">
				<span aria-hidden="true" onclick="delete_image(`+ images.indexOf(i) +`)" >&times;</span>
			</button>
			<img class="card-img-top img-fluid w-lg-75 w-md-50 w-100" alt="100%x180" style = "margin : auto; width: 220px !important; height: 220px !important" src="` + i.url + `" data-holder-rendered="true" >
			<div class="card-body">
			</div>
			<div class="card-footer">
				<small class="text-muted">` + i.name + `</small>
			</div>
			</div>`
		})
		return image;
	}

	function delete_image(e) {
		images.splice(e, 1);
		document.getElementById('container').innerHTML = image_show();
	}

	function check_duplicate(name) {
	var image = true;
	if (images.length > 0) {
		for (e = 0; e < images.length; e++) {
			if (images[e].name == name) {
				image = false;
				break;
			}
		}
	}
	return image;
	}

$(function() {
	console.log('hello')
	$('#upload').on('click', function(e) {
		var form_data = new FormData();
		for (var i = 0; i < images.length; i++) {
			form_data.append("files[]", images[i].file);
		}
		if (images.length <= 0) {
			alert("Please choose an image first");
		}
		else {
			e.preventDefault()
			$.ajax({
				url: "/background_process_test", 
				type: 'POST',
				data: form_data,
				processData: false,
				contentType: false,
				success: function(response) {
					console.log('images uploaded');
					console.log(response);
					response = JSON.parse(JSON.stringify(response));
					let imagesbkp = JSON.parse(JSON.stringify(images));
					// storeImages(response, images);
					renderOutput(response, images);
					images.length = 0;
					document.getElementById('container').innerHTML = image_show();
				}
			});
			return false;
		}	  
	});
});

function storeImages(output, images) {

	const toBase64 = file => new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
	});

	images.forEach((i) => {

		obj = {
			"file" : toBase64(i.file),
			"inference" : output[images.indexOf(i)].inference,
			"confidence" : output[images.indexOf(i)].confidence
		}
		if(buffer.length >= BUFF_LEN) {
			buffer.pop();
		}
		buffer.splice(0, 0, obj);
	})
	console.log("items in buffer are", buffer);
	localStorage.setItem('imagelist', JSON.stringify(buffer));
}

function renderOutput(output, images) {
	html = `<div class="card-header d-flex justify-content-center">
	 <h2 style = "text-align : center" ><b>Result</b></h2>
	</div>
	<div class="container-fluid mt-3 mb-3">
  <div class="card-deck justify-content-center">`
	images.forEach((i) => {
		console.log('output')
		console.log(output[images.indexOf(i)]);
		html += `<div class="card" style="max-width : 150px">
		<button type="button" class="close" aria-label="Close">
		</button>
		<img class="card-img-top" alt="100%x180" src="` + i.url + `"  data-holder-rendered="true" >
			<div class="card-body"></div>
			<div class="card-footer">
				<p>` + output[images.indexOf(i)].inference + `</p>
				<p> (` + output[images.indexOf(i)].confidence + `%)</p>

			</div>
		</div>
		`
	})
	html += `</div></div>`
	document.getElementById('result_container').innerHTML = html
}

function renderPreviousImages(output, images) {
	html = `<div class="card-header d-flex justify-content-center">
	 <h2 style = "text-align : center" ><b>Previously uploaded images</b></h2>
	</div>
	<div class="container-fluid mt-3 mb-3">
  <div class="card-deck justify-content-center">`
	images.forEach((i) => {
		console.log('output')
		console.log(output[images.indexOf(i)]);
		html += `<div class="card" style="max-width : 150px">
		<button type="button" class="close" aria-label="Close">
		</button>
		<img class="card-img-top" alt="100%x180" src="` + i.url + `"  data-holder-rendered="true" >
			<div class="card-body"></div>
			<div class="card-footer">
				<p>` + output[images.indexOf(i)].inference + `</p>
			</div>
		</div>
		`
	})
	html += `</div></div>`
	document.getElementById('prev_container').innerHTML = html
}



