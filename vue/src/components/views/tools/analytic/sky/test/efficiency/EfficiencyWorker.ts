import { EfficiencyModels } from "./Models";
import { EfficiencyTypes } from "./Types";

// Add a listener for receiving messages from the main thread
addEventListener("message", (event) => {
  const { rawTransactions, modelsObj, modelType } = event.data;

  // Parse the received serialized data
  const parsedRawTransactions = JSON.parse(rawTransactions);
  const parsedModelsObj = JSON.parse(modelsObj);

  // Dynamically process the correct type of model
  let builder;

  switch (modelType) {
    case "TTestModelObj":
      builder = new EfficiencyModels.EfficiencyBuilder<EfficiencyTypes.TTestModelObj>(
        parsedRawTransactions,
        parsedModelsObj,
        "TT_TEST"
      );
      break;

    default:
      throw new Error(`Unknown model type: ${modelType}`);
  }

  const processedData = builder.getProcessedData();

  // Send the processed data back to the main thread
  postMessage({ processedData });
});
