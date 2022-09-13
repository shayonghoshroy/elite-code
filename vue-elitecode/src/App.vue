<template>
  <nav>
    <router-link to="/">Home</router-link> | 
    <router-link to="/journal">Journal</router-link> | 
    <router-link to="/signin">Sign In</router-link> | 
    <router-link to="/register">Register</router-link> | 
    <button @click="handleSignOut" v-if="isLoggedIn">Sign Out</button>
  </nav>
  <router-view />
</template>

<script setup>
  import { onMounted, ref } from "vue";
  import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";  // firebase auth hook that changes on state change
  import router from "./router";

  const isLoggedIn = ref(false);

  let auth;
  onMounted(() => {
    auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        console.log("User is signed in");
        isLoggedIn.value = true;
      } else {
        // User is signed out
        console.log("User is signed out");
        isLoggedIn.value = false;
      }
    });
  });
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Successfully signed out");
        router.push("/signin");
      })
      .catch((error) => {
        console.log("Error signing out", error);
      });
  };
</script>