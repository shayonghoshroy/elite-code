<template>
  <nav class="navbar is-warning" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="/">
        <img class="mr-1" src="/logo.png" width="28" height="28"> ELITECODE
      </a>
      <!-- add a span veritcal line -->
      
    </div>

    <div id="navbarBasicExample" class="navbar-menu">
      <div class="navbar-start">
        <a href="/problems" class="navbar-item">
          Problems
        </a>


        <a href="journal" class="navbar-item">
          Journal
        </a>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons auth">
            <div v-if="isLoggedIn" >
              <a class="button is-info" @click="handleSignOut" >
                <strong>Sign out</strong>
              </a>
            </div>
            <!-- both buttons in div are next to each other horizontally -->

            <div class="auth" v-else>
              <a href="register" class="button is-success">
                <strong>Create an account</strong>
              </a>
              <a href="signin" class="button is-info">
                <strong>Sign in</strong>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <router-view />
</template>

<script setup>
  import { onMounted, ref } from "vue";
  import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";  // firebase auth hook that changes on state change
  import router from "./router";
  import { db } from '@/firebase';
  

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

<style>
  @import 'bulma/css/bulma.css';
  @import 'assets/base.css';
  @import '@creativebulma/bulma-divider';

  .auth {
    display: flex;
    flex-direction: row;
  }
</style>
