<template>
    
    <div class="flexbox mt-5">
        <div class="flexbox-item">
            <div class="flexbox-item-content">
                <h1 class="title main-title">Create an Account</h1>
                <p class="control mb-2">
                    <input v-model="email" class="input" type="text" placeholder="Email">
                </p>
                <p class="control mb-2">
                    <input v-model="password" class="input" type="password" placeholder="Password">
                </p>
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
                    <label class="label">How long should this take? A shorter time frame means a higher workload.</label>
                    <div class="select">
                        <select v-model="timeframe">
                            <option value="short">{{shortSchedule}} weeks</option>
                            <option value="long">{{longSchedule}} weeks</option>
                        </select>
                    </div>

                    <label class="label">You are required to complete exactly  <h3 class="title in-line">{{questionsPerWeek}}</h3> questions per week.</label>
                    <label class="label">Let's make a schedule that fits around your life.</label>
                    <label class="label">How many questions do you want to solve on each day of the week?</label>
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
            <button v-if="scheduledSum == questionsPerWeek && scheduledSum != 0" class="button flashcard-foot is-fullwidth is-focused is-success" @click="submitSchedule(questionsPerWeek, shortSchedule, longSchedule)">Submit</button>
            </footer>
        </div>
    </div>
</template>

<script>
    import { ref } from "vue";
    import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
    import { collection, addDoc, setDoc, doc } from "firebase/firestore";
    import { db } from '@/firebase';
    
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
                requiredConcepts: ["String", "Array", "Graphs", "Linked Lists", "Sorting Algorithms", "Tree"],
                extraConcepts: ["Number Theory", "Bit Manipulation", "Dynamic Programming"]
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
                        return 15;
                    }
                }
            },
            questionsPerWeek() {
                if (this.level == "Senior" && this.concepts == "all") {
                    if (this.timeframe == "short") {
                        return 15
                    } else if (this.timeframe == "long") {
                        return 9
                    }
                } else {
                    if (this.timeframe == "short") {
                        return 18
                    } else if (this.timeframe == "long") {
                        return 9
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
            completeResgistration() {
                // close modal, push users to the home page
                this.okModal();
                this.$router.push('/');
            },
            submitSchedule(questionsPerWeek, shortSchedule, longSchedule) {
                // create schedule
                // create a dictionary of the week where the key is the day if it is not null and the value is the number of questions for that day
                let weeklySchedule = {};
                if (this.monday) {
                    weeklySchedule["Monday"] = this.monday;
                }
                if (this.tuesday) {
                    weeklySchedule["Tuesday"] = this.tuesday;
                }
                if (this.wednesday) {
                    weeklySchedule["Wednesday"] = this.wednesday;
                }
                if (this.thursday) {
                    weeklySchedule["Thursday"] = this.thursday;
                }
                if (this.friday) {
                    weeklySchedule["Friday"] = this.friday;
                }
                if (this.saturday) {
                    weeklySchedule["Saturday"] = this.saturday;
                }
                if (this.sunday) {
                    weeklySchedule["Sunday"] = this.sunday;
                }
                
                // create user's schedule

                // total number of weeks in schedule
                var weeks = 0;
                if (this.timeframe == shortSchedule) {
                    weeks = shortSchedule
                } else {
                    weeks = longSchedule
                }
                
                // counters
                var conceptCounter = 0
                var conceptIndex = 0
                // keep track of current difficulty level
                var difficulty = 'easy'
                var repeats = 0

                var currentSchedule = {}
                var dayIndex = 0
                for (const [key, value] of Object.entries(weeklySchedule)) {
                    currentSchedule[key] = 0
                }
                //console.log(currentSchedule)
                //console.log(Object.keys(currentSchedule)[0])
                var dayIndex = 0
                var day = Object.keys(currentSchedule)[dayIndex]

                if (this.concepts == "all") {
                    this.requiredConcepts.push.apply(this.requiredConcepts, this.extraConcepts)
                }

                //console.log("DIFFICULTY LEVEL:", difficulty)
                //console.log('\n')
                
                var scheduleArray = [] // final user schedule, an array of dicts
                for(let i = 1; i <= weeks; i++) {
                    //console.log('week',i)
                    //console.log(questionsPerWeek)
                    var weekDict = {} // dictionary for each week
                    for(let j = 1; j <= questionsPerWeek; j++) {
                        if (conceptCounter == 3) {
                            conceptIndex += 1
                            conceptCounter = 0
                        } 
                        if (conceptIndex >= this.requiredConcepts.length){
                            conceptIndex = 0
                            repeats += 1
                            if (repeats == 2) {
                                difficulty = "medium"
                                //console.log("DIFFICULTY LEVEL:", difficulty)
                            }
                            if (repeats == 4) {
                                difficulty = "hard"
                                //console.log("DIFFICULTY LEVEL:", difficulty)
                            }
                        }
                        if (currentSchedule[day] == weeklySchedule[day]) {
                            dayIndex += 1
                            day = Object.keys(currentSchedule)[dayIndex]
                        }
                        
                        // add the concept and its difficulty to week dict
                        var newConceptDict = {};
                        newConceptDict[this.requiredConcepts[conceptIndex]] = difficulty;
                        // if weekDict[day] is undefined, set it to the new array otherwise push the array
                        if (weekDict[day] == undefined) {
                            weekDict[day] = []
                        }
                        weekDict[day].push(newConceptDict)

                        conceptCounter += 1
                        currentSchedule[day] += 1
                    }
                    scheduleArray.push(weekDict) // push the week into the schedule

                    // reset currentSchedule after each week
                    //console.log(currentSchedule)
                    dayIndex = 0
                    var day = Object.keys(currentSchedule)[dayIndex]
                    for (const [key, value] of Object.entries(weeklySchedule)) {
                        currentSchedule[key] = 0
                    }
                    
                    //console.log('\n')
                    
                }
                for (const [key, value] of Object.entries(scheduleArray)) {
                    console.log(key, value)
                }

                console.log(getAuth().currentUser.uid)
                // add schedule to firebase database where the id of the document is the current users uid
                var scheduleCollection = collection(db, "schedules");
                setDoc(doc(scheduleCollection, getAuth().currentUser.uid), {
                    schedule: scheduleArray
                });
                /*
                // Add a new document with a generated id.
                const docRef = setDoc(scheduleCollection, {
                    schedule: scheduleArray,
                    uid: getAuth().currentUser.uid
                });
                */

                this.completeResgistration();
                
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
    .title {
        color: black;
    }
    .main-title {
        /* white */
        color: white;
    }

    
</style>
