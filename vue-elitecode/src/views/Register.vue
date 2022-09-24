<template>
    <h1>Create an Account</h1>
    <p><input type="text" placeholder="Email" v-model="email" /></p>
    <p><input type="password" placeholder="Password" v-model="password" /></p>
    <p><button @click="register">Submit</button></p>
    <p><button @click="signInWithGoogle">Sign In With Google</button></p>

    <!-- create user schedule modal -->
    <div class="modal" :class="{'is-active': showModalFlag}">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <!-- <button class="delete" aria-label="close" @click="cancelModal">></button> -->
                <h1 class="title">Let's Create a Schedule!</h1>
            </header>
            <section class="modal-card-body">
                <div class="field">
                    <label class="label">Job Level</label>
                    <div class="control">
                        <div class="select">
                            <select v-model="level">
                                <option>Junior</option>
                                <option>Mid-Level</option>
                                <option>Senior</option>
                            </select>
                        </div>
                        <label class="label">Which concepts do you want to learn?</label>
                        <div class="select">
                            <select v-model="concepts">
                                <option value="common">The most common ones</option>
                                <option value="all">All of them</option>
                            </select>
                        </div>
                    </div>
                    <label class="label">Time Frame</label>
                    <div class="select">
                        <select v-model="timeframe">
                            <option value="short">{{shortSchedule}} weeks</option>
                            <option value="long">{{longSchedule}} weeks</option>
                        </select>
                    </div>

                    <label class="label">You are required to complete exactly {{questionsPerWeek}} questions per week.</label>
                    <label class="label">Let's make a schedule that fits around your life.</label>
                    <label class="label">How many questions do you want to solve on each day of the week?</label>
                    <label class="label">Enter numbers only.</label>
                    <input v-model="monday" class="input mb-1" type="text" placeholder="Monday">
                    <input v-model="tuesday" class="input mb-1" type="text" placeholder="Tuesday">
                    <input v-model="wednesday" class="input mb-1" type="text" placeholder="Wednesday">
                    <input v-model="thursday" class="input mb-1" type="text" placeholder="Thursday">
                    <input v-model="friday" class="input mb-1" type="text" placeholder="Friday">
                    <input v-model="saturday" class="input mb-1" type="text" placeholder="Saturday">
                    <input v-model="sunday" class="input mb-1" type="text" placeholder="Sunday">

                    <label class="label">Questions per week: 
                        <!-- header is class result only if scheduledSum equals questionsPerWeek -->
                        <h3 class="title in-line" :class="{'result': scheduledSum == questionsPerWeek && scheduledSum != 0}" >{{scheduledSum}} / {{questionsPerWeek}}</h3>
                    </label>
                    
                </div>
            </section>
            <footer class="modal-card-foot">
            <button v-if="scheduledSum == questionsPerWeek && scheduledSum != 0" class="button flashcard-foot is-fullwidth is-focused is-success" @click="submitSchedule()">Submit</button>
            </footer>
        </div>
    </div>
</template>

<script>
    import { ref } from "vue";
    import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
    
    export default {
        data () {
            return {
                email: "",
                password: "",
                showModalFlag: false,
                okPressed: false,
                level: "",
                concepts: "",
                questionsPerWeek: 0,
                shortSchedule: 0,
                longSchedule: 0,
                timeframe: null,
                scheduledSum: 0,
                monday: null,
                tuesday: null,
                wednesday: null,
                thursday: null,
                friday: null,
                saturday: null,
                sunday: null,
            }
        },
        computed: {
            shortSchedule() {
                if (this.level == "Junior") {
                    if (this.concepts == "common") {
                        return 2;
                    } else {
                        return 3;
                    }
                } else if (this.level == "Mid-Level") {
                    if (this.concepts == "common") {
                        return 4;
                    } else {
                        return 6;
                    }
                } else {
                    if (this.concepts == "common") {
                        return 5;
                    } else {
                        return 9;
                    }
                }
            },
            longSchedule() {
                if (this.level == "Junior") {
                    if (this.concepts == "common") {
                        return 4;
                    } else {
                        return 6;
                    }
                } else if (this.level == "Mid-Level") {
                    if (this.concepts == "common") {
                        return 8;
                    } else {
                        return 12;
                    }
                } else {
                    if (this.concepts == "common") {
                        return 10;
                    } else {
                        return 13;
                    }
                }
            },
            questionsPerWeek() {
                if (this.level != "Senior") {
                    if (this.timeframe == "short") {
                        return 18
                    } else if (this.timeframe == "long") {
                        return 9
                    }
                } else {
                    if (this.timeframe == "short") {
                        return 13;
                    } else if (this.timeframe == "long") {
                        return 9;
                    } 
                }
                return 0;
            },
            scheduledSum() {
                // sum all the questions per day. if the day is null, set it to 0
                return parseInt(this.monday ? this.monday : 0) + parseInt(this.tuesday ? this.tuesday : 0) + parseInt(this.wednesday ? this.wednesday : 0) + parseInt(this.thursday ? this.thursday : 0) + parseInt(this.friday ? this.friday : 0) + parseInt(this.saturday ? this.saturday : 0) + parseInt(this.sunday ? this.sunday : 0);
            }
        },
        methods: {
            register() {
                console.log("register");
                createUserWithEmailAndPassword(getAuth(), this.email, this.password)
                    .then((userCredential) => {
                        // Signed in
                        const user = userCredential.user;
                        console.log("Successfully registered", user.email);
                        // create schedule
                        this.createSchedule(user.uid);
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.log("Error", errorCode, errorMessage);
                    });
            },
            signInWithGoogle() {
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

                        // create schedule for user
                        this.createSchedule(user.uid);
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
            },
            createSchedule(uid) {
                this.showModal()
                // push users to the home page
                //this.$router.push('/');
            },
            submitSchedule() {
                this.okModal();
                // push users to the home page
                this.$router.push('/');
            },
            showModal() {
                this.okPressed = false;
                this.showModalFlag = true;
            },
            
            okModal() {
                this.okPressed = true;
                this.showModalFlag = false;
            },
            cancelModal() {
                this.okPressed = false;
                this.showModalFlag = false;
            },
        },
    }    
</script>

<style>
    .select {
        /* mb 5 */
        margin-bottom: 1.25rem;
    }
    .in-line {
        /* inline display */
        display: inline-block;
        margin-top: 1rem;
    }
    .result {
        color: #00d1b2;
    }
</style>

