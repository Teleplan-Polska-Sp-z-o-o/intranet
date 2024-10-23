<template>
  <v-card class="rounded-xl bg-surface-2 elevation-2 pa-4 pt-2 ma-1">
    <v-card-title class="text-h5">Structure</v-card-title>

    <v-card-text>
      This tool is designed to provide functionalities spread across programs, groups, and specific
      data management modules.

      <!-- Programs Section -->
      <v-list dense class="bg-surface-2" lines="two">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title><strong>Programs:</strong></v-list-item-title>
            <v-list-item-subtitle>
              Programs are the first level menu on the left, representing broad areas of
              functionality. Each program contains groups.
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <!-- Groups Section -->
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title><strong>Groups:</strong></v-list-item-title>
            <v-list-item-subtitle>
              Inside each program, you will find groups. These groups contain modules specific for
              that program, making it easier to access focused features.
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <!-- Modules Section -->
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title><strong>Modules:</strong></v-list-item-title>
            <v-list-item-subtitle>
              Modules are specific tools or features within a group. Each module serves a particular
              purpose, helping users perform focused tasks related to the group or program they
              belong to. While groups organize related functionality, modules are where the actual
              actions or processes take place.
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <!-- Modules Explained Section -->
      <v-list dense class="bg-surface-2" lines="three">
        <v-list-item-group>
          <v-list-item>
            <template v-slot:prepend>
              <v-icon icon="mdi-folder-file-outline"></v-icon>
            </template>
            <v-list-item-content>
              <v-list-item-title>Drive Module: </v-list-item-title>
              <v-list-item-subtitle>
                The Drive Module functions as an file management system, similar to Google Drive,
                with the ability to upload, update, delete, and download files. Users can also view
                files in a dialog window, examine detailed file information, and review the creation
                and update history. Additionally, it provides the option to restore previous
                versions of files.
              </v-list-item-subtitle>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title
                    >When uploading or updating a file, users are required to select a file type.
                    There are three main types:
                  </v-list-item-title>
                  <p class="ms-2">
                    <b>Models:</b> Files that store data related to the model's IFS part number,
                    group name, and group letter, along with the times required for processing each
                    model.
                  </p>
                  <p class="ms-2">
                    <b>Planning:</b> Files containing rows with dates, line information, group
                    letter, and the quantity of planned models (of that letter) scheduled for
                    processing.
                  </p>
                  <p class="ms-2">
                    <b>Miscellaneous:</b> Files that do not fit the 'Models' or 'Planning'
                    categories, serving as helper files for various purposes.
                  </p>
                </v-list-item-content>
              </v-list-item>

              <v-alert type="info" variant="tonal" border="start">
                <strong>Important:</strong> The current Drive module only supports Excel files for
                upload and management. Please ensure that all files you upload are in Excel format
                (.xls, .xlsx) to avoid errors.
              </v-alert>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title
                    >Files that are monitored for any changes made, such as the modification date
                    which trigger an automatic upload:
                  </v-list-item-title>
                  <p class="ms-2"><b>Auto-plan update</b> required for planning of sky packing.</p>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <template v-slot:prepend>
              <v-icon icon="mdi-chart-box-multiple-outline"></v-icon>
            </template>
            <v-list-item-content>
              <v-list-item-title>Overview Module: </v-list-item-title>
              <v-list-item-subtitle>
                The Overview Module is designed to retrieve raw transaction data and display it in a
                table format, allowing users to interact with and filter the data efficiently. It
                provides options to search through the data or apply filters to refine the results.
              </v-list-item-subtitle>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>The filtering options include: </v-list-item-title>
                  <p class="ms-2">
                    <b>Contracts:</b> Users can optionally specify which contracts to include. By
                    default, all contracts are selected.
                  </p>
                  <p class="ms-2">
                    <b>Date Range:</b> Users can filter the data based on a selected date range. By
                    default, today's data is displayed.
                  </p>
                </v-list-item-content>
              </v-list-item>

              <p class="pb-4">
                Below the data table, general analytic tables specific to the selected program and
                group are displayed, offering deeper insights and analytics related to the filtered
                transactions.
              </p>

              <v-alert type="info" variant="tonal" border="start">
                <strong>Important:</strong> Data is automatically refreshed behind the scenes once
                every minute. The first load may take longer depending on the complexity of the data
                being retrieved.
              </v-alert>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card-text>
  </v-card>
</template>
