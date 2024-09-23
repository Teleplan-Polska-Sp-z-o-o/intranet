// Define the types for the message data that the worker expects
interface WorkerData {
  url: string;
  stream: boolean;
  token: string | undefined;
  formData: any;
}

// Define the response types for success and error messages
interface SuccessMessage {
  status: "success";
  response: (string | number | null)[][];
}

interface ErrorMessage {
  status: "error";
  message: string;
}

// Add an event listener for the message event
self.onmessage = async (e: MessageEvent<WorkerData>) => {
  const { url, token, formData } = e.data;

  try {
    const fd = new FormData();
    fd.append("stream", JSON.stringify(formData.stream));
    fd.append("fileName", JSON.stringify(formData.fileName));
    fd.append("fileDir", JSON.stringify(formData.fileDir));
    // Conditionally append values, using 'undefined' if the value is undefined
    fd.append(
      "worksheetNameOrIndex",
      formData.worksheetNameOrIndex !== undefined
        ? JSON.stringify(formData.worksheetNameOrIndex)
        : ""
    );
    fd.append("rowCount", formData.rowCount !== undefined ? JSON.stringify(formData.rowCount) : "");
    fd.append(
      "columnCount",
      formData.columnCount !== undefined ? JSON.stringify(formData.columnCount) : ""
    );

    // Prepare the headers (add Bearer token if provided)
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Perform the fetch request
    const response = await fetch(`${url}/read`, {
      method: "POST",
      body: fd,
      headers,
    });

    // Check for successful response
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;

      try {
        // Try to extract error message from the response body (if it's JSON)
        const errorResponse = await response.json();
        if (errorResponse && errorResponse.message) {
          errorMessage += ` - ${errorResponse.message}`;
        }
      } catch (e) {
        // If response is not JSON, fallback to plain text or original message
        const errorText = await response.text();
        if (errorText) {
          errorMessage += ` - ${errorText}`;
        }
      }

      // Throw the error with detailed message
      throw new Error(errorMessage);
    }

    // Parse the response JSON data
    const responseData = await response.json();
    const responseContent: (string | number | null)[][] = responseData.data;

    // Send the success message with the data back to the main thread
    const message: SuccessMessage = { status: "success", response: responseContent };
    postMessage(message);
  } catch (error: any) {
    // Send an error message back to the main thread if an error occurs
    const errorMessage: ErrorMessage = { status: "error", message: error.message };
    postMessage(errorMessage);
  }
};
