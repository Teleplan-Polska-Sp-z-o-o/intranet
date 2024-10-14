import { PackedModels } from "./Models";

addEventListener("message", (event) => {
  const { rawTransactions, modelsObj, planObj } = event.data;

  // Function to convert ArrayBuffer back to string
  function arrayBufferToString(buffer: ArrayBuffer): string {
    const decoder = new TextDecoder();
    return decoder.decode(buffer);
  }

  // Convert ArrayBuffer to JSON string
  const rawTransactionsString = arrayBufferToString(rawTransactions);

  const parsedRawTransactions = JSON.parse(rawTransactionsString);
  const parsedModelsObj = JSON.parse(modelsObj);
  const parsedPlanObj = JSON.parse(planObj);

  // Perform the PackedBuilder task
  const packedRows = new PackedModels.PackedBuilder(
    parsedRawTransactions,
    parsedModelsObj,
    parsedPlanObj
  ).tablePackedRows;

  // Post the result back to the main thread
  postMessage({ packedRows });
});
