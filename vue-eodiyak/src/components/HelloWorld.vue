<template>
  <v-container
    fluid
    fill-height
    class="grey lighten-4"
  >
    <v-layout
      justify-center
      align-center
    >
      <v-flex shrink>
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-btn
              :href="source"
              icon
              large
              target="_blank"
              v-on="on"
            >
              <v-icon large>mdi-code-tags</v-icon>
            </v-btn>
          </template>
          <span>Source</span>
        </v-tooltip>
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              large
              href="https://codepen.io/johnjleider/pen/zgxbYO"
              target="_blank"
              v-on="on"
            >
              <v-icon large>mdi-codepen</v-icon>
            </v-btn>
          </template>
          <span>Codepen</span>
        </v-tooltip>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    }),
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
