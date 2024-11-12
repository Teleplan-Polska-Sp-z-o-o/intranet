import { EfficiencyModels } from "./Models";

// Add a listener for receiving messages from the main thread
addEventListener("message", (event) => {
  const { rawTransactions, models, ttKey, group } = event.data;

  // Parse the received serialized data
  const parsedRawTransactions = JSON.parse(rawTransactions);
  const parsedModelsObj = JSON.parse(models);
  const parsedTT = ttKey ? JSON.parse(ttKey) : "";
  const parsedGROUP = group ? JSON.parse(group) : "";

  // Dynamically process the correct type of model
  const builder = EfficiencyModels.libertyFactory(parsedGROUP);

  if (typeof builder === typeof EfficiencyModels.CosmeticEfficiencyBuilder) {
    const processedData = new builder(
      parsedRawTransactions,
      parsedModelsObj,
      parsedTT
    ).getProcessedData();
    postMessage({ processedData });
  }
  // Send the processed data back to the main thread
});
