<template>
    <div class="flexbox mt-5">
        <div class="flexbox-item">
            <div class="flexbox-item-content">
                <h1 class="title">Sign In</h1>
                <p class="control mb-2">
                    <input v-model="email" class="input" type="text" placeholder="Email">
                </p>
                <p class="control mb-2">
                    <input v-model="password" class="input" type="password" placeholder="Password">
                </p>
                <p v-if="errMsg">{{ errMsg }}</p>
                <p class="control">
                    <button class="button is-success" @click="register">Submit</button>
                </p>
                <!-- line -->
                <div class="divider">or you can</div>
                <p class="control mb-5">
                    <button class="button is-info" @click="signInWithGoogle">Sign In With Google</button>
                </p>
                
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const email = ref("");
const password = ref("");
const errMsg = ref("");  // error messages
const router = useRouter();  // vue router

const register = () => {
    console.log("register");
    signInWithEmailAndPassword(getAuth(), email.value, password.value)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log("Successfully signed in", user.email);
            // push users to the home page
            router.push("/");
        })
        .catch((error) => {
            console.log(error.code);
            switch (error.code) {
                case "auth/invalid-email ":
                    errMsg.value = "Invalid email";
                    break;
                case "auth/user-not-found":
                    errMsg.value = "No account with that email was found";
                    break;
                case "auth/wrong-password":
                    errMsg.value = "Incorrect password";
                    break ;
                default:
                    errMsg.value = "Email or password was incorrect";
                    break;
            }
        });
};
const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
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

<style>
    .flexbox-item-content {
        /* flexbox item content */
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
    }
    .control {
        /* wider */
        width: 30%;
    }
    .button {
        /* wider */
        width: 100%;
    }
    body {
        height: 100vh;
    }
</style>