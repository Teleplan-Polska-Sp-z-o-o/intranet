import { PackedModels } from "./Models";

addEventListener("message", (event) => {
  const { rawTransactions, modelsObj, planObj } = event.data;

  const parsedRawTransactions = JSON.parse(rawTransactions);
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
