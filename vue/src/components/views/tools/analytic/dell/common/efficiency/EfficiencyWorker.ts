import { EfficiencyModels } from "./Models";

// Add a listener for receiving messages from the main thread
addEventListener("message", (event) => {
  const { rawTransactions, models } = event.data;

  // Parse the received serialized data
  const parsedRawTransactions = JSON.parse(rawTransactions);
  const parsedModels = JSON.parse(models);

  const builder = new EfficiencyModels.EfficiencyBuilder(parsedRawTransactions, parsedModels);

  const processedData = builder.getProcessedData();

  // Send the processed data back to the main thread
  postMessage({ processedData });
});
