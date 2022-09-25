<template>
    <!-- flexbox with two rows each taking up half of the box -->
    <div class="columns">
        <div class="column is-one-third">
            <div class="has-text-left">
                <h1 class="title mt-5 mb-2">{{ problem.title }}</h1>
                <p class="content">{{ problem.description }}</p>
                <h3 class="title mt-5 mb-2">Examples</h3>
                <div v-for="example in problem.examples" :key="example.id">
                    <li>{{ example }}</li>
                </div>
                <h3 class="title mt-5">Constraints</h3>
                <div v-for="constraint in problem.constraints" :key="constraint.id">
                    <li>{{ constraint }}</li>
                </div>
                <!-- add some blank space -->
                <div class="mt-5"></div>
            </div>
        </div>
        <div class="column is-two-thirds">
            <v-ace-editor
                v-model:value="script"
                @init="editorInit"
                lang="javascript"
                theme="dracula"
                style="height: 800px" />

            <form @submit.prevent="runScript"> 
                <p class="control">
                    <button :disabled="!script" class="button is-success submit-button">
                    Submit
                    </button>
                </p>
            </form>
        </div>
    </div>
    <!--
        <iframe
        src="https://codesandbox.io/embed/new?codemirror=1&highlights=6,7,8,9"
        style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
        allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
        sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
        ></iframe>
    -->
    
    

    <div class="title has-text-centered">
        {{result}}
    </div>

    <!-- save to journal modal -->
    <div class="modal" :class="{'is-active': showModalFlag}">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <button class="delete" aria-label="close" @click="cancelModal">></button>
                <h1 class="title modal-card-head-title">CORRECT!</h1>
            </header>
            <section class="modal-card-body">
            <div class="content">
                <p class="control has-text-centered">
                    Summarize your solution.
                </p>
                <p class="control is-expanded">
                    <input v-model="newEntrySolution" class="input" type="text" placeholder="Created a hashmap...">
                </p>
            </div>
            </section>
            <footer class="modal-card-foot">
            <button class="button flashcard-foot is-fullwidth is-focused is-success" @click="submitEntry()">Submit</button>
            </footer>
        </div>
    </div>

</template>

<script>
import { ref } from "vue";
import { collection, doc, getDoc, addDoc, query, where, getDocs, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from '@/firebase';
import { VAceEditor } from 'vue3-ace-editor';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-dracula';

export default {
    components: {
        VAceEditor,
    },
    data () {
        return {
            script: "",
            result: "",
            problemCollection: collection(db, "problems"),
            entryCollection: collection(db, "entries"),
            problem_id: this.$route.params.id,
            problem: null,
            showModalFlag: false,
            okPressed: false,
            newEntrySolution: "",
        }
    },
    beforeMount: function () {
        this.setProblem();
    },
    methods: {
        runScript() {
            // run user code, return any errors
            // by creating a new function instead of using eval(), all variables are locally scoped and its safer
            try { 
                var F = new Function (this.problem.args, this.script);
                // loop thru all testcases in problem
                for (const [key, value] of Object.entries(this.problem.testcases)) {
                    // run user code on each testcase
                    var user_result = F(key);
                    console.log(key, value)
                    // compare user result to expected result
                    if (user_result != value) {
                        this.result = "Failed on test case '" + key + "'. Expected '" + value + "' but got " + user_result;
                        return;
                    }
                }
                this.result = "Correct!";
                // modal to save to users journal
                this.showModalFlag = true;
            } catch (error) {
                this.result = error; 
            }
            console.log("RESULT", this.result)

        },
        async setProblem() {
            // get problem from firebase collection
            const docRef = doc(this.problemCollection, this.problem_id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const target_copy = Object.assign({}, docSnap.data());
                this.problem = target_copy;
            } else {
            // doc.data() will be undefined in this case
                console.log("No such document!");
            }
            
        },
        async submitEntry() {
            // save to users journal
            console.log("submitting entry...", this.newEntrySolution);
            // check if doc exists
            const q = query(this.entryCollection, where("title", "==", this.problem.title));

            var docId = "";
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                docId = doc.id
            });

            if (querySnapshot.empty) {
                console.log('no exists!')
                // Add a new document with a generated id.
                addDoc(this.entryCollection, {
                    title: this.problem.title,
                    solution: this.newEntrySolution,
                    isDone: false,
                    uid: getAuth().currentUser.uid,
                });
            } else {
                console.log("exists");
                // update document
                updateDoc(doc(this.entryCollection, docId), {
                    solution: this.newEntrySolution
                });
            }
            
            this.newEntrySolution = "";
            // force user to Journal page
            this.$router.push('/journal');
        },
        showModal() {
            this.okPressed = false;
            this.showModalFlag = true;
        },
        
        okModal() {
            setRandomEntry();
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
    .modal-card-head-title {
        margin-left: auto;
        margin-right: auto;
        animation: color-change 5s infinite;
    }
    @keyframes color-change {
        0% {
    color: blue;
        }
        10% {
            color: #8e44ad;
        }
        20% {
            color: #1abc9c;
        }
        30% {
            color: #d35400;
        }
        40% {
            color: blue;
        }
        50% {
            color: #34495e;
        }
        60% {
            color: blue;
        }
        70% {
            color: #2980b9;
        }
        80% {
            color: #f1c40f;
        }
        90% {
            color: #2980b9;
        }
        100% {
            color: pink;
        }      
    }

    .flex-container {
        display: flex;
        flex-direction: row;
    }
    .submit-button {
        /* wider */
        width: 100%;
    }

    body {
        /* push footer to bottom */
        display: flex;
        min-height: 100vh;
        flex-direction: column;
        
    }
</style>