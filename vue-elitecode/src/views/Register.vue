<template>
    <h1>Create an Account</h1>
    <p><input type="text" placeholder="Email" v-model="email" /></p>
    <p><input type="password" placeholder="Password" v-model="password" /></p>
    <p><button @click="register">Submit</button></p>
    <p><button @click="signInWithGoogle">Sign In With Google</button></p>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const email = ref("");
const password = ref("");
const router = useRouter();


const register = () => {
    console.log("register");
    createUserWithEmailAndPassword(getAuth(), email.value, password.value)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log("Successfully registered", user.email);
            // push users to the home page
            router.push("/");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("Error", errorCode, errorMessage);
        });
};
const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    console.log('GOOG!');
    signInWithPopup(getAuth(), provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            console.log("Successfully signed in with Google", user.email);
            // push users to the home page
            router.push("/");
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            console.log("Error", errorCode, errorMessage, email, credential);
        });
};

</script>