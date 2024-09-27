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
      </v-list>

      <!-- Example Description Section -->
      <!-- <v-list dense class="bg-surface-2" lines="two">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <strong>Example:</strong>
            </v-list-item-title>
            <v-list-item-subtitle>
              The <strong>Packing</strong> group, part of the <strong>SKY</strong> program, provides
              modules for managing data storage, operational planning, and performance tracking
              through key performance indicators.
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list> -->

      <!-- Packing Category Features Section -->
      <v-list dense class="bg-surface-2" lines="two">
        <v-list-item-group>
          <!-- File Drive Section -->
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <strong>Features of the 'Drive' Modules</strong>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <!-- Models in File Drive -->
          <v-list-item>
            <template v-slot:prepend>
              <v-icon icon="mdi-cube"></v-icon>
            </template>
            <v-list-item-content>
              <v-list-item-title>Models</v-list-item-title>
              <v-list-item-subtitle>
                Manage files related to operational models, including tables for model letters,
                groups, and other model-specific data.
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <!-- Planning in File Drive -->
          <v-list-item>
            <template v-slot:prepend>
              <v-icon icon="mdi-calendar-multiselect"></v-icon>
            </template>
            <v-list-item-content>
              <v-list-item-title>Planning</v-list-item-title>
              <v-list-item-subtitle>
                Store and manage files containing planning data, including scheduling and resources
                allocation for packing operations.
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <!-- Miscellaneous in File Drive -->
          <v-list-item>
            <template v-slot:prepend>
              <v-icon icon="mdi-folder"></v-icon>
            </template>
            <v-list-item-content>
              <v-list-item-title>Miscellaneous</v-list-item-title>
              <v-list-item-subtitle>
                Upload and manage additional files, such as supporting documents or files that don’t
                fit into other specific categories.
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <!-- KPI Section -->
          <!-- <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <strong>Features of the 'Data' Module in Packing:</strong>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>-->

          <!-- KPI Tables & Graphs in KPI Module -->
          <!-- <v-list-item>
            <template v-slot:prepend>
              <v-icon icon="mdi-chart-line"></v-icon>
            </template>
            <v-list-item-content>
              <v-list-item-title>KPI Tables</v-list-item-title>
              <v-list-item-subtitle>
                This section provides access to Key Performance Indicators (KPIs) and visual
                representations of packing performance metrics.
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>  -->
        </v-list-item-group>
      </v-list>
    </v-card-text>
  </v-card>
</template>
