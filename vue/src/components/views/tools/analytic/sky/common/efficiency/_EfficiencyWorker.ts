// import { EfficiencyModels } from "./Models";
// import { EfficiencyTypes } from "./Types";

// // Add a listener for receiving messages from the main thread
// addEventListener("message", (event) => {
//   const { rawTransactions, modelsObj, modelType } = event.data;

//   // Parse the received serialized data
//   const parsedRawTransactions = JSON.parse(rawTransactions);
//   const parsedModelsObj = JSON.parse(modelsObj);

//   // Dynamically process the correct type of model
//   let builder;

//   switch (modelType) {
//     case "TCosmModelObj":
//       builder = new EfficiencyModels.EfficiencyBuilder<EfficiencyTypes.TCosmModelObj>(
//         parsedRawTransactions,
//         parsedModelsObj,
//         "TT_COSM"
//       );
//       break;
//     case "TPackModelObj":
//       builder = new EfficiencyModels.EfficiencyBuilder<EfficiencyTypes.TPackModelObj>(
//         parsedRawTransactions,
//         parsedModelsObj,
//         "TT_PACK"
//       );
//       break;
//     case "TOobaModelObj":
//       builder = new EfficiencyModels.EfficiencyBuilder<EfficiencyTypes.TOobaModelObj>(
//         parsedRawTransactions,
//         parsedModelsObj,
//         "TT_OOBA"
//       );
//       break;
//     default:
//       throw new Error(`Unknown model type: ${modelType}`);
//   }

//   const processedData = builder.getProcessedData();

//   // Send the processed data back to the main thread
//   postMessage({ processedData });
// });
