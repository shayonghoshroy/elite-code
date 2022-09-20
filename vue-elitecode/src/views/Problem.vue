<template>
    <!--
        <iframe
        src="https://codesandbox.io/embed/new?codemirror=1&highlights=6,7,8,9"
        style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
        allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
        sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
        ></iframe>
    -->
    <div class="content has-text-left">
        <h1>{{ problem.title }}</h1>
        <p>{{ problem.description }}</p>
        <h3>Examples</h3>
        <div v-for="example in problem.examples" :key="example.id">
            <p>{{ example }}</p>
        </div>
        <h3>Constraints</h3>
        <div v-for="constraint in problem.constraints" :key="constraint.id">
            <p>{{ constraint }}</p>
        </div>
    </div>
    <v-ace-editor
    v-model:value="script"
    @init="editorInit"
    lang="javascript"
    theme="dracula"
    style="height: 400px" />

    <form @submit.prevent="runScript"> 
        <p class="control">
            <button :disabled="!script" class="button is-info">
            Submit
            </button>
        </p>
               
    </form>

    <div class="title has-text-centered">
        {{result}}
    </div>

</template>

<script>
import { ref } from "vue";
import { collection, doc, getDoc } from "firebase/firestore";
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
            collection: collection(db, "problems"),
            problem_id: this.$route.params.id,
            problem: null,
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
                //this.result = new Function (this.script)(); 
                var args = 's'
                var F = new Function (args, this.script);
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
                // check if function returns a value

            } catch (error) {
                this.result = error; 
            }
            console.log("RESULT", this.result)

        },
        async setProblem() {
            // get problem from firebase collection
            const docRef = doc(this.collection, this.problem_id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const target_copy = Object.assign({}, docSnap.data());
                this.problem = target_copy;
            } else {
            // doc.data() will be undefined in this case
                console.log("No such document!");
            }
            
        }
    },
}    
</script>

<style>
</style>