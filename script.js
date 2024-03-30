function uploadFile() {
  var fileInput = document.getElementById("pdfFile");
  var file = fileInput.files[0];

  var reader = new FileReader();
  reader.onload = function (event) {
    var fileData = event.target.result;
    var params = {
      operation: "upload", // Specify the operation as 'upload'
      fileName: file.name,
      fileData: fileData,
    };
    invokeLambdaFunction(params);
  };
  reader.readAsDataURL(file);
}

function deleteFile(fileName) {
  var params = {
    operation: "delete", // Specify the operation as 'delete'
    fileName: fileName,
  };
  invokeLambdaFunction(params);
}

function getFile(fileName) {
  var params = {
    operation: "get", // Specify the operation as 'get'
    fileName: fileName,
  };
  invokeLambdaFunction(params);
}

function invokeLambdaFunction(params) {
  // Replace 'YOUR_API_GATEWAY_URL' with the actual URL of your deployed API Gateway
  var apiGatewayUrl =
    "https://ocsds81ezd.execute-api.us-east-1.amazonaws.com/Developement";

  fetch(apiGatewayUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  })
    .then((response) => response.json())
    .then((data) => {
      if (params.operation === "get") {
        // Handle displaying or using the retrieved file data
        console.log("Retrieved file data: ", data);
      } else {
        // Handle success message for other operations
        console.log("Operation successful. Response: ", data);
        document.getElementById("message").innerHTML = "Operation successful!";
        // Refresh file list after delete
        if (params.operation === "delete") {
          refreshFileList();
        }
      }
    })
    .catch((error) => {
      console.error("Error processing operation: ", error);
      document.getElementById("message").innerHTML =
        "Error processing operation!";
    });
}

function refreshFileList() {
  // Fetch and display the updated file list
  fetchFileList().then((files) => {
    var fileListElement = document.getElementById("file-list");
    fileListElement.innerHTML = "";
    files.forEach((file) => {
      var listItem = document.createElement("li");
      listItem.textContent = file;
      fileListElement.appendChild(listItem);
    });
  });
}

function fetchFileList() {
  // Fetch the list of files from the Lambda function
  var params = {
    operation: "listFiles", // Specify the operation as 'listFiles' to fetch the file list
  };
  return fetchLambdaFunction(params);
}

function fetchLambdaFunction(params) {
  // Replace 'YOUR_API_GATEWAY_URL' with the actual URL of your deployed API Gateway
  var apiGatewayUrl =
    "https://ocsds81ezd.execute-api.us-east-1.amazonaws.com/Developement";

  return fetch(apiGatewayUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  })
    .then((response) => response.json())
    .then((data) => {
      return data.files || [];
    })
    .catch((error) => {
      console.error("Error fetching data from Lambda function: ", error);
      return [];
    });
}

// Load the initial file list on page load
document.addEventListener("DOMContentLoaded", function () {
  refreshFileList();
});
