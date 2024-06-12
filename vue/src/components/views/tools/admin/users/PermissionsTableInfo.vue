<template>
  <v-alert
    icon="$info"
    color="info"
    border="start"
    title="Fields Description"
    variant="tonal"
    class="mb-2"
  >
    <v-list lines="three" bg-color="transparent">
      <v-list-item>
        <v-list-item-title>{{ "Decision Maker" }}</v-list-item-title>

        <v-list-item-subtitle>
          {{
            "Indicates that this individual has the authority to make significant decisions within specific tools. Such individuals can, for example, approve PCNs and PCRs"
          }}
        </v-list-item-subtitle>
      </v-list-item>

      <v-list-item>
        <v-list-item-title>{{ "Confidentiality" }}</v-list-item-title>

        <v-list-item-subtitle>
          {{
            "Represents the level of access to information requiring confidentiality classifications: public, restricted, or secret. Access limitations apply to activities such as searching and displaying documents."
          }}
        </v-list-item-subtitle>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>{{ "Permission" }}</v-list-item-title>

        <v-list-item-subtitle>
          {{
            "Defines the user's permissions, which can include roles such as user, moderator, and admin. These permissions are primarily related to navigation within the site and access to specific tools."
          }}
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-alert>
</template>
