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
    case "TRepairModelObj":
      builder = new EfficiencyModels.EfficiencyBuilder<EfficiencyTypes.TRepairModelObj>(
        parsedRawTransactions,
        parsedModelsObj,
        "TT_REPAIR"
      );
      break;

    case "TRegistrationModelObj":
      builder = new EfficiencyModels.EfficiencyBuilder<EfficiencyTypes.TRegistrationModelObj>(
        parsedRawTransactions,
        parsedModelsObj,
        "TT_REGISTRATION"
      );
      break;

    case "TCleaningModelObj":
      builder = new EfficiencyModels.EfficiencyBuilder<EfficiencyTypes.TCleaningModelObj>(
        parsedRawTransactions,
        parsedModelsObj,
        "TT_CLEANING"
      );
      break;

    case "TFinalTestModelObj":
      builder = new EfficiencyModels.EfficiencyBuilder<EfficiencyTypes.TFinalTestModelObj>(
        parsedRawTransactions,
        parsedModelsObj,
        "TT_FINAL_TEST"
      );
      break;

    case "TPackingModelObj":
      builder = new EfficiencyModels.EfficiencyBuilder<EfficiencyTypes.TPackingModelObj>(
        parsedRawTransactions,
        parsedModelsObj,
        "TT_PACKING"
      );
      break;

    default:
      throw new Error(`Unknown model type: ${modelType}`);
  }

  const processedData = builder.getProcessedData();

  // Send the processed data back to the main thread
  postMessage({ processedData });
});
